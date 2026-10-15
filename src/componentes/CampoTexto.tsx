import { StyleSheet, Text, TextInput, View } from "react-native";
import { colores, radio } from "../constantes/tema";

type Props = {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  placeholder?: string;
  esPassword?: boolean;
};

export default function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  placeholder,
  esPassword = false,
}: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={alCambiar}
        placeholder={placeholder}
        placeholderTextColor={colores.claro.textoSuave}
        secureTextEntry={esPassword} // oculta lo que se escribe
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 6,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: "600",
    color: colores.claro.texto,
  },
  input: {
    borderWidth: 1,
    borderColor: colores.claro.borde,
    borderRadius: radio,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: colores.claro.superficie,
    color: colores.claro.texto,
  },
});
