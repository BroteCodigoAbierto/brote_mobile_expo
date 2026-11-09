import { Pause, Play } from "lucide-react-native";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { AREA_TACTIL, espacio } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";

type Props = {
  pausada: boolean;
  alPulsar: () => void;
  style?: StyleProp<ViewStyle>;
};

// El botón de un GIF (docs/diseno.md, sección 4; spec F13, "GIF"): en la esquina inferior
// izquierda de quien lo contiene. Es un Pressable aparte: pulsarlo no elige la opción ni el
// elemento que tiene detrás, no empieza a arrastrarlo y no cuenta como haber hecho algo.
export default function BotonPausa({ pausada, alPulsar, style }: Props) {
  const c = useColores();
  const s = useSombras();
  const Icono = pausada ? Play : Pause;
  return (
    <Pressable
      onPress={alPulsar}
      accessibilityRole="button"
      accessibilityLabel={pausada ? "Reanudar animación" : "Pausar animación"}
      style={({ pressed }) => [
        styles.boton,
        { backgroundColor: c.vidrioOpaco, borderColor: c.vidrioBorde, boxShadow: s.suave },
        pressed && styles.presionado,
        style,
      ]}
    >
      <Icono size={20} color={c.texto} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    position: "absolute",
    bottom: espacio[3],
    left: espacio[3],
    zIndex: 1,
    width: AREA_TACTIL,
    height: AREA_TACTIL,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: AREA_TACTIL / 2,
  },
  presionado: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
