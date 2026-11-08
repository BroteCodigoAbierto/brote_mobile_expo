import { VolumeX } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { espacio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { MENSAJES_AUDIOS } from "../tipos/contrato";
import Texto from "./Texto";

// El audio de la frase que no cargó (docs/diseno.md, sección 4; spec F14, "Cargar el audio al
// cursar"), como una imagen rota de F13. Se anuncia. Como la web.
export default function EstadoAudio() {
  const c = useColores();
  return (
    <View style={styles.estado} accessible accessibilityLiveRegion="polite">
      <VolumeX size={20} color={c.textoTenue} strokeWidth={2} />
      <Texto variante="nota" color="textoSuave">
        {MENSAJES_AUDIOS.sinCargar}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  estado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espacio[3],
  },
});
