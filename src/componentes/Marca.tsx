import { Sprout } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { coloresPortada, espacio, fuentes, sombras } from "../constantes/tema";
import Texto from "./Texto";

type Props = {
  tamano?: "normal" | "grande";
};

// Logotipo de Brote: el brote en un círculo con degradado y el nombre
// (docs/diseno.md, sección 4).
export default function Marca({ tamano = "normal" }: Props) {
  const grande = tamano === "grande";
  const lado = grande ? 56 : 36;

  return (
    <View
      style={[styles.marca, grande && styles.grande]}
      accessibilityRole="header"
      accessibilityLabel="Brote"
    >
      <View
        style={[styles.simbolo, { width: lado, height: lado, borderRadius: lado / 2 }]}
        importantForAccessibility="no-hide-descendants"
      >
        <Sprout size={grande ? 30 : 20} color="#FFFFFF" strokeWidth={2.25} />
      </View>
      <Texto variante={grande ? "titulo2" : "titulo3"} style={styles.nombre}>
        Brote
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  marca: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
  grande: {
    flexDirection: "column",
    gap: espacio[4],
  },
  simbolo: {
    alignItems: "center",
    justifyContent: "center",
    experimental_backgroundImage: `linear-gradient(135deg, ${coloresPortada[0]}, ${coloresPortada[1]})`,
    boxShadow: sombras.claro.boton,
  },
  nombre: {
    fontFamily: fuentes.extranegrita,
  },
});
