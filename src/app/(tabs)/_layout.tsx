// En el SDK 58 las pestañas de JavaScript se importan de expo-router/js-tabs
// (importarlas de "expo-router" está obsoleto).
import { Tabs } from "expo-router/js-tabs";
import { useColores } from "../../hooks/useColores";

// Pestañas con sesión. "Inicio" es provisional hasta F02 (catálogo); "Cuenta"
// tiene el nombre, el correo y "Cerrar sesión" (spec F01).
export default function LayoutPestanas() {
  const c = useColores();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: c.superficie },
        headerTintColor: c.texto,
        sceneStyle: { backgroundColor: c.fondo },
        tabBarStyle: { backgroundColor: c.superficie, borderTopColor: c.borde },
        tabBarActiveTintColor: c.primario,
        tabBarInactiveTintColor: c.textoSuave,
        // sin íconos por ahora: no hay librería de íconos en el proyecto
        tabBarIconStyle: { display: "none" },
        tabBarLabelStyle: { fontSize: 15, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="cuenta" options={{ title: "Cuenta" }} />
    </Tabs>
  );
}
