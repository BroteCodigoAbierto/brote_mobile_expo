import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColores } from "../hooks/useColores";
import { useSesion } from "../hooks/useSesion";

// Qué pantallas existen según la sesión (spec F01): sin sesión solo (auth);
// con sesión solo (tabs). Al cambiar la sesión (entrar, cerrar, vencer)
// Stack.Protected borra el historial del otro grupo y lleva a su redirectTo,
// así ninguna pantalla navega por su cuenta.
// https://docs.expo.dev/router/advanced/protected/
export default function NavegacionRaiz() {
  const c = useColores();
  const { estado } = useSesion();
  const conSesion = estado === "conSesion";

  useEffect(() => {
    if (estado === "cargando") return;
    // un cuadro después, para que la redirección ya esté pintada
    const cuadro = requestAnimationFrame(() => {
      SplashScreen.hideAsync();
    });
    return () => cancelAnimationFrame(cuadro);
  }, [estado]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.fondo } }}>
      <Stack.Protected guard={conSesion} redirectTo="/entrar">
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!conSesion} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
