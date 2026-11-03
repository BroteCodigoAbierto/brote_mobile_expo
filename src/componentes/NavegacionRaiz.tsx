import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColores } from "../hooks/useColores";
import { useSesion } from "../hooks/useSesion";

// Qué pantallas existen según la sesión (spec F01): sin sesión solo (auth);
// con sesión, (tabs), el detalle de un curso (F02), que se abre encima de las
// pestañas para que el catálogo siga montado debajo, y la lección (F03), encima
// del detalle y sin pestañas. Al cambiar la sesión (entrar, cerrar, vencer)
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
        {/* el detalle dibuja su propio botón de volver sobre el fondo ambiental */}
        <Stack.Screen name="curso/[idCurso]" />
        <Stack.Screen name="leccion/[idCurso]/[idLeccion]" />
      </Stack.Protected>
      <Stack.Protected guard={!conSesion} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
