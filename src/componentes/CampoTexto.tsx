import type { ReactNode } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";

type Props = {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  error?: string;
  // "correo" pone el teclado de correo y el autocompletado del sistema
  tipo?: "texto" | "correo";
  placeholder?: string;
  esPassword?: boolean;
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  // al pulsar la tecla de enviar del teclado
  alEnviar?: () => void;
  // algo dentro del recuadro, a la derecha (p. ej. "Mostrar" en la contraseña)
  accesorio?: ReactNode;
};

export default function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  error,
  tipo = "texto",
  placeholder,
  esPassword = false,
  autoComplete,
  textContentType,
  autoCapitalize = "none",
  alEnviar,
  accesorio,
}: Props) {
  const c = useColores();
  const esCorreo = tipo === "correo";

  return (
    <View style={styles.contenedor}>
      <Text style={[styles.etiqueta, { color: c.texto }]}>{etiqueta}</Text>
      <View
        style={[
          styles.control,
          { borderColor: error ? c.error : c.borde, backgroundColor: c.superficie },
        ]}
      >
        <TextInput
          style={[styles.entrada, { color: c.texto }]}
          value={valor}
          onChangeText={alCambiar}
          placeholder={placeholder}
          placeholderTextColor={c.textoSuave}
          secureTextEntry={esPassword} // oculta lo que se escribe
          keyboardType={esCorreo ? "email-address" : "default"}
          autoComplete={autoComplete ?? (esCorreo ? "email" : undefined)}
          textContentType={textContentType ?? (esCorreo ? "emailAddress" : undefined)}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          returnKeyType={alEnviar ? "go" : "next"}
          onSubmitEditing={alEnviar}
          accessibilityLabel={etiqueta}
          accessibilityHint={error}
        />
        {accesorio}
      </View>
      {error && (
        <Text style={[styles.error, { color: c.error }]} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
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
  },
  control: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radio,
  },
  entrada: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  error: {
    fontSize: 13,
  },
});
