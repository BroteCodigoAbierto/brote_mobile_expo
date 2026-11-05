import { useCallback, useEffect, useRef, useState, type ComponentRef, type RefObject } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import type { FormaElemento } from "../../componentes/ElementoRespuesta";

// A esta distancia del borde de lo visible, la pantalla se desplaza sola.
const BORDE_DESPLAZAR = 72;
const PASO_DESPLAZAR = 8;
// El toque que termina un arrastre no debe contar también como pulsar.
const PAUSA_TRAS_SOLTAR_MS = 300;

// Primitivos, para comparar el origen y el destino con ===.
export type Clave = string | number;

export type VistaNativa = ComponentRef<typeof View>;
type Desplazable = ComponentRef<typeof ScrollView>;

type Rectangulo = { x: number; y: number; ancho: number; alto: number };

export type DatosCopia = { texto: string; forma: FormaElemento };

export type CopiaArrastre = DatosCopia & { ancho: number };

type OpcionesArrastrar<I extends Clave, D extends Clave> = {
  alSoltar: (item: I, destino: D) => void;
  alEmpezar?: () => void;
  // para que no se resalte lo que no es un destino de este elemento
  acepta?: (item: I, destino: D) => boolean;
};

// Lo que usa MarcoActividad: su ScrollView y la capa de la copia.
export type MarcoArrastre = {
  arrastrando: boolean;
  copia: CopiaArrastre | null;
  x: SharedValue<number>;
  y: SharedValue<number>;
  refCapa: RefObject<VistaNativa | null>;
  refZona: RefObject<VistaNativa | null>;
  refDesplazamiento: RefObject<Desplazable | null>;
  alDesplazar: (evento: NativeSyntheticEvent<NativeScrollEvent>) => void;
  alCambiarContenido: (ancho: number, alto: number) => void;
};

function medir(vista: VistaNativa | null): Promise<Rectangulo | null> {
  return new Promise((resolver) => {
    if (!vista) resolver(null);
    else vista.measureInWindow((x, y, ancho, alto) => resolver({ x, y, ancho, alto }));
  });
}

// Arrastrar con el dedo (spec F11; brote_specs, research de F11, punto 3). Los destinos se
// miden una vez al empezar: nada cambia de lugar mientras se arrastra, solo se desplaza la
// pantalla, y eso se corrige con lo que se haya desplazado. Lo que cambia en cada cuadro
// vive en un ref y no en el estado, para no volver a dibujar la actividad por cada cuadro.
export function useArrastrarElemento<I extends Clave, D extends Clave>({
  alSoltar,
  alEmpezar,
  acepta,
}: OpcionesArrastrar<I, D>) {
  const [item, setItem] = useState<I | null>(null);
  const [destino, setDestino] = useState<D | null>(null);
  const [copia, setCopia] = useState<CopiaArrastre | null>(null);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const refCapa = useRef<VistaNativa>(null);
  const refZona = useRef<VistaNativa>(null);
  const refDesplazamiento = useRef<Desplazable>(null);
  const destinos = useRef(new Map<D, VistaNativa>());
  const opciones = useRef({ alSoltar, alEmpezar, acepta });
  const vivo = useRef({
    item: null as I | null,
    destino: null as D | null,
    dedoX: 0,
    dedoY: 0,
    // dónde agarró el dedo al elemento, para que la copia no salte
    agarreX: 0,
    agarreY: 0,
    capaX: 0,
    capaY: 0,
    zona: null as Rectangulo | null,
    rectangulos: new Map<D, Rectangulo>(),
    desplazamiento: 0,
    desplazamientoAlMedir: 0,
    altoContenido: 0,
    ultimoFin: 0,
    cuadro: null as number | null,
  });

  useEffect(() => {
    opciones.current = { alSoltar, alEmpezar, acepta };
  });

  const moverCopia = useCallback(() => {
    const v = vivo.current;
    x.set(v.dedoX - v.agarreX - v.capaX);
    y.set(v.dedoY - v.agarreY - v.capaY);
  }, [x, y]);

  const actualizarDestino = useCallback(() => {
    const v = vivo.current;
    if (v.item === null) return;
    const { item: arrastrado, dedoX, dedoY, zona } = v;
    const corrimiento = v.desplazamiento - v.desplazamientoAlMedir;
    // lo que el desplazamiento dejó debajo de la barra o del encabezado no se puede soltar
    const aLaVista = zona !== null && dedoY >= zona.y && dedoY <= zona.y + zona.alto;
    let encontrado: D | null = null;
    if (aLaVista) {
      for (const [id, { x: izquierda, y: arriba, ancho, alto }] of v.rectangulos) {
        const top = arriba - corrimiento;
        const debajo =
          dedoX >= izquierda && dedoX <= izquierda + ancho && dedoY >= top && dedoY <= top + alto;
        if (debajo && (opciones.current.acepta?.(arrastrado, id) ?? true)) {
          encontrado = id;
          break;
        }
      }
    }
    if (encontrado !== v.destino) {
      v.destino = encontrado;
      setDestino(encontrado);
    }
  }, []);

  const desplazarCercaDelBorde = useCallback(() => {
    const v = vivo.current;
    if (!v.zona) return;
    const { y: arriba, alto } = v.zona;
    let direccion = 0;
    if (v.dedoY < arriba + BORDE_DESPLAZAR) direccion = -1;
    else if (v.dedoY > arriba + alto - BORDE_DESPLAZAR) direccion = 1;
    const maximo = Math.max(0, v.altoContenido - alto);
    const siguiente = Math.min(maximo, Math.max(0, v.desplazamiento + direccion * PASO_DESPLAZAR));
    if (siguiente === v.desplazamiento) return;
    v.desplazamiento = siguiente;
    refDesplazamiento.current?.scrollTo({ y: siguiente, animated: false });
    actualizarDestino();
  }, [actualizarDestino]);

  const iniciar = useCallback(
    async (
      nuevo: I,
      vista: VistaNativa | null,
      datos: DatosCopia,
      dedoX: number,
      dedoY: number,
    ) => {
      const v = vivo.current;
      if (v.item !== null) return;
      v.item = nuevo;
      v.dedoX = dedoX;
      v.dedoY = dedoY;
      v.desplazamientoAlMedir = v.desplazamiento;
      setItem(nuevo);
      opciones.current.alEmpezar?.();

      const ids = [...destinos.current.keys()];
      const [origen, capa, zona, ...medidos] = await Promise.all([
        medir(vista),
        medir(refCapa.current),
        medir(refZona.current),
        ...ids.map((id) => medir(destinos.current.get(id) ?? null)),
      ]);
      // el dedo pudo soltarse mientras se medía
      if (v.item !== nuevo || !origen || !capa) return;
      v.agarreX = dedoX - origen.x;
      v.agarreY = dedoY - origen.y;
      v.capaX = capa.x;
      v.capaY = capa.y;
      v.zona = zona;
      v.rectangulos = new Map();
      medidos.forEach((rectangulo, i) => {
        const id = ids[i];
        if (rectangulo && id !== undefined) v.rectangulos.set(id, rectangulo);
      });
      moverCopia();
      setCopia({ ...datos, ancho: origen.ancho });
      actualizarDestino();

      function cuadro() {
        desplazarCercaDelBorde();
        v.cuadro = requestAnimationFrame(cuadro);
      }
      v.cuadro = requestAnimationFrame(cuadro);
    },
    [actualizarDestino, desplazarCercaDelBorde, moverCopia],
  );

  const mover = useCallback(
    (dedoX: number, dedoY: number) => {
      const v = vivo.current;
      if (v.item === null) return;
      v.dedoX = dedoX;
      v.dedoY = dedoY;
      moverCopia();
      actualizarDestino();
    },
    [actualizarDestino, moverCopia],
  );

  // Dice qué elemento termina: el gesto de otro dedo que falla no debe cortar este arrastre.
  // `cancelado` también es un gesto que nunca se activó: un toque o un deslizamiento.
  const terminar = useCallback((elemento: I, cancelado: boolean) => {
    const v = vivo.current;
    if (v.item !== elemento) return;
    const destinoFinal = v.destino;
    if (v.cuadro !== null) cancelAnimationFrame(v.cuadro);
    v.cuadro = null;
    v.item = null;
    v.destino = null;
    v.ultimoFin = Date.now();
    setItem(null);
    setDestino(null);
    setCopia(null);
    if (!cancelado && destinoFinal !== null) opciones.current.alSoltar(elemento, destinoFinal);
  }, []);

  const registrarDestino = useCallback((id: D, vista: VistaNativa | null) => {
    if (vista) destinos.current.set(id, vista);
    else destinos.current.delete(id);
  }, []);

  // Pulsar y arrastrar no se mezclan: ni otro dedo mientras se arrastra, ni el toque que soltó.
  const pulsoPermitido = useCallback(() => {
    const v = vivo.current;
    return v.item === null && Date.now() - v.ultimoFin > PAUSA_TRAS_SOLTAR_MS;
  }, []);

  const alDesplazar = useCallback((evento: NativeSyntheticEvent<NativeScrollEvent>) => {
    vivo.current.desplazamiento = evento.nativeEvent.contentOffset.y;
  }, []);

  const alCambiarContenido = useCallback((_ancho: number, alto: number) => {
    vivo.current.altoContenido = alto;
  }, []);

  return {
    arrastrando: item !== null,
    item,
    destino,
    copia,
    x,
    y,
    refCapa,
    refZona,
    refDesplazamiento,
    iniciar,
    mover,
    terminar,
    registrarDestino,
    pulsoPermitido,
    alDesplazar,
    alCambiarContenido,
  };
}

export type Arrastre<I extends Clave, D extends Clave> = ReturnType<
  typeof useArrastrarElemento<I, D>
>;
