import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colores } from "../constantes/tema";

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
