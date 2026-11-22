export const temas = [
  { id: "original", nombre: "Original", descripcion: "Índigo y luz lavanda" },
  { id: "oceano", nombre: "Océano", descripcion: "Azul profundo y brisa marina" },
  { id: "terracota", nombre: "Terracota", descripcion: "Arcilla y tonos de arena" },
  { id: "ciruela", nombre: "Ciruela", descripcion: "Malva y matices rosados" },
] as const;

export const modos = [
  { id: "sistema", nombre: "Del sistema" },
  { id: "claro", nombre: "Claro" },
  { id: "oscuro", nombre: "Oscuro" },
] as const;

export type Tema = (typeof temas)[number]["id"];
export type Modo = (typeof modos)[number]["id"];
export type PreferenciaTema = { tema: Tema; modo: Modo };
export const temaInicial: PreferenciaTema = { tema: "original", modo: "sistema" };

export function interpretarTema(texto: string | null): PreferenciaTema {
  try {
    const valor: unknown = JSON.parse(texto ?? "null");
    if (!valor || typeof valor !== "object") return temaInicial;
    const { tema, modo } = valor as Record<string, unknown>;
    return {
      tema: temas.some((t) => t.id === tema) ? (tema as Tema) : "original",
      modo: modos.some((m) => m.id === modo) ? (modo as Modo) : "sistema",
    };
  } catch {
    return temaInicial;
  }
}
