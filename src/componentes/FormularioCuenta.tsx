import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { espacio, MARGEN_PANTALLA, radio } from "../constantes/tema";
import FondoAmbiental from "./FondoAmbiental";
import Marca from "./Marca";
import Superficie from "./Superficie";
import Texto from "./Texto";

type Props = {
  titulo: string;
  subtitulo: string;
  // aviso o error general, arriba de los campos
  mensaje?: ReactNode;
  // campos y botón
  children: ReactNode;
  // enlace a la otra pantalla ("Crear cuenta" / "Entrar")
  pie: ReactNode;
};

// Marco común de "Entrar" y "Crear cuenta" (docs/diseno.md, sección 5): se
// desplaza para que el teclado no tape los campos y los toques en el botón
// llegan aunque el teclado esté abierto.
export default function FormularioCuenta({ titulo, subtitulo, mensaje, children, pie }: Props) {
  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.pantalla}>
        <KeyboardAvoidingView
          style={styles.pantalla}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
            <Marca tamano="grande" />
            <Superficie elevada style={styles.tarjeta}>
              <View style={styles.encabezado}>
                <Texto variante="titulo1" style={styles.centrado} accessibilityRole="header">
                  {titulo}
                </Texto>
                <Texto variante="cuerpoChico" color="textoSuave" style={styles.centrado}>
                  {subtitulo}
                </Texto>
              </View>
              {mensaje}
              <View style={styles.formulario}>{children}</View>
            </Superficie>
            <View style={styles.pie}>{pie}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </FondoAmbiental>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  contenido: {
    flexGrow: 1,
    justifyContent: "center",
    padding: MARGEN_PANTALLA,
    gap: espacio[7],
  },
  tarjeta: {
    padding: espacio[7],
    gap: espacio[7],
    borderRadius: radio.enorme,
  },
  encabezado: {
    gap: espacio[3],
  },
  centrado: {
    textAlign: "center",
  },
  formulario: {
    gap: espacio[5],
  },
  pie: {
    alignItems: "center",
  },
});
