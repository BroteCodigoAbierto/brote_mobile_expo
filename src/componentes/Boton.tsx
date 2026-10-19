import { Pressable, StyleSheet, Text } from "react-native";
import { colores, radio } from "../constantes/tema";

type Props = {
  titulo: string;
  alPresionar: () => void;
  variante?: "primario" | "secundario";
  deshabilitado?: boolean;
};

export default function Boton({
  titulo,
  alPresionar,
  variante = "primario",
  deshabilitado = false,
}: Props) {
  const esPrimario = variante === "primario";

  return (
    <Pressable
      onPress={alPresionar}
      disabled={deshabilitado}
      style={({ pressed }) => [
        styles.boton,
        esPrimario ? styles.primario : styles.secundario,
        pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
      ]}
    >
      <Text style={esPrimario ? styles.textoPrimario : styles.textoSecundario}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radio,
    alignItems: "center",
  },
  primario: {
    backgroundColor: colores.claro.primario,
  },
  secundario: {
    backgroundColor: colores.claro.superficie,
    borderWidth: 1,
    borderColor: colores.claro.primario,
  },
  presionado: {
    opacity: 0.7,
  },
  deshabilitado: {
    opacity: 0.4,
  },
  textoPrimario: {
    color: colores.claro.sobrePrimario,
    fontWeight: "600",
    fontSize: 16,
  },
  textoSecundario: {
    color: colores.claro.primario,
    fontWeight: "600",
    fontSize: 16,
  },
});
