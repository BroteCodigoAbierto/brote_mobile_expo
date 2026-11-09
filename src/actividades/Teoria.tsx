import { Check } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import BloqueCodigo from "../componentes/BloqueCodigo";
import ImagenAmpliable from "../componentes/ImagenAmpliable";
import Superficie from "../componentes/Superficie";
import Texto from "../componentes/Texto";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { partirTeoria } from "../utilidades/actividades";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Teoría (spec F03): título, párrafos, código y puntos clave, solo los que
// tenga y en ese orden. "Continuar" está disponible desde el principio. Desde F13, cada
// [imagen] del texto es una imagen, entre párrafos.
export default function Teoria({ actividad, alTerminar }: PropsActividad<"teoria">) {
  const c = useColores();
  const { titulo, texto, codigo, puntosClave, imagenes = [] } = actividad;

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
        {partirTeoria(texto).map((bloque, i) => {
          if ("parrafo" in bloque) return <Texto key={i}>{bloque.parrafo}</Texto>;
          const imagen = imagenes[bloque.imagen];
          return imagen ? <ImagenAmpliable key={i} imagen={imagen} /> : null;
        })}
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
