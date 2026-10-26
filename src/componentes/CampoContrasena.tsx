import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useColores } from "../hooks/useColores";
import CampoTexto from "./CampoTexto";

type Props = {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  error?: string;
  autoComplete: "current-password" | "new-password";
  alEnviar?: () => void;
};

// Contraseña con el botón "Mostrar" / "Ocultar". No se pide escribirla dos
// veces (spec F01), así que hay que poder verla.
export default function CampoContrasena({ autoComplete, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const c = useColores();

  return (
    <CampoTexto
      {...props}
      esPassword={!visible}
      autoComplete={autoComplete}
      textContentType={autoComplete === "new-password" ? "newPassword" : "password"}
      accesorio={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          style={styles.alternar}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityState={{ selected: visible }}
        >
          <Text style={[styles.texto, { color: c.primario }]}>
            {visible ? "Ocultar" : "Mostrar"}
          </Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  alternar: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  texto: {
    fontSize: 15,
    fontWeight: "600",
  },
});
