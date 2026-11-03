import { Eye, EyeOff, LockKeyhole } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { AREA_TACTIL, espacio, fuentes, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import CampoTexto from "./CampoTexto";
import Texto from "./Texto";

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
  const Icono = visible ? EyeOff : Eye;

  return (
    <CampoTexto
      {...props}
      icono={LockKeyhole}
      esPassword={!visible}
      autoComplete={autoComplete}
      textContentType={autoComplete === "new-password" ? "newPassword" : "password"}
      accesorio={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          style={({ pressed }) => [
            styles.alternar,
            pressed && { backgroundColor: c.primarioSuave },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: visible }}
        >
          <Icono size={17} color={c.primario} strokeWidth={2.25} />
          <Texto variante="nota" color="primario" style={styles.texto}>
            {visible ? "Ocultar" : "Mostrar"}
          </Texto>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  alternar: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[2],
    minHeight: AREA_TACTIL,
    paddingHorizontal: espacio[4],
    borderRadius: radio.chico,
  },
  texto: {
    fontFamily: fuentes.seminegrita,
  },
});
