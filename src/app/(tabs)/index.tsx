import { StyleSheet, Text, View } from "react-native";
import { useColores } from "../../hooks/useColores";
import { useSesion } from "../../hooks/useSesion";

// Pantalla provisional: el catálogo llega con F02. Mientras, saluda con el
// nombre del usuario, que es lo único que existe tras crear la cuenta (F01).
export default function Inicio() {
  const c = useColores();
  const { usuario } = useSesion();

  return (
    <View style={styles.pantalla}>
      <Text style={[styles.saludo, { color: c.texto }]}>Hola, {usuario?.nombre}</Text>
      <Text style={[styles.subtitulo, { color: c.textoSuave }]}>
        Pronto vas a encontrar aquí los cursos de la comunidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  saludo: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitulo: {
    fontSize: 15,
  },
});
