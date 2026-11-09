import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { espacio, MARGEN_PANTALLA } from "../constantes/tema";
import CapaArrastre from "./arrastre/CapaArrastre";
import type { MarcoArrastre } from "./arrastre/useArrastrarElemento";

type Props = {
  children: ReactNode;
  // la BarraRespuesta de la actividad, fija abajo
  barra?: ReactNode;
  // las actividades que se arrastran (F11)
  arrastre?: MarcoArrastre;
};

// Lo que comparten las actividades en el móvil: el contenido se desplaza y la
// barra de respuesta queda fija abajo, por encima del teclado y del área segura
// (docs/diseno.md, sección 6). Con `arrastre`, el contenido no se desplaza a mano mientras
// se arrastra, para no pelear con el dedo, y la copia va encima de todo.
export default function MarcoActividad({ children, barra, arrastre }: Props) {
  const margenes = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.marco}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View ref={arrastre?.refZona} collapsable={false} style={styles.marco}>
        <ScrollView
          ref={arrastre?.refDesplazamiento}
          style={styles.marco}
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!arrastre?.arrastrando}
          scrollEventThrottle={16}
          onScroll={arrastre?.alDesplazar}
          onContentSizeChange={arrastre?.alCambiarContenido}
        >
          {children}
        </ScrollView>
      </View>
      {barra && (
        <View style={[styles.barra, { paddingBottom: Math.max(margenes.bottom, espacio[5]) }]}>
          {barra}
        </View>
      )}
      {arrastre && <CapaArrastre arrastre={arrastre} />}
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
