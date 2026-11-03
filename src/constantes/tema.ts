// Valores de diseño de Brote para el móvil. Mismos colores que
// brote_web_react/src/estilos/tokens.css (salen de la paleta del prototipo).

export const colores = {
  claro: {
    fondo: "#f7f7f5",
    superficie: "#ffffff",
    texto: "#1f2320",
    textoSuave: "#6b7268",
    primario: "#2f7d4f",
    primarioOscuro: "#235f3c",
    sobrePrimario: "#ffffff",
    borde: "#e2e2dd",
    exito: "#2f7d4f",
    exitoFondo: "#e6f4ea",
    error: "#b3413a",
    errorFondo: "#fbeae8",
  },
  oscuro: {
    fondo: "#14171a",
    superficie: "#1e2225",
    texto: "#e8eae7",
    textoSuave: "#98a29b",
    primario: "#4caf7d",
    primarioOscuro: "#3d9268",
    sobrePrimario: "#0b1210",
    borde: "#33383a",
    exito: "#4caf7d",
    exitoFondo: "#16241c",
    error: "#e2685f",
    errorFondo: "#2b1917",
  },
} as const;

// los dos modos tienen las mismas claves; el valor es cualquier color
export type Colores = Record<keyof (typeof colores)["claro"], string>;

// Portadas generadas de los cursos (F02): las mismas en claro y oscuro, todas
// con contraste de al menos 4.5:1 con la letra blanca. Mismos valores y orden
// que --color-portada-1 a -8 de la web: un curso tiene el mismo color en las dos.
export const coloresPortada = [
  "#2f7d4f",
  "#2c6aa0",
  "#7b4fa0",
  "#a8443f",
  "#9a5b13",
  "#1f7a7a",
  "#8a4a6b",
  "#4a5a6a",
] as const;

export const sobrePortada = "#ffffff";

export const espacio = {
  uno: 4,
  dos: 8,
  tres: 16,
  cuatro: 24,
  cinco: 40,
} as const;

export const radio = 10;
