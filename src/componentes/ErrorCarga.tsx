import { StyleSheet, Text, View } from "react-native";
import { espacio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import Boton from "./Boton";

type Props = {
  mensaje: string;
  alReintentar: () => void;
};

// No se pudieron traer los datos de una pantalla (o los 10 siguientes).
export default function ErrorCarga({ mensaje, alReintentar }: Props) {
  const c = useColores();

  return (
    <View style={styles.contenedor}>
      <Text
        style={[styles.mensaje, { color: c.error }]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        {mensaje}
      </Text>
      <Boton titulo="Reintentar" variante="secundario" alPresionar={alReintentar} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: "center",
    gap: espacio.tres,
    paddingVertical: espacio.cuatro,
  },
  mensaje: {
    fontSize: 15,
    textAlign: "center",
  },
});
