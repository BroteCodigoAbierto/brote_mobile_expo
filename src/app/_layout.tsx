import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import NavegacionRaiz from "../componentes/NavegacionRaiz";
import SesionProvider from "../contextos/SesionProvider";

// La pantalla de arranque se queda hasta saber si hay sesión, para que "Entrar"
// no aparezca ni un instante (spec F01). La oculta NavegacionRaiz.
SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  return (
    <SesionProvider>
      <NavegacionRaiz />
      <StatusBar style="auto" />
    </SesionProvider>
  );
}
