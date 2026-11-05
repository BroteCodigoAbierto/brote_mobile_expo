import {
  MARCA_ESPACIO,
  type ActividadCompletarEspacios,
  type EspacioRespuesta,
  type OpcionRespuesta,
} from "../tipos/contrato";

// Reglas de las actividades que no vienen del backend: cómo se compara lo
// escrito, cómo se mezclan las opciones y cómo se parte el texto (brote_specs,
// research de F03, puntos 3, 4, 12 y 13). La web tiene las mismas funciones,
// para que una respuesta valga lo mismo en los dos.

// Si el motor no separa los acentos con NFD (research de F03, punto 4), se
// quitan con esta tabla, que da el mismo resultado en los textos del español.
const CON_ACENTO = "áàäâéèëêíìïîóòöôúùüûñç";
const SIN_ACENTO = "aaaaeeeeiiiioooouuuunc";
const separaAcentos = typeof "".normalize === "function" && "á".normalize("NFD") !== "á";

function quitarAcentos(texto: string): string {
  if (separaAcentos) return texto.normalize("NFD").replace(/\p{M}/gu, "");
  return Array.from(texto, (letra) => {
    const i = CON_ACENTO.indexOf(letra);
    return i === -1 ? letra : SIN_ACENTO[i];
  }).join("");
}

// Sin mayúsculas, acentos ni espacios de más; la ñ cuenta como n (igual que la
// búsqueda de F02). Los signos no se tocan: ">" y "<" siguen siendo distintos.
export function normalizarRespuesta(texto: string): string {
  return quitarAcentos(texto.toLocaleLowerCase("es")).trim().replace(/\s+/g, " ");
}

// Se compara la respuesta completa: "canciones" no es "canción".
export function esAceptada(escrito: string, espacio: EspacioRespuesta): boolean {
  const normalizado = normalizarRespuesta(escrito);
  return espacio.aceptadas.some((aceptada) => normalizarRespuesta(aceptada) === normalizado);
}

// Copia mezclada al azar (Fisher-Yates).
export function mezclar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// n marcas → n + 1 trozos; entre cada dos trozos va un espacio.
export function partirEnEspacios(texto: string): string[] {
  return texto.split(MARCA_ESPACIO);
}

// Un trozo de una línea: texto (una palabra con sus espacios) o el espacio n.
export type Pieza = { tipo: "texto"; texto: string } | { tipo: "espacio"; indice: number };

// React Native no puede poner una vista dentro de un Text: cada línea es una fila
// que se envuelve, hecha de palabras y espacios. Los espacios al inicio de la línea
// se conservan como sangría (research de F03, punto 12).
export function partirEnLineas(texto: string): Pieza[][] {
  const lineas: Pieza[][] = [[]];
  partirEnEspacios(texto).forEach((trozo, i) => {
    if (i > 0) lineas[lineas.length - 1]!.push({ tipo: "espacio", indice: i - 1 });
    trozo.split("\n").forEach((parte, j) => {
      if (j > 0) lineas.push([]);
      // cada palabra se queda con el espacio que la sigue, para envolver bien
      for (const palabra of parte.match(/\s*\S+\s*|\s+/g) ?? []) {
        lineas[lineas.length - 1]!.push({ tipo: "texto", texto: palabra });
      }
    });
  });
  return lineas;
}

// El texto con cada espacio lleno con su respuesta esperada (la primera aceptada).
export function textoConRespuestas({ texto, espacios }: ActividadCompletarEspacios): string {
  return partirEnEspacios(texto).reduce((resultado, trozo, i) =>
    i === 0 ? trozo : resultado + (espacios[i - 1]?.aceptadas[0] ?? "") + trozo,
  );
}

// Un renglón en blanco separa un párrafo del siguiente.
export function partirParrafos(texto: string): string[] {
  return texto.split(/\n\s*\n/).filter((parrafo) => parrafo.trim() !== "");
}

export type TipoLineaCodigo = "agregada" | "eliminada" | "encabezado" | "normal";

// Las mismas reglas que el prototipo: "+" (pero no "+++"), "-" (pero no "---") y "@@".
export function tipoLineaCodigo(linea: string): TipoLineaCodigo {
  if (/^\+(?!\+\+)/.test(linea)) return "agregada";
  if (/^-(?!--)/.test(linea)) return "eliminada";
  if (/^@@/.test(linea)) return "encabezado";
  return "normal";
}

export function textoOpcion(opcion: OpcionRespuesta): string {
  return "simbolo" in opcion ? opcion.simbolo : opcion.texto;
}
