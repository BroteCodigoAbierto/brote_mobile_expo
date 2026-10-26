import { Stack } from "expo-router";
import { useColores } from "../../hooks/useColores";

// "Entrar" y "Crear cuenta": las únicas pantallas sin sesión (spec F01).
export default function LayoutAuth() {
  const c = useColores();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.fondo } }} />
  );
}
