import { StyleSheet, View, type ViewProps } from "react-native";
import { useColores, useFondoAmbiental } from "../hooks/useColores";

// Degradados suaves debajo de cada pantalla, sobre los que se ve el vidrio
// (docs/diseno.md, sección 2.1).
export default function FondoAmbiental({ style, ...props }: ViewProps) {
  const c = useColores();
  const degradado = useFondoAmbiental();

  return (
    <View
      style={[
        styles.fondo,
        { backgroundColor: c.fondo, experimental_backgroundImage: degradado },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
});
