import { CircleCheck, CircleX } from "lucide-react-native";
import { useEffect } from "react";
import {
  AccessibilityInfo,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import type { ParteRespuesta } from "../utilidades/actividades";
import Boton from "./Boton";
import MiniaturaImagen from "./MiniaturaImagen";
import Superficie from "./Superficie";
import Texto from "./Texto";

export type EstadoRespuesta = "neutro" | "correcto" | "incorrecto";

// Hasta qué parte del alto de la pantalla crece el detalle; después se desplaza, para
// que una respuesta larga no tape "Continuar" (research de F11, punto 7).
const ALTO_DETALLE = 0.35;

type Props = {
  estado: EstadoRespuesta;
  titulo?: string;
  // F12: un comando o el nombre de un commit, en letra de código, entre el título y el detalle
  codigo?: string;
  detalle?: string;
  // F13: la respuesta con imágenes, una línea por renglón; cada imagen, una miniatura
  lineas?: ParteRespuesta[][];
  textoBoton: string;
  deshabilitado?: boolean;
  alPulsar: () => void;
};

// Barra inferior de cada actividad (docs/diseno.md, sección 6): el botón
// "Comprobar"/"Continuar" y, al comprobar, la retroalimentación, que se
// anuncia al lector de pantalla.
export default function BarraRespuesta({
  estado,
  titulo,
  codigo,
  detalle,
  lineas,
  textoBoton,
  deshabilitado = false,
  alPulsar,
}: Props) {
  const c = useColores();
  const { height: altoPantalla } = useWindowDimensions();

  const textoLineas = lineas?.map(leerLinea).join(" ");

  // accessibilityLiveRegion solo existe en Android; en iOS se anuncia a mano
  useEffect(() => {
    if (Platform.OS === "ios" && estado !== "neutro" && titulo) {
      AccessibilityInfo.announceForAccessibility(
        [titulo, codigo, detalle, textoLineas].filter(Boolean).join(" "),
      );
    }
  }, [estado, titulo, codigo, detalle, textoLineas]);

  const fondo = { neutro: undefined, correcto: c.broteSuave, incorrecto: c.errorSuave }[estado];
  const colorTitulo = estado === "correcto" ? c.broteFuerte : c.error;
  const Icono = estado === "correcto" ? CircleCheck : CircleX;

  return (
    <Superficie tono="solido" elevada style={styles.barra}>
      {/* el color de la respuesta va encima del vidrio sólido */}
      <View style={[styles.relleno, fondo ? { backgroundColor: fondo } : null]}>
        {(titulo || codigo || detalle || lineas) && (
          <View style={styles.mensaje} accessibilityLiveRegion="polite">
            {titulo && (
              <View style={styles.titulo}>
                {estado !== "neutro" && <Icono size={22} color={colorTitulo} strokeWidth={2.25} />}
                <Texto variante="titulo3" style={{ color: colorTitulo }}>
                  {titulo}
                </Texto>
              </View>
            )}
            {/* el código y el detalle se desplazan juntos, y "Continuar" sigue a la vista */}
            {(codigo || detalle || lineas) && (
              <ScrollView
                style={{ maxHeight: altoPantalla * ALTO_DETALLE }}
                contentContainerStyle={styles.desplazable}
              >
                {codigo ? <Texto variante="codigo">{codigo}</Texto> : null}
                {detalle ? <Texto>{detalle}</Texto> : null}
                {lineas?.map((linea, i) => (
                  <View
                    key={i}
                    accessible
                    accessibilityLabel={leerLinea(linea)}
                    style={styles.linea}
                  >
                    {linea.map((parte, j) =>
                      "texto" in parte ? (
                        <Texto key={j}>{parte.texto}</Texto>
                      ) : (
                        <View key={j} style={styles.parteImagen}>
                          <MiniaturaImagen imagen={parte.imagen} />
                          {parte.imagen.textoAlternativo ? (
                            <Texto>{parte.imagen.textoAlternativo}</Texto>
                          ) : null}
                        </View>
                      ),
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
        <Boton titulo={textoBoton} deshabilitado={deshabilitado} alPresionar={alPulsar} />
      </View>
    </Superficie>
  );
}

// Lo que lee el lector de pantalla de una línea: cada imagen, su texto alternativo o "Imagen".
function leerLinea(linea: ParteRespuesta[]): string {
  return linea
    .map((parte) => ("texto" in parte ? parte.texto : parte.imagen.textoAlternativo || "Imagen"))
    .join(" ");
}

const styles = StyleSheet.create({
  barra: {
    borderRadius: radio.enorme,
    overflow: "hidden",
  },
  relleno: {
    gap: espacio[4],
    padding: espacio[5],
  },
  mensaje: {
    gap: espacio[2],
    paddingHorizontal: espacio[2],
  },
  desplazable: {
    gap: espacio[2],
  },
  linea: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: espacio[2],
  },
  parteImagen: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
  titulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
});
