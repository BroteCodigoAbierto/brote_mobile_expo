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

  return (
    <SesionProvider>
      <NavegacionRaiz />
      <StatusBar style="auto" />
    </SesionProvider>
  );
}
