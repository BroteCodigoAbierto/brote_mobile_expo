import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColores } from "../hooks/useColores";

type Props = {
  titulo: string;
  // aviso o error general, arriba de los campos
  mensaje?: ReactNode;
  // campos y botón
  children: ReactNode;
  // enlace a la otra pantalla ("Crear cuenta" / "Entrar")
  pie: ReactNode;
};

// Marco común de "Entrar" y "Crear cuenta": se desplaza para que el teclado no
// tape los campos y los toques en el botón llegan aunque el teclado esté abierto.
export default function FormularioCuenta({ titulo, mensaje, children, pie }: Props) {
  const c = useColores();

  return (
    <SafeAreaView style={[styles.pantalla, { backgroundColor: c.fondo }]}>
      <KeyboardAvoidingView
        style={styles.pantalla}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
          <View style={styles.encabezado}>
            <Text style={[styles.marca, { color: c.primario }]}>Brote</Text>
            <Text style={[styles.titulo, { color: c.texto }]} accessibilityRole="header">
              {titulo}
            </Text>
          </View>
          {mensaje}
          <View style={styles.formulario}>{children}</View>
          <View style={styles.pie}>{pie}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  contenido: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    gap: 24,
  },
  encabezado: {
    alignItems: "center",
    gap: 4,
  },
  marca: {
    fontSize: 36,
    fontWeight: "700",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
  },
  formulario: {
    gap: 16,
  },
  pie: {
    alignItems: "center",
  },
});
