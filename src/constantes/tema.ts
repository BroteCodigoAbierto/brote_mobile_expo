import { Platform, type TextStyle } from "react-native";

// Valores de diseño de Brote (brote_specs/docs/diseno.md, sección 2). Mismos
// nombres y valores que brote_web_react/src/estilos/tokens.css. Los colores que
// cambian con el modo oscuro se leen con useColores(), nunca de aquí directo.

export const colores = {
  claro: {
    primario: "#4F46E5",
    primarioHover: "#4338CA",
    primarioSuave: "#EEF0FF",
    sobrePrimario: "#FFFFFF",
    brote: "#65A30D",
    broteFuerte: "#4D7C0F",
    broteSuave: "#ECFCCB",
    sobreBrote: "#FFFFFF",
    acento: "#F97362",
    acentoSuave: "#FFEDEA",
    error: "#DC2650",
    errorSuave: "#FDECEF",
    texto: "#1E1B3A",
    textoSuave: "#5B5878",
    textoTenue: "#8784A3",
    borde: "#E4E2F3",
    bordeFuerte: "#CFCCE8",
    fondo: "#F6F5FD",
    vidrio: "rgba(255, 255, 255, 0.72)",
    vidrioSuave: "rgba(238, 240, 255, 0.66)",
    vidrioOpaco: "#FCFCFF",
    vidrioBorde: "rgba(255, 255, 255, 0.90)",
    // F13: el fondo del visor de una imagen, igual en los dos modos
    fondoVisor: "rgba(10, 9, 26, 0.94)",
    // F03: final del degradado de la barra de progreso (empieza en brote)
    progresoFin: "#84CC16",
    // F03: el panel de código es oscuro también en modo claro: mismos valores
    // en los dos modos (docs/diseno.md, sección 2.1, "Código")
    codigoFondo: "#16142E",
    codigoTexto: "#ECEBFA",
    codigoAgregado: "#BEF264",
    codigoAgregadoFondo: "rgba(163, 230, 53, 0.16)",
    codigoEliminado: "#FDA4AF",
    codigoEliminadoFondo: "rgba(255, 107, 133, 0.16)",
    codigoEncabezado: "#A29DFF",
    // F12: la carpeta de la terminal, la etiqueta del lenguaje y el código de solo
    // lectura; el cursor y el $ ("cursor brote"); y el fondo de la etiqueta
    codigoTenue: "#A9A6C9",
    codigoCursor: "#A3E635",
    codigoEtiquetaFondo: "rgba(255, 255, 255, 0.10)",
  },
  oscuro: {
    primario: "#8B85FF",
    primarioHover: "#A29DFF",
    primarioSuave: "rgba(139, 133, 255, 0.16)",
    sobrePrimario: "#12103A",
    brote: "#A3E635",
    broteFuerte: "#A3E635",
    broteSuave: "rgba(163, 230, 53, 0.14)",
    sobreBrote: "#1A2E05",
    acento: "#FF8A7A",
    acentoSuave: "rgba(255, 138, 122, 0.14)",
    error: "#FF6B85",
    errorSuave: "rgba(255, 107, 133, 0.14)",
    texto: "#ECEBFA",
    textoSuave: "#A9A6C9",
    textoTenue: "#6E6B8F",
    borde: "rgba(255, 255, 255, 0.10)",
    bordeFuerte: "rgba(255, 255, 255, 0.18)",
    fondo: "#0F0E1F",
    vidrio: "rgba(30, 28, 58, 0.62)",
    vidrioSuave: "rgba(46, 42, 92, 0.55)",
    vidrioOpaco: "#1B1A33",
    vidrioBorde: "rgba(255, 255, 255, 0.10)",
    fondoVisor: "rgba(10, 9, 26, 0.94)",
    // F03: final del degradado de la barra de progreso (empieza en brote)
    progresoFin: "#84CC16",
    // F03: el panel de código es oscuro también en modo claro: mismos valores
    // en los dos modos (docs/diseno.md, sección 2.1, "Código")
    codigoFondo: "#16142E",
    codigoTexto: "#ECEBFA",
    codigoAgregado: "#BEF264",
    codigoAgregadoFondo: "rgba(163, 230, 53, 0.16)",
    codigoEliminado: "#FDA4AF",
    codigoEliminadoFondo: "rgba(255, 107, 133, 0.16)",
    codigoEncabezado: "#A29DFF",
    // F12: la carpeta de la terminal, la etiqueta del lenguaje y el código de solo
    // lectura; el cursor y el $ ("cursor brote"); y el fondo de la etiqueta
    codigoTenue: "#A9A6C9",
    codigoCursor: "#A3E635",
    codigoEtiquetaFondo: "rgba(255, 255, 255, 0.10)",
  },
} as const;

// los dos modos tienen las mismas claves; el valor es cualquier color
export type Colores = Record<keyof (typeof colores)["claro"], string>;

// Va en experimental_backgroundImage, debajo de todo (FondoAmbiental).
export const fondoAmbiental = {
  claro:
    "radial-gradient(ellipse at 0% 0%, rgba(167, 160, 255, 0.38), transparent 55%), " +
    "radial-gradient(ellipse at 100% 100%, rgba(163, 230, 53, 0.22), transparent 50%), " +
    "radial-gradient(ellipse at 100% 0%, rgba(249, 115, 98, 0.12), transparent 45%), " +
    "linear-gradient(160deg, #F7F6FE, #F2F6F8)",
  oscuro:
    "radial-gradient(ellipse at 0% 0%, rgba(79, 70, 229, 0.35), transparent 55%), " +
    "radial-gradient(ellipse at 100% 100%, rgba(101, 163, 13, 0.14), transparent 50%), " +
    "linear-gradient(160deg, #12112A, #0D0C1A)",
} as const;

// Van en boxShadow; se leen con useSombras().
export const sombras = {
  claro: {
    suave: "0px 8px 28px rgba(49, 46, 129, 0.08)",
    elevada: "0px 16px 44px rgba(49, 46, 129, 0.14), 0px 2px 6px rgba(49, 46, 129, 0.05)",
    boton: "0px 8px 18px rgba(79, 70, 229, 0.28)",
  },
  oscuro: {
    suave: "0px 8px 28px rgba(0, 0, 0, 0.35)",
    elevada: "0px 16px 44px rgba(0, 0, 0, 0.5)",
    boton: "0px 8px 18px rgba(0, 0, 0, 0.4)",
  },
} as const;

export type Sombras = Record<keyof (typeof sombras)["claro"], string>;

// Portadas generadas de los cursos: las mismas en claro y oscuro, todas con
// contraste ≥ 4.5:1 con la letra blanca. Mismos valores y orden que
// --color-portada-1 a -8 de la web: un curso tiene el mismo color en las dos.
export const coloresPortada = [
  "#4F46E5",
  "#7C3AED",
  "#4D7C0F",
  "#C2410C",
  "#1D4ED8",
  "#0F766E",
  "#BE185D",
  "#475569",
] as const;

export const sobrePortada = "#FFFFFF";

// El mismo color 18 % más claro, para el final del degradado de la portada
// (en la web: color-mix(in srgb, color 82%, #ffffff)).
export function aclarar(hex: string, cantidad = 0.18): string {
  const canales = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (
    "#" +
    canales
      .map((canal) => Math.round(canal + (255 - canal) * cantidad))
      .map((canal) => canal.toString(16).padStart(2, "0"))
      .join("")
  );
}

export const espacio = {
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
  6: 20,
  7: 24,
  8: 32,
  9: 48,
} as const;

export const radio = {
  chico: 12,
  medio: 18,
  grande: 26,
  enorme: 34,
  pildora: 999,
} as const;

// Se cargan en el layout raíz antes de ocultar la pantalla de arranque.
export const fuentes = {
  regular: "PlusJakartaSans_400Regular",
  medio: "PlusJakartaSans_500Medium",
  seminegrita: "PlusJakartaSans_600SemiBold",
  negrita: "PlusJakartaSans_700Bold",
  extranegrita: "PlusJakartaSans_800ExtraBold",
  // F03: la monoespaciada del sistema
  codigo: Platform.select({ ios: "Menlo", default: "monospace" }),
} as const;

// Con una familia por peso no se usa fontWeight (Android lo ignoraría).
export const tipografia = {
  display: { fontFamily: fuentes.extranegrita, fontSize: 34, lineHeight: 40, letterSpacing: -1.2 },
  titulo1: { fontFamily: fuentes.negrita, fontSize: 28, lineHeight: 34, letterSpacing: -0.9 },
  titulo2: { fontFamily: fuentes.negrita, fontSize: 22, lineHeight: 28, letterSpacing: -0.5 },
  titulo3: { fontFamily: fuentes.seminegrita, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  cuerpo: { fontFamily: fuentes.regular, fontSize: 16, lineHeight: 24, letterSpacing: -0.1 },
  cuerpoChico: { fontFamily: fuentes.regular, fontSize: 14, lineHeight: 20 },
  nota: { fontFamily: fuentes.medio, fontSize: 13, lineHeight: 18 },
  etiqueta: { fontFamily: fuentes.seminegrita, fontSize: 13, lineHeight: 18 },
  boton: { fontFamily: fuentes.seminegrita, fontSize: 15, lineHeight: 20, letterSpacing: -0.1 },
  seccion: {
    fontFamily: fuentes.negrita,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  codigo: { fontFamily: fuentes.codigo, fontSize: 14, lineHeight: 22 },
} as const satisfies Record<string, TextStyle>;

export type VarianteTexto = keyof typeof tipografia;

// milisegundos (docs/diseno.md, sección 2.5)
export const movimiento = {
  rapido: 140,
  medio: 220,
  lento: 360,
} as const;

export const AREA_TACTIL = 44;
export const ALTO_BOTON = 52;
export const ALTO_BOTON_CHICO = 44;
// margen lateral de cada pantalla
export const MARGEN_PANTALLA = espacio[6];

// F13: imágenes (docs/diseno.md, sección 2.3). Opciones de imagen: tantas columnas de al
// menos `mosaicoOpcion` como quepan, y nunca menos de dos; clasificar y ordenar, mosaicos de
// `mosaicoElemento`; la barra, miniaturas de `miniatura`; y la teoría y la pregunta, hasta
// `altoImagenMax` del alto de la pantalla.
export const medidasImagen = {
  mosaicoOpcion: 144,
  mosaicoElemento: 88,
  miniatura: 48,
  altoImagenMax: 0.5,
} as const;
