import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Boton from "../componentes/Boton";
import CampoTexto from "../componentes/CampoTexto";
import { colores } from "../constantes/tema";

// Pantalla de login
export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  // no campos vacios
  const camposLlenos = correo.trim() !== "" && password !== "";

  function entrar() {
    // replace en lugar de push para que no regrese al login
    router.replace("/inicio");
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenido}>
        <View style={styles.encabezado}>
          {/* espacio para el logo, mientras no hay imagen */}
          <View style={styles.logo} />
          <Text style={styles.titulo}>Brote</Text>
          <Text style={styles.subtitulo}>Aprende</Text>
        </View>

        <View style={styles.formulario}>
          <CampoTexto
            etiqueta="Correo"
            valor={correo}
            alCambiar={setCorreo}
            placeholder="tu@correo.com"
          />
          <CampoTexto
            etiqueta="Contraseña"
            valor={password}
            alCambiar={setPassword}
            placeholder="********"
            esPassword
          />
          <Boton titulo="Iniciar sesión" alPresionar={entrar} deshabilitado={!camposLlenos} />
          <Boton titulo="Crear cuenta" alPresionar={entrar} variante="secundario" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.claro.fondo,
  },
  contenido: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 40,
  },
  encabezado: {
    alignItems: "center",
    gap: 4,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colores.claro.borde,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 36,
    fontWeight: "700",
    color: colores.claro.primario,
  },
  subtitulo: {
    fontSize: 15,
    color: colores.claro.textoSuave,
  },
  formulario: {
    gap: 16,
  },
});
