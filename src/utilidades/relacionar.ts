import type {
  ActividadBancoPalabras,
  ActividadClasificar,
  ActividadEmparejar,
  ActividadOrdenar,
} from "../tipos/contrato";
import { mezclar, partirEnEspacios } from "./actividades";

// Reglas de las actividades de relacionar (spec F11; brote_specs, research de F11, puntos
// 1, 5 y 6). Son funciones puras: pulsar y soltar solo traducen un gesto a una de ellas,
// así que los dos gestos dan siempre lo mismo. La web tiene las mismas funciones.

// --- Emparejar --------------------------------------------------------------

export type Lado = "izquierda" | "derecha";

export type ElementoPareja = {
  lado: Lado;
  indice: number; // en `actividad.parejas`, en los dos lados
};

// `numero` es el que se ve en los dos elementos.
export type Pareja = {
  izquierda: number;
  derecha: number;
  numero: number;
};

export type EstadoEmparejar = {
  parejas: Pareja[];
  seleccion: ElementoPareja | null;
};

// Identifica un elemento al arrastrar: el origen y el destino se comparan con ===.
export function claveDe({ lado, indice }: ElementoPareja): string {
  return `${lado}-${indice}`;
}

export function elementoDe(clave: string): ElementoPareja {
  const [lado, indice] = clave.split("-");
  return { lado: lado === "derecha" ? "derecha" : "izquierda", indice: Number(indice) };
}

export function parejaDe(parejas: Pareja[], { lado, indice }: ElementoPareja): Pareja | undefined {
  return parejas.find((pareja) => pareja[lado] === indice);
}

export function deshacerPareja(parejas: Pareja[], { lado, indice }: ElementoPareja): Pareja[] {
  return parejas.filter((pareja) => pareja[lado] !== indice);
}

// Deshace lo que tuvieran los dos, y la nueva toma el número libre más bajo.
export function unirPareja(parejas: Pareja[], izquierda: number, derecha: number): Pareja[] {
  const restantes = parejas.filter(
    (pareja) => pareja.izquierda !== izquierda && pareja.derecha !== derecha,
  );
  const usados = new Set(restantes.map(({ numero }) => numero));
  let numero = 1;
  while (usados.has(numero)) numero += 1;
  return [...restantes, { izquierda, derecha, numero }];
}

// Une dos elementos, sin importar con cuál se empezó. Los dos del mismo lado no se unen.
export function unirElementos(
  parejas: Pareja[],
  uno: ElementoPareja,
  otro: ElementoPareja,
): Pareja[] {
  if (uno.lado === otro.lado) return parejas;
  const izquierda = uno.lado === "izquierda" ? uno : otro;
  const derecha = uno.lado === "derecha" ? uno : otro;
  return unirPareja(parejas, izquierda.indice, derecha.indice);
}

// "Pulsar en emparejar" (spec F11).
export function pulsarEnEmparejar(
  { parejas, seleccion }: EstadoEmparejar,
  elemento: ElementoPareja,
): EstadoEmparejar {
  if (seleccion && seleccion.lado !== elemento.lado) {
    return { parejas: unirElementos(parejas, seleccion, elemento), seleccion: null };
  }
  if (seleccion?.indice === elemento.indice) return { parejas, seleccion: null };
  if (parejaDe(parejas, elemento)) {
    return { parejas: deshacerPareja(parejas, elemento), seleccion };
  }
  return { parejas, seleccion: elemento };
}

export function esParejaCorrecta({ izquierda, derecha }: Pareja): boolean {
  return izquierda === derecha;
}

// La respuesta correcta de las parejas falladas, en el orden del autor.
export function detalleParejas({ parejas }: ActividadEmparejar, formadas: Pareja[]): string {
  return parejas
    .filter((_, indice) => {
      const pareja = parejaDe(formadas, { lado: "izquierda", indice });
      return !pareja || !esParejaCorrecta(pareja);
    })
    .map(({ izquierda, derecha }) => `${izquierda} → ${derecha}`)
    .join("\n");
}

// --- Clasificar -------------------------------------------------------------

export type EstadoClasificar = {
  categoriaDe: (number | null)[]; // por elemento; null: sin colocar
  seleccion: number | null;
};

function cambiarCategoria(
  categoriaDe: (number | null)[],
  elemento: number,
  categoria: number | null,
): (number | null)[] {
  return categoriaDe.map((actual, indice) => (indice === elemento ? categoria : actual));
}

// "Pulsar en clasificar" (spec F11): en una categoría, también encima de un elemento colocado.
export function pulsarCategoria(
  { categoriaDe, seleccion }: EstadoClasificar,
  categoria: number,
): EstadoClasificar {
  if (seleccion === null) return { categoriaDe, seleccion };
  return { categoriaDe: cambiarCategoria(categoriaDe, seleccion, categoria), seleccion: null };
}

export function pulsarElementoClasificar(
  estado: EstadoClasificar,
  elemento: number,
): EstadoClasificar {
  const { categoriaDe, seleccion } = estado;
  const categoria = categoriaDe[elemento] ?? null;
  if (categoria !== null) {
    if (seleccion !== null) return pulsarCategoria(estado, categoria);
    return { categoriaDe: cambiarCategoria(categoriaDe, elemento, null), seleccion };
  }
  return { categoriaDe, seleccion: seleccion === elemento ? null : elemento };
}

export function soltarEnClasificar(
  categoriaDe: (number | null)[],
  elemento: number,
  destino: number | typeof SIN_COLOCAR,
): (number | null)[] {
  return cambiarCategoria(categoriaDe, elemento, destino === SIN_COLOCAR ? null : destino);
}

// La respuesta correcta de los elementos fallados, en el orden del autor.
export function detalleClasificar(
  { categorias, elementos }: ActividadClasificar,
  categoriaDe: (number | null)[],
): string {
  return elementos
    .filter(({ categoria }, indice) => categoriaDe[indice] !== categoria)
    .map(({ texto, categoria }) => `${texto} → ${categorias[categoria] ?? ""}`)
    .join("\n");
}

// --- Ordenar y banco de palabras --------------------------------------------

// El destino de arrastrar a los elementos sin colocar.
export const SIN_COLOCAR = "sinColocar";

// El elemento de cada lugar; null: libre.
export type Lugares = (number | null)[];

export function lugaresVacios(total: number): Lugares {
  return Array.from({ length: total }, () => null);
}

export function primerLibre(lugares: Lugares): number {
  return lugares.indexOf(null);
}

// Si el lugar estaba ocupado, el que estaba pasa a donde estaba este, o queda sin colocar
// si este venía de ahí (spec F11, "Soltar al arrastrar").
export function colocarEnLugar(lugares: Lugares, elemento: number, lugar: number): Lugares {
  const origen = lugares.indexOf(elemento);
  const ocupante = lugares[lugar] ?? null;
  const nuevos = [...lugares];
  if (origen !== -1) nuevos[origen] = ocupante;
  nuevos[lugar] = elemento;
  return nuevos;
}

// Lo devuelve: su lugar queda libre y nada se recorre.
export function quitarDeLugar(lugares: Lugares, elemento: number): Lugares {
  return lugares.map((actual) => (actual === elemento ? null : actual));
}

// Pulsar un elemento sin colocar lo lleva al primer lugar libre; sin lugares libres, nada.
export function colocarEnPrimerLibre(lugares: Lugares, elemento: number): Lugares {
  const lugar = primerLibre(lugares);
  return lugar === -1 ? lugares : colocarEnLugar(lugares, elemento, lugar);
}

export function soltarEnLugares(
  lugares: Lugares,
  elemento: number,
  destino: number | typeof SIN_COLOCAR,
): Lugares {
  if (destino === SIN_COLOCAR) return quitarDeLugar(lugares, elemento);
  return colocarEnLugar(lugares, elemento, destino);
}

// Índices mezclados, nunca en orden: ni emparejar ni ordenar empiezan resueltos. Con 3
// elementos o más casi siempre sale a la primera (research de F11, punto 6).
export function mezclarSinResolver(total: number): number[] {
  const orden = Array.from({ length: total }, (_, indice) => indice);
  let mezclados = mezclar(orden);
  while (total > 1 && mezclados.every((valor, indice) => valor === indice)) {
    mezclados = mezclar(orden);
  }
  return mezclados;
}

export function detalleOrdenar({ elementos }: ActividadOrdenar): string {
  return elementos.map((elemento, indice) => `${indice + 1}. ${elemento}`).join("\n");
}

// --- Banco de palabras ------------------------------------------------------

export function fichaCorrecta(
  { fichas, espacios }: ActividadBancoPalabras,
  ficha: number | null,
  espacio: number,
): boolean {
  if (ficha === null) return false;
  return espacios[espacio]?.aceptadas.includes(fichas[ficha] ?? "") ?? false;
}

// Da a cada espacio una ficha que valga en él, sin usar una ficha dos veces. Es un
// emparejamiento por caminos de aumento: mirar espacio por espacio no basta, porque con
// {a, b} y {a} y las fichas a y b hay solución, pero no si el primero toma a (research de
// F11, punto 5). `inicial` son las fichas que ya están puestas, y una de `fijos` no se mueve.
function asignarFichas(
  actividad: ActividadBancoPalabras,
  inicial: Map<number, number>,
  fijos: Set<number>,
): number[] | null {
  const { fichas, espacios } = actividad;
  const duenoDe = new Map(inicial); // ficha → espacio

  function asignar(espacio: number, vistas: Set<number>): boolean {
    for (const ficha of fichas.keys()) {
      if (!fichaCorrecta(actividad, ficha, espacio) || vistas.has(ficha)) continue;
      vistas.add(ficha);
      const dueno = duenoDe.get(ficha);
      if (dueno !== undefined && fijos.has(dueno)) continue;
      if (dueno === undefined || asignar(dueno, vistas)) {
        duenoDe.set(ficha, espacio);
        return true;
      }
    }
    return false;
  }

  const conFicha = new Set(duenoDe.values());
  const lleno = espacios.every(
    (_, espacio) => conFicha.has(espacio) || asignar(espacio, new Set()),
  );
  if (!lleno) return null;
  const solucion: number[] = [];
  for (const [ficha, espacio] of duenoDe) solucion[espacio] = ficha;
  return solucion;
}

// La solución que se muestra: usa cada ficha una vez y, si se puede, deja en su lugar lo que
// el alumno acertó. Primero lo intenta sin mover nada de eso; si no alcanza, deja que se mueva.
export function solucionBanco(actividad: ActividadBancoPalabras, colocadas: Lugares): number[] {
  const acertadas = new Map<number, number>();
  colocadas.forEach((ficha, espacio) => {
    if (ficha !== null && fichaCorrecta(actividad, ficha, espacio)) acertadas.set(ficha, espacio);
  });
  const fijos = new Set(acertadas.values());
  return (
    asignarFichas(actividad, acertadas, fijos) ??
    asignarFichas(actividad, acertadas, new Set()) ??
    []
  );
}

// El texto con cada espacio lleno con su ficha.
export function textoConFichas(
  { texto, fichas }: ActividadBancoPalabras,
  solucion: number[],
): string {
  return partirEnEspacios(texto).reduce((resultado, trozo, indice) =>
    indice === 0 ? trozo : resultado + (fichas[solucion[indice - 1] ?? -1] ?? "") + trozo,
  );
}
