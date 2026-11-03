import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { espacio, MARGEN_PANTALLA } from "../constantes/tema";

type Props = {
  children: ReactNode;
  // la BarraRespuesta de la actividad, fija abajo
  barra?: ReactNode;
};

// Lo que comparten las actividades en el móvil: el contenido se desplaza y la
// barra de respuesta queda fija abajo, por encima del teclado y del área segura
// (docs/diseno.md, sección 6).
export default function MarcoActividad({ children, barra }: Props) {
  const margenes = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.marco}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.marco}
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {barra && (
        <View style={[styles.barra, { paddingBottom: Math.max(margenes.bottom, espacio[5]) }]}>
          {barra}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  marco: {
    flex: 1,
  },
  contenido: {
    gap: espacio[6],
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: espacio[3],
    paddingBottom: espacio[7],
  },
  barra: {
    paddingHorizontal: MARGEN_PANTALLA - espacio[3],
    paddingTop: espacio[3],
  },
});
