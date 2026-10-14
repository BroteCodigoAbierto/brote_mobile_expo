import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColores } from "../hooks/useColores";

// Navegación raíz. Las pantallas se agregan con cada feature y deben
// coincidir con brote_specs/specs/01-navegacion.md.
export default function LayoutRaiz() {
  const c = useColores();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.superficie },
          headerTintColor: c.texto,
          contentStyle: { backgroundColor: c.fondo },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Brote" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
