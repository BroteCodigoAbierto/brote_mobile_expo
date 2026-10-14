import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { usePeticion } from "../hooks/usePeticion";
import { traerSalud } from "../servicios/salud";

// Pantalla provisional: el catálogo llega con F02. Mientras, muestra si la API
// responde, para comprobar que el móvil y el backend están conectados.
export default function Inicio() {
  const c = useColores();
  const { datos, cargando, error } = usePeticion(traerSalud);

  return (
    <View style={styles.contenedor}>
      <Text style={[styles.titulo, { color: c.primario }]}>Brote</Text>
      <Text style={{ color: c.textoSuave }}>Cursos interactivos creados por la comunidad.</Text>

      {cargando && <ActivityIndicator color={c.primario} />}
      {error !== null && (
        <Text style={[styles.estado, { color: c.error, backgroundColor: c.errorFondo }]}>
          No se pudo conectar con la API. Revisa EXPO_PUBLIC_URL_API en .env.
        </Text>
      )}
      {datos && (
        <Text style={[styles.estado, { color: c.exito, backgroundColor: c.exitoFondo }]}>
          API conectada.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espacio.tres,
    padding: espacio.cuatro,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "700",
  },
  estado: {
    paddingVertical: espacio.dos,
    paddingHorizontal: espacio.tres,
    borderRadius: radio,
    overflow: "hidden",
  },
});
