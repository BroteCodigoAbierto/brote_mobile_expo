import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AREA_TACTIL, espacio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import Superficie from "./Superficie";
import Texto from "./Texto";

type Props = {
  // con título, es una categoría
  titulo?: string;
  // el elemento arrastrado está encima
  resaltada?: boolean;
  // nombre accesible del título, p. ej. "Categoría Palabra clave"
  etiqueta: string;
  alPulsar?: () => void;
  children?: ReactNode;
};

// Agrupa elementos: los sin colocar, el banco o una categoría (docs/diseno.md, sección 4).
// Sigue visible aunque esté vacía, para poder soltar ahí. El Pressable de afuera atiende
// los toques en toda la zona, pero es accessible={false}: una vista accesible agrupa a sus
// hijos, y el lector de pantalla no llegaría a los elementos. Por eso el botón para el
// lector es el título (research de F11, punto 8).
export default function ZonaElementos({
  titulo,
  resaltada = false,
  etiqueta,
  alPulsar,
  children,
}: Props) {
  const c = useColores();

  return (
    <Pressable accessible={false} onPress={alPulsar} disabled={!alPulsar}>
      <Superficie
        tono="suave"
        style={[
          styles.zona,
          resaltada && { borderColor: c.primario, backgroundColor: c.primarioSuave },
        ]}
      >
        {titulo !== undefined && (
          <Pressable
            onPress={alPulsar}
            disabled={!alPulsar}
            accessibilityRole="button"
            accessibilityLabel={etiqueta}
            style={styles.titulo}
          >
            <Texto variante="etiqueta" color="textoSuave">
              {titulo}
            </Texto>
          </Pressable>
        )}
        <View style={styles.elementos}>{children}</View>
      </Superficie>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  zona: {
    gap: espacio[2],
    minHeight: 72,
    padding: espacio[4],
  },
  titulo: {
    justifyContent: "center",
    minHeight: AREA_TACTIL,
  },
  elementos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio[3],
  },
});
