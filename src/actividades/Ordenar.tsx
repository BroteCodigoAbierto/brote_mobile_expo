import { useState } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import ElementoRespuesta from "../componentes/ElementoRespuesta";
import LugarElemento from "../componentes/LugarElemento";
import Texto from "../componentes/Texto";
import ZonaElementos from "../componentes/ZonaElementos";
import { espacio } from "../constantes/tema";
import { nombreDeContenido } from "../utilidades/actividades";
import { esImagen } from "../utilidades/imagenes";
import {
  colocarEnPrimerLibre,
  detalleOrdenar,
  lugaresVacios,
  mezclarSinResolver,
  primerLibre,
  quitarDeLugar,
  SIN_COLOCAR,
  soltarEnLugares,
  type Lugares,
} from "../utilidades/relacionar";
import Arrastrable from "./arrastre/Arrastrable";
import DestinoArrastre from "./arrastre/DestinoArrastre";
import { useArrastrarElemento } from "./arrastre/useArrastrarElemento";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Ordenar (spec F11): se llenan los lugares numerados, pulsando cada elemento o arrastrándolo a
// un lugar en concreto. Se acierta solo si todos quedan en su lugar. Desde F13, los elementos
// pueden ser imágenes: mosaicos, y los lugares miden lo que un mosaico.
export default function Ordenar({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"ordenar">) {
  const { elementos } = actividad;
  const [orden] = useState(() => mezclarSinResolver(elementos.length));
  const [lugares, setLugares] = useState<Lugares>(() => lugaresVacios(elementos.length));
  const [comprobada, setComprobada] = useState(false);
  const completa = primerLibre(lugares) === -1;
  const acerto = lugares.every((elemento, lugar) => elemento === lugar);
  // F13: los elementos son todos textos o todos imágenes; "Imagen {n}" por su lugar al empezar
  const conImagenes = elementos.some(esImagen);

  function textoDe(elemento: number): string {
    return nombreDeContenido(elementos[elemento] ?? "", orden.indexOf(elemento) + 1);
  }

  const arrastre = useArrastrarElemento<number, number | typeof SIN_COLOCAR>({
    alSoltar: (item, destino) => cambiar(soltarEnLugares(lugares, item, destino), item),
  });

  function cambiar(nuevos: Lugares, elemento: number) {
    const lugar = nuevos.indexOf(elemento);
    const texto = textoDe(elemento);
    setLugares(nuevos);
    alInteractuar();
    AccessibilityInfo.announceForAccessibility(
      lugar === -1 ? `${texto} sin colocar` : `${texto} en el lugar ${lugar + 1}`,
    );
  }

  function pulsar(elemento: number) {
    if (comprobada || !arrastre.pulsoPermitido()) return;
    const colocado = lugares.includes(elemento);
    cambiar(
      colocado ? quitarDeLugar(lugares, elemento) : colocarEnPrimerLibre(lugares, elemento),
      elemento,
    );
  }

  function dibujar(elemento: number, lugar: number | null) {
    const texto = textoDe(elemento);
    const contenido = elementos[elemento] ?? "";
    const imagen = esImagen(contenido) ? contenido : undefined;
    const correcto = elemento === lugar;
    const partes = [
      texto,
      lugar !== null && `lugar ${lugar + 1}`,
      comprobada && (correcto ? "correcto" : "incorrecto"),
    ];
    return (
      <Arrastrable
        key={elemento}
        arrastre={arrastre}
        item={elemento}
        texto={texto}
        forma={imagen ? "mosaico" : "tarjeta"}
        imagen={imagen}
        deshabilitado={comprobada}
      >
        <ElementoRespuesta
          {...(imagen ? { imagen, forma: "mosaico" as const } : { texto })}
          estado={comprobada ? (correcto ? "correcta" : "incorrecta") : "normal"}
          atenuada={arrastre.item === elemento}
          deshabilitada={comprobada}
          etiqueta={partes.filter(Boolean).join(", ")}
          alPulsar={() => pulsar(elemento)}
        />
      </Arrastrable>
    );
  }

  const barra = comprobada ? (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      {...(acerto ? {} : detalleOrdenar(actividad))}
      textoBoton="Continuar"
      alPulsar={() => alTerminar(acerto ? "acierto" : "fallo")}
    />
  ) : (
    <BarraRespuesta
      estado="neutro"
      textoBoton="Comprobar"
      deshabilitado={!completa}
      alPulsar={() => setComprobada(true)}
    />
  );

  return (
    <MarcoActividad barra={barra} arrastre={arrastre}>
      <Texto variante="titulo2" accessibilityRole="header">
        {actividad.consigna}
      </Texto>
      <View style={styles.lugares}>
        {lugares.map((elemento, lugar) => (
          <DestinoArrastre key={lugar} arrastre={arrastre} destino={lugar}>
            <LugarElemento
              numero={lugar + 1}
              mosaico={conImagenes}
              estado={comprobada ? (elemento === lugar ? "correcto" : "incorrecto") : "normal"}
              resaltado={arrastre.destino === lugar}
              etiqueta={`Lugar ${lugar + 1}, vacío`}
            >
              {elemento === null ? undefined : dibujar(elemento, lugar)}
            </LugarElemento>
          </DestinoArrastre>
        ))}
      </View>
      <DestinoArrastre arrastre={arrastre} destino={SIN_COLOCAR}>
        <ZonaElementos
          etiqueta="Elementos sin colocar"
          resaltada={arrastre.destino === SIN_COLOCAR}
        >
          {orden.filter((elemento) => !lugares.includes(elemento)).map((e) => dibujar(e, null))}
        </ZonaElementos>
      </DestinoArrastre>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  lugares: {
    gap: espacio[3],
  },
});
