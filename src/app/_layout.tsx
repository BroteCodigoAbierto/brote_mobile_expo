import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NavegacionRaiz from "../componentes/NavegacionRaiz";
import SesionProvider from "../contextos/SesionProvider";

// La pantalla de arranque se queda hasta tener la tipografía del sistema de
// diseño y saber si hay sesión, para que "Entrar" no aparezca ni un instante
// (spec F01). La oculta NavegacionRaiz.
SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [fuentesListas, errorFuentes] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // si las fuentes no cargan se sigue con la del sistema
  if (!fuentesListas && !errorFuentes) return null;

  // las actividades de relacionar arrastran con gestos (F11)
  return (
    <GestureHandlerRootView style={styles.raiz}>
      <SesionProvider>
        <NavegacionRaiz />
        <StatusBar style="auto" />
      </SesionProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
  },
});
