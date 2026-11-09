import type { ActividadGrafoCommits, CommitGrafo, RamaGrafo } from "../tipos/contrato";

// El grafo de commits (spec F12, "Acomodo del grafo"; brote_specs, research de F12, puntos 2
// y 3). Son funciones puras, iguales en la web: dónde va cada commit, cuánto mide todo y
// cómo se llama cada commit para el lector de pantalla. El autor no da coordenadas.

export type PosicionCommit = { columna: number; fila: number };

export type AcomodoGrafo = {
  posiciones: PosicionCommit[]; // una por commit, en el orden de `commits`
  columnas: number;
  filas: number;
};

type DatosGrafo = { commits: CommitGrafo[]; ramas: RamaGrafo[] };

// Columnas por generaciones: el primer commit en la 0 y cada uno de los demás en la que sigue
// a la de su padre más a la derecha, así que dos commits en paralelo quedan en la misma.
// Filas siguiendo el primer padre: una por cada rama, en el orden del autor, con su commit y
// los anteriores hasta uno que ya tenga fila; después, igual, los commits que quedan, del
// último al primero (sin ramas, la primera fila sale del último commit). Dentro de una fila
// cada commit va a la derecha de su primer padre, así que dos nunca caen en el mismo lugar.
export function acomodarGrafo({ commits, ramas }: DatosGrafo): AcomodoGrafo {
  const columnas: number[] = [];
  commits.forEach(({ padres }, indice) => {
    columnas[indice] =
      padres.length === 0 ? 0 : 1 + Math.max(...padres.map((padre) => columnas[padre] ?? 0));
  });

  const filas: (number | undefined)[] = commits.map(() => undefined);
  let totalFilas = 0;
  function trazar(desde: number) {
    if (filas[desde] !== undefined) return;
    const fila = totalFilas++;
    let actual: number | undefined = desde;
    while (actual !== undefined && filas[actual] === undefined) {
      filas[actual] = fila;
      actual = commits[actual]?.padres[0];
    }
  }
  ramas.forEach((rama) => trazar(rama.commit));
  for (let indice = commits.length - 1; indice >= 0; indice--) trazar(indice);

  return {
    posiciones: commits.map((_, indice) => ({
      columna: columnas[indice],
      fila: filas[indice] ?? 0,
    })),
    columnas: Math.max(0, ...columnas) + 1,
    filas: totalFilas,
  };
}

// En px, con la letra al 100 %; medirGrafo las multiplica por la escala de la letra. Con 6
// columnas, el grafo pide 5 × 48 + 44 = 284: cabe en un teléfono de 360 (research, punto 3).
export const MEDIDAS_GRAFO = {
  circulo: 40,
  area: 44, // lo que se pulsa
  columnaMin: 48, // 44 de área y 4 de aire
  columnaMax: 96, // en una ventana ancha, el grafo no se estira de más
  fila: 64, // de centro a centro, sin etiquetas
  letra: 14, // la de `codigo`
  // las etiquetas se escriben en letra de código, así que su ancho se calcula sin medirlas:
  // 0.62 cubre las monoespaciadas de los dos clientes (entre 0.55 y 0.61)
  anchoCaracter: 0.62,
  rellenoEtiqueta: 8, // a cada lado
  altoEtiqueta: 24,
  separacionEtiqueta: 4, // entre niveles, entre dos etiquetas de un nivel y con el commit
} as const;

export type EtiquetaGrafo = {
  texto: string;
  tipo: "rama" | "head"; // "head": HEAD suelto, en un commit
  commit: number;
  x: number; // esquina superior izquierda, dentro de la caja
  y: number;
  ancho: number;
};

export type MedidaGrafo = {
  ancho: number; // de la caja que lleva el grafo
  alto: number;
  desborda: boolean; // más ancha que lo disponible: se desplaza hacia los lados
  separacion: number; // entre columnas, de centro a centro
  area: number;
  circulo: number;
  altoEtiqueta: number;
  centros: { x: number; y: number }[]; // uno por commit
  etiquetas: EtiquetaGrafo[];
};

function largo(texto: string): number {
  return Array.from(texto).length;
}

// Las etiquetas de cada commit, en este orden: sus ramas, en el orden del autor ("HEAD → main"
// si HEAD apunta a esa rama), y "HEAD" si HEAD apunta directo al commit.
type EtiquetaSinMedir = Omit<EtiquetaGrafo, "x" | "y" | "ancho">;

function etiquetasDe({ ramas, head }: ActividadGrafoCommits): EtiquetaSinMedir[] {
  const etiquetas: EtiquetaSinMedir[] = ramas.map((rama, indice) => ({
    texto: head && "rama" in head && head.rama === indice ? `HEAD → ${rama.nombre}` : rama.nombre,
    tipo: "rama",
    commit: rama.commit,
  }));
  if (head && "commit" in head)
    etiquetas.push({ texto: "HEAD", tipo: "head", commit: head.commit });
  return etiquetas;
}

// Cuánto mide el grafo en un ancho disponible y dónde va cada cosa. Las etiquetas van encima
// de su commit, centradas y sin salirse de la caja; si una se encimaría con otra de su fila,
// sube un nivel, y cada fila reserva arriba los niveles que usa. `escalaLetra` agranda
// círculos y etiquetas con la letra; si con eso no cabe, `desborda`.
export function medirGrafo(
  acomodo: AcomodoGrafo,
  actividad: ActividadGrafoCommits,
  anchoDisponible: number,
  escalaLetra: number,
): MedidaGrafo {
  const m = MEDIDAS_GRAFO;
  const e = Math.max(1, escalaLetra);
  const area = m.area * e;
  const separacionEtiqueta = m.separacionEtiqueta * e;
  const altoEtiqueta = m.altoEtiqueta * e;
  const tramos = Math.max(1, acomodo.columnas - 1);

  const separacion = Math.min(
    m.columnaMax * e,
    Math.max(m.columnaMin * e, (anchoDisponible - area) / tramos),
  );
  const anchoColumnas = area + (acomodo.columnas - 1) * separacion;
  const sinMedir = etiquetasDe(actividad).map((etiqueta) => ({
    ...etiqueta,
    ancho: largo(etiqueta.texto) * m.anchoCaracter * m.letra * e + 2 * m.rellenoEtiqueta * e,
  }));
  const ancho = Math.max(anchoColumnas, ...sinMedir.map((etiqueta) => etiqueta.ancho));
  // si las etiquetas ensanchan la caja, las columnas van al centro
  const margen = (ancho - anchoColumnas) / 2;
  const xDe = (columna: number) => margen + area / 2 + columna * separacion;

  // niveles: en el orden de las ramas del autor (y HEAD al final), cada etiqueta en el más
  // bajo de su fila donde no se encima con otra
  type Colocada = EtiquetaGrafo & { nivel: number; fila: number };
  const colocadas: Colocada[] = [];
  const nivelesPorFila: number[] = Array.from({ length: acomodo.filas }, () => 0);
  for (const etiqueta of sinMedir) {
    const { fila, columna } = acomodo.posiciones[etiqueta.commit];
    const x = Math.min(Math.max(0, xDe(columna) - etiqueta.ancho / 2), ancho - etiqueta.ancho);
    const vecinas = colocadas.filter((otra) => otra.fila === fila);
    let nivel = 0;
    while (
      vecinas.some(
        (otra) =>
          otra.nivel === nivel &&
          x < otra.x + otra.ancho + separacionEtiqueta &&
          otra.x < x + etiqueta.ancho + separacionEtiqueta,
      )
    ) {
      nivel++;
    }
    colocadas.push({ ...etiqueta, x, y: 0, nivel, fila });
    nivelesPorFila[fila] = Math.max(nivelesPorFila[fila], nivel + 1);
  }

  // de arriba abajo: los niveles de la fila, sus commits y el aire hasta la siguiente
  const pasoNivel = altoEtiqueta + separacionEtiqueta;
  const centroFila: number[] = [];
  let alto = 0;
  nivelesPorFila.forEach((niveles, fila) => {
    alto += niveles * pasoNivel;
    centroFila[fila] = alto + area / 2;
    alto += area + (fila < acomodo.filas - 1 ? (m.fila - m.area) * e : 0);
  });

  const etiquetas = colocadas.map(({ nivel, fila, ...etiqueta }) => ({
    ...etiqueta,
    y: centroFila[fila] - area / 2 - (nivel + 1) * pasoNivel,
  }));

  return {
    ancho,
    alto,
    desborda: ancho > anchoDisponible,
    separacion,
    area,
    circulo: m.circulo * e,
    altoEtiqueta,
    centros: acomodo.posiciones.map(({ columna, fila }) => ({
      x: xDe(columna),
      y: centroFila[fila],
    })),
    etiquetas,
  };
}

type Punto = { x: number; y: number };

// La línea de un padre (a la izquierda) a su hijo, para el `d` de un <path>. En la misma fila,
// recta. Si no, cambia de fila en un solo paso de columna: con el primer padre, junto al padre
// (el hijo es el primero de su fila, así que la recta no cruza ningún commit); con el segundo
// padre de un merge, junto al hijo.
export function rutaLinea(
  desde: Punto,
  hasta: Punto,
  esPrimerPadre: boolean,
  separacion: number,
): string {
  if (desde.y === hasta.y) return `M ${desde.x} ${desde.y} L ${hasta.x} ${hasta.y}`;
  const curva = (a: Punto, b: Punto) => {
    const medio = (a.x + b.x) / 2;
    return `C ${medio} ${a.y} ${medio} ${b.y} ${b.x} ${b.y}`;
  };
  if (esPrimerPadre) {
    const quiebre = { x: Math.min(desde.x + separacion, hasta.x), y: hasta.y };
    return `M ${desde.x} ${desde.y} ${curva(desde, quiebre)} L ${hasta.x} ${hasta.y}`;
  }
  const quiebre = { x: Math.max(hasta.x - separacion, desde.x), y: desde.y };
  return `M ${desde.x} ${desde.y} L ${quiebre.x} ${quiebre.y} ${curva(quiebre, hasta)}`;
}

export type EstadoCommit = "normal" | "elegido" | "correcto" | "incorrecto";

// "a", "a y b", "a, b y c"
function enumerar(textos: string[]): string {
  if (textos.length <= 1) return textos.join("");
  return `${textos.slice(0, -1).join(", ")} y ${textos[textos.length - 1]}`;
}

// Lo que el lector de pantalla dice de un commit: su nombre, sus padres, las ramas y HEAD que
// apuntan a él y su estado. Por ejemplo, "Commit c2, padre c1, elegido".
export function nombreAccesibleCommit(
  { commits, ramas, head }: ActividadGrafoCommits,
  indice: number,
  estado: EstadoCommit,
): string {
  const partes = [`Commit ${commits[indice].nombre}`];
  const padres = commits[indice].padres.map((padre) => commits[padre].nombre);
  if (padres.length > 0)
    partes.push(`${padres.length === 1 ? "padre" : "padres"} ${enumerar(padres)}`);
  const suyas = ramas.filter((rama) => rama.commit === indice);
  if (suyas.length > 0) {
    partes.push(
      `${suyas.length === 1 ? "rama" : "ramas"} ${enumerar(suyas.map((rama) => rama.nombre))}`,
    );
  }
  const conHead =
    head !== undefined &&
    ("commit" in head ? head.commit === indice : ramas[head.rama]?.commit === indice);
  if (conHead) partes.push("HEAD");
  if (estado !== "normal") partes.push(estado);
  return partes.join(", ");
}
