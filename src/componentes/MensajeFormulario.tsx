import { StyleSheet, Text } from "react-native";
import { radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";

type Props = {
  texto: string;
  variante?: "error" | "aviso";
};

// Mensaje general arriba de un formulario: un error que no es de un campo
// ("Correo o contraseña incorrectos.") o un aviso ("Tu sesión terminó...").
export default function MensajeFormulario({ texto, variante = "error" }: Props) {
  const c = useColores();
  const esError = variante === "error";

  return (
    <Text
      style={[
        styles.mensaje,
        esError
          ? { color: c.error, backgroundColor: c.errorFondo, borderColor: c.error }
          : { color: c.texto, backgroundColor: c.superficie, borderColor: c.borde },
      ]}
      accessibilityRole={esError ? "alert" : "text"}
      accessibilityLiveRegion="polite"
    >
      {texto}
    </Text>
  );
}

const styles = StyleSheet.create({
  mensaje: {
    padding: 12,
    borderWidth: 1,
    borderRadius: radio,
    fontSize: 15,
    overflow: "hidden",
  },
});
