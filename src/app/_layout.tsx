import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colores } from "../constantes/tema";

// Navegación raíz: una pila de pantallas. Cada pantalla dibuja su propio
// encabezado, por eso se oculta el de la pila.
export default function LayoutRaiz() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colores.claro.fondo },
        }}
      />
      <StatusBar style="dark" />
    </>
  );
}
