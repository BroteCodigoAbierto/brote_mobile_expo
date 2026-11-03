import { ActivityIndicator, StyleSheet, View } from "react-native";
import { espacio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";

type Props = {
  // "chico" va al pie de una lista mientras se cargan más elementos
  tamano?: "normal" | "chico";
  etiqueta?: string;
};

// Indicador de carga en el color primario, centrado en su espacio.
export default function IndicadorCarga({ tamano = "normal", etiqueta = "Cargando" }: Props) {
  const c = useColores();
  return (
    <View style={tamano === "normal" ? styles.centro : styles.pie}>
      <ActivityIndicator
        size={tamano === "normal" ? "large" : "small"}
        color={c.primario}
        accessibilityLabel={etiqueta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: espacio[9],
  },
  pie: {
    paddingVertical: espacio[7],
  },
});
