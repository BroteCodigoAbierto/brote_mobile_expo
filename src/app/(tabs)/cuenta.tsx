import { StyleSheet, Text, View } from "react-native";
import Boton from "../../componentes/Boton";
import { radio } from "../../constantes/tema";
import { useColores } from "../../hooks/useColores";
import { useSesion } from "../../hooks/useSesion";

// Nombre, correo y "Cerrar sesión". Cerrar sesión solo afecta a este
// dispositivo y lleva a "Entrar" (Stack.Protected cambia de pantalla solo).
export default function Cuenta() {
  const c = useColores();
  const { usuario, cerrarSesion } = useSesion();

  return (
    <View style={styles.pantalla}>
      <View style={[styles.tarjeta, { backgroundColor: c.superficie, borderColor: c.borde }]}>
        <Text style={[styles.nombre, { color: c.texto }]}>{usuario?.nombre}</Text>
        <Text style={[styles.correo, { color: c.textoSuave }]}>{usuario?.correo}</Text>
      </View>
      <Boton titulo="Cerrar sesión" variante="secundario" alPresionar={cerrarSesion} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  tarjeta: {
    padding: 18,
    gap: 4,
    borderWidth: 1,
    borderRadius: radio,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "700",
  },
  correo: {
    fontSize: 15,
  },
});
