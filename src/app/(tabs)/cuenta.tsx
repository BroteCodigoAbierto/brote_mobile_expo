import { LogOut } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Boton from "../../componentes/Boton";
import FondoAmbiental from "../../componentes/FondoAmbiental";
import Superficie from "../../componentes/Superficie";
import Texto from "../../componentes/Texto";
import { coloresPortada, espacio, fuentes, MARGEN_PANTALLA, radio } from "../../constantes/tema";
import { useSesion } from "../../hooks/useSesion";
import { inicialPortada } from "../../utilidades/cursos";

// Nombre, correo y "Cerrar sesión". Cerrar sesión solo afecta a este
// dispositivo y lleva a "Entrar" (Stack.Protected cambia de pantalla solo).
export default function Cuenta() {
  const { usuario, cerrarSesion } = useSesion();

  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.pantalla} edges={["top"]}>
        <Texto variante="titulo1" accessibilityRole="header">
          Cuenta
        </Texto>
        <Superficie elevada style={styles.tarjeta}>
          <View style={styles.avatar} importantForAccessibility="no-hide-descendants">
            <Texto variante="titulo2" style={styles.inicial}>
              {inicialPortada(usuario?.nombre ?? "")}
            </Texto>
          </View>
          <View style={styles.datos}>
            <Texto variante="titulo3">{usuario?.nombre}</Texto>
            <Texto variante="cuerpoChico" color="textoSuave">
              {usuario?.correo}
            </Texto>
          </View>
        </Superficie>
        <Boton
          titulo="Cerrar sesión"
          variante="peligro"
          icono={LogOut}
          alPresionar={cerrarSesion}
        />
      </SafeAreaView>
    </FondoAmbiental>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    paddingTop: espacio[5],
    paddingHorizontal: MARGEN_PANTALLA,
    gap: espacio[7],
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[5],
    padding: espacio[6],
    borderRadius: radio.enorme,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    experimental_backgroundImage: `linear-gradient(135deg, ${coloresPortada[0]}, ${coloresPortada[1]})`,
  },
  inicial: {
    color: "#FFFFFF",
    fontFamily: fuentes.extranegrita,
  },
  datos: {
    flex: 1,
    gap: espacio[1],
  },
});
