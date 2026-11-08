import type { LucideIcon } from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { ALTO_BOTON, ALTO_BOTON_CHICO, AREA_TACTIL, espacio, radio } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";
import Texto from "./Texto";

type Props = {
  titulo: string;
  alPresionar: () => void;
  variante?: "primario" | "secundario" | "fantasma" | "peligro" | "enlace";
  tamano?: "normal" | "chico";
  icono?: LucideIcon;
  iconoFinal?: LucideIcon;
  deshabilitado?: boolean;
  // mientras se envía queda deshabilitado, para que no se envíe dos veces
  enviando?: boolean;
  // F14: el nombre accesible, cuando el título no basta ("Escuchar" → "Escuchar la frase")
  etiqueta?: string;
};

// Botón de píldora (docs/diseno.md, sección 4): presionado se encoge un poco.
export default function Boton({
  titulo,
  alPresionar,
  variante = "primario",
  tamano = "normal",
  icono: Icono,
  iconoFinal: IconoFinal,
  deshabilitado = false,
  enviando = false,
  etiqueta,
}: Props) {
  const c = useColores();
  const s = useSombras();
  const inactivo = deshabilitado || enviando;

  const aspecto = {
    primario: {
      caja: { backgroundColor: c.primario, boxShadow: s.boton },
      texto: c.sobrePrimario,
    },
    secundario: {
      caja: {
        backgroundColor: c.vidrioOpaco,
        borderWidth: 1,
        borderColor: c.bordeFuerte,
        boxShadow: s.suave,
      },
      texto: c.primario,
    },
    fantasma: { caja: { backgroundColor: c.primarioSuave }, texto: c.primario },
    peligro: { caja: { backgroundColor: c.errorSuave }, texto: c.error },
    enlace: { caja: { backgroundColor: "transparent" }, texto: c.primario },
  }[variante];

  return (
    <Pressable
      onPress={alPresionar}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityLabel={etiqueta ?? titulo}
      accessibilityState={{ disabled: inactivo, busy: enviando }}
      style={({ pressed }) => [
        styles.boton,
        variante === "enlace"
          ? styles.enlace
          : { minHeight: tamano === "chico" ? ALTO_BOTON_CHICO : ALTO_BOTON },
        tamano === "chico" ? styles.chico : styles.normal,
        aspecto.caja,
        pressed && styles.presionado,
        inactivo && styles.deshabilitado,
      ]}
    >
      <View style={styles.contenido}>
        {enviando ? (
          <ActivityIndicator size="small" color={aspecto.texto} />
        ) : (
          Icono && <Icono size={18} color={aspecto.texto} strokeWidth={2.25} />
        )}
        {/* un texto que no cabe (p. ej. "Continuar: {n}. {título}") se corta con "…" */}
        <Texto variante="boton" numberOfLines={1} style={[styles.texto, { color: aspecto.texto }]}>
          {titulo}
        </Texto>
        {!enviando && IconoFinal && (
          <IconoFinal size={18} color={aspecto.texto} strokeWidth={2.25} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radio.pildora,
    borderCurve: "continuous",
  },
  normal: {
    paddingHorizontal: espacio[7],
  },
  chico: {
    paddingHorizontal: espacio[6],
  },
  enlace: {
    minHeight: AREA_TACTIL,
    paddingHorizontal: espacio[3],
  },
  contenido: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
    maxWidth: "100%",
  },
  texto: {
    flexShrink: 1,
  },
  presionado: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  deshabilitado: {
    opacity: 0.6,
  },
});
