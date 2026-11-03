import { Check } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import BloqueCodigo from "../componentes/BloqueCodigo";
import Superficie from "../componentes/Superficie";
import Texto from "../componentes/Texto";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { partirParrafos } from "../utilidades/actividades";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Teoría (spec F03): título, párrafos, código y puntos clave, solo los que
// tenga y en ese orden. "Continuar" está disponible desde el principio.
export default function Teoria({ actividad, alTerminar }: PropsActividad<"teoria">) {
  const c = useColores();
  const { titulo, texto, codigo, puntosClave } = actividad;

  return (
    <MarcoActividad
      barra={
        <BarraRespuesta
          estado="neutro"
          textoBoton="Continuar"
          alPulsar={() => alTerminar("sinCalificar")}
        />
      }
    >
      <Superficie style={styles.panel}>
        {titulo && (
          <Texto variante="titulo2" accessibilityRole="header">
            {titulo}
          </Texto>
        )}
        {partirParrafos(texto).map((parrafo, i) => (
          <Texto key={i}>{parrafo}</Texto>
        ))}
        {codigo && <BloqueCodigo codigo={codigo} />}
        {puntosClave && (
          <View style={[styles.puntos, { backgroundColor: c.vidrioSuave }]}>
            {puntosClave.map((punto, i) => (
              <View key={i} style={styles.punto}>
                <Check size={20} color={c.brote} strokeWidth={2.25} />
                <Texto style={styles.textoPunto}>{punto}</Texto>
              </View>
            ))}
          </View>
        )}
      </Superficie>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: espacio[5],
    padding: espacio[6],
  },
  puntos: {
    gap: espacio[4],
    padding: espacio[5],
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  punto: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacio[4],
  },
  textoPunto: {
    flex: 1,
  },
});
