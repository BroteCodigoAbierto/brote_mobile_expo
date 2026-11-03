// En el SDK 58 las pestañas de JavaScript se importan de expo-router/js-tabs
// (importarlas de "expo-router" está obsoleto).
import { Tabs } from "expo-router/js-tabs";
import { BookMarked, Compass, UserRound } from "lucide-react-native";
import { StyleSheet } from "react-native";
import Superficie from "../../componentes/Superficie";
import { fuentes, radio } from "../../constantes/tema";
import { useColores } from "../../hooks/useColores";

// Pestañas con sesión (docs/diseno.md, sección 4). "Explorar" es el catálogo de
// cursos (spec F02); "Mis cursos", los cursos empezados con su avance (spec
// F04); "Cuenta" tiene el nombre, el correo y "Cerrar sesión" (spec F01). Cada
// pantalla dibuja su propio encabezado sobre el fondo ambiental; la barra es
// de vidrio.
export default function LayoutPestanas() {
  const c = useColores();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarStyle: styles.barra,
        tabBarBackground: () => <Superficie tono="solido" elevada style={styles.fondoBarra} />,
        tabBarActiveTintColor: c.primario,
        tabBarInactiveTintColor: c.textoTenue,
        tabBarLabelStyle: styles.etiqueta,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="mis-cursos"
        options={{
          title: "Mis cursos",
          tabBarIcon: ({ color, size }) => <BookMarked color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: "Cuenta",
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barra: {
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 0,
  },
  fondoBarra: {
    ...StyleSheet.absoluteFill,
    borderBottomWidth: 0,
    borderTopLeftRadius: radio.grande,
    borderTopRightRadius: radio.grande,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  etiqueta: {
    fontFamily: fuentes.seminegrita,
    fontSize: 12,
  },
});
