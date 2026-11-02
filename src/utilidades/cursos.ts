// Presentación de un curso que no viene del backend: el texto de la cantidad
// de lecciones y la portada generada (brote_specs, research de F02, punto 7).
// La web tiene las mismas funciones, para que un curso se vea igual en los dos.

export function textoCantidadLecciones(cantidad: number): string {
  if (cantidad === 0) return "Sin lecciones";
  if (cantidad === 1) return "1 lección";
  return `${cantidad} lecciones`;
}

// La primera letra o número del título: "¿Cómo se dice hola?" → "C".
export function inicialPortada(titulo: string): string {
  const inicial = titulo.match(/[\p{L}\p{N}]/u)?.[0] ?? Array.from(titulo)[0] ?? "";
  return inicial.toLocaleUpperCase("es");
}

// Sale del id y no del título, así el color no cambia si se corrige el título.
export function indiceColorPortada(id: string): number {
  let h = 0;
  for (const caracter of id) h = (h * 31 + (caracter.codePointAt(0) ?? 0)) % 2147483647;
  return h % 8;
}
