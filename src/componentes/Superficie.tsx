import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
  type ViewProps,
} from "react-native";
import { radio } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";

type Props = ViewProps & {
  tono?: "normal" | "suave" | "solido";
  elevada?: boolean;
};

// Se pregunta una vez si el sistema tiene Liquid Glass (iOS 26 en adelante).
const hayVidrioNativo =
  Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

// Panel de vidrio, base de tarjetas, paneles y barras (docs/diseno.md,
// sección 3). En iOS usa Liquid Glass nativo salvo con "Reducir transparencia";
// en Android y en el resto, una superficie opaca con el mismo borde y sombra.
// Las pantallas no deciden nada de esto.
export default function Superficie({ tono = "normal", elevada = false, style, ...props }: Props) {
  const c = useColores();
  const s = useSombras();
  const oscuro = useColorScheme() === "dark";
  const reducirTransparencia = useReducirTransparencia();

  const base = [
    styles.base,
    { borderColor: c.vidrioBorde, boxShadow: elevada ? s.elevada : s.suave },
  ];

  if (hayVidrioNativo && !reducirTransparencia && tono !== "solido") {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={oscuro ? "dark" : "light"}
        tintColor={tono === "suave" ? c.primarioSuave : undefined}
        style={[base, style]}
        {...props}
      />
    );
  }

  const fondo = tono === "suave" ? c.vidrioSuave : c.vidrioOpaco;
  return <View style={[base, { backgroundColor: fondo }, style]} {...props} />;
}

function useReducirTransparencia(): boolean {
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    let vigente = true;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then((valor) => vigente && setActivo(valor))
      .catch(() => {});
    const suscripcion = AccessibilityInfo.addEventListener("reduceTransparencyChanged", setActivo);
    return () => {
      vigente = false;
      suscripcion.remove();
    };
  }, []);

  return activo;
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radio.grande,
    borderCurve: "continuous",
  },
});
