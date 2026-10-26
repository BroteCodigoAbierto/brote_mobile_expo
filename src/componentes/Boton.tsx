import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";

type Props = {
  titulo: string;
  alPresionar: () => void;
  variante?: "primario" | "secundario";
  deshabilitado?: boolean;
  // mientras se envía queda deshabilitado, para que no se envíe dos veces
  enviando?: boolean;
};

export default function Boton({
  titulo,
  alPresionar,
  variante = "primario",
  deshabilitado = false,
  enviando = false,
}: Props) {
  const c = useColores();
  const esPrimario = variante === "primario";
  const inactivo = deshabilitado || enviando;
  const colorTexto = esPrimario ? c.sobrePrimario : c.primario;

  return (
    <Pressable
      onPress={alPresionar}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: enviando }}
      style={({ pressed }) => [
        styles.boton,
        esPrimario
          ? { backgroundColor: c.primario }
          : { backgroundColor: c.superficie, borderWidth: 1, borderColor: c.primario },
        pressed && styles.presionado,
        inactivo && styles.deshabilitado,
      ]}
    >
      <View style={styles.contenido}>
        {enviando && <ActivityIndicator size="small" color={colorTexto} />}
        <Text style={[styles.texto, { color: colorTexto }]}>{titulo}</Text>
      </View>
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
  contenido: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  presionado: {
    opacity: 0.7,
  },
  deshabilitado: {
    opacity: 0.5,
  },
  texto: {
    fontWeight: "600",
    fontSize: 16,
  },
});
