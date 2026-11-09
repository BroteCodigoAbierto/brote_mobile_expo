// Lo que se escribe en el campo de código y en la terminal (spec F12; brote_specs, research de
// F12, puntos 5 y 6). Son funciones puras, las mismas que en la web, salvo las de la sangría:
// en el teléfono no hay Tab.

// El teclado puede cambiar lo que se escribe: la puntuación inteligente de iOS, o las
// sustituciones de macOS, pasan " a “ ”, -- a — y ... a …. Aquí se deshace, para que el campo
// muestre lo que se tecleó (las comillas cuentan al comparar un comando).
export function textoTecleado(texto: string): string {
  return texto
    .replace(/[“”„‟]/g, '"')
    .replace(/[‘’‚‛]/g, "'")
    .replace(/—/g, "--")
    .replace(/…/g, "...");
}

// Lo que queda en el campo de código o en la terminal después de cada cambio: con
// textoTecleado y recortado al límite, porque … → ... alarga el texto. En la terminal
// (`unaLinea`), un salto de línea pegado pasa a espacio y no comprueba solo (research de F12,
// punto 6). `cursor` es donde queda el cursor si el texto cambió: corrido por lo que creció o
// se encogió lo que tiene antes.
export function limpiarEscrito(
  escrito: string,
  cursor: number,
  maximo: number,
  unaLinea = false,
): { texto: string; cursor: number } {
  function limpiar(texto: string) {
    const tecleado = textoTecleado(unaLinea ? texto.replace(/\r?\n/g, " ") : texto);
    const caracteres = Array.from(tecleado);
    return caracteres.length > maximo ? caracteres.slice(0, maximo).join("") : tecleado;
  }
  const texto = limpiar(escrito);
  return { texto, cursor: Math.min(limpiar(escrito.slice(0, cursor)).length, texto.length) };
}

// Como compara la terminal: sin los espacios del inicio y del final, y con una racha de
// espacios como uno. Las mayúsculas y las comillas cuentan. Los reemplazos de textoTecleado
// son para el autor: si pegó un comando con “ ” o —, el alumno, que nunca los escribe, lo
// puede acertar igual. El backend tiene una copia para buscar comandos repetidos.
export function normalizarComando(texto: string): string {
  return textoTecleado(texto).trim().replace(/\s+/g, " ");
}

export function comandoAceptado(escrito: string, comandos: string[]): boolean {
  const normalizado = normalizarComando(escrito);
  return comandos.some((comando) => normalizarComando(comando) === normalizado);
}
