import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { espacio, fuentes, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import Texto from "./Texto";

type Props = {
  texto: string;
  tono?: "neutro" | "primario" | "brote" | "acento";
  icono?: LucideIcon;
};

// Píldora chica para metadatos ("6 lecciones") y logros.
export default function Insignia({ texto, tono = "neutro", icono: Icono }: Props) {
  const c = useColores();
  const aspecto = {
    neutro: { fondo: c.vidrioSuave, borde: c.borde, texto: c.textoSuave },
    primario: { fondo: c.primarioSuave, borde: "transparent", texto: c.primario },
    brote: { fondo: c.broteSuave, borde: "transparent", texto: c.broteFuerte },
    acento: { fondo: c.acentoSuave, borde: "transparent", texto: c.texto },
  }[tono];

  return (
    <View style={[styles.insignia, { backgroundColor: aspecto.fondo, borderColor: aspecto.borde }]}>
      {Icono && <Icono size={15} color={aspecto.texto} strokeWidth={2.25} />}
      <Texto variante="nota" style={[styles.texto, { color: aspecto.texto }]}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  insignia: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: espacio[2],
    minHeight: 28,
    paddingHorizontal: espacio[4],
    borderWidth: 1,
    borderRadius: radio.pildora,
  },
  texto: {
    fontFamily: fuentes.seminegrita,
  },
});
