import { useEffect, useRef, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { Arrastre, Clave, VistaNativa } from "./useArrastrarElemento";

type Props<I extends Clave, D extends Clave> = {
  arrastre: Arrastre<I, D>;
  destino: D;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

// Registra su vista como destino, para medirla cuando empiece un arrastre.
export default function DestinoArrastre<I extends Clave, D extends Clave>({
  arrastre,
  destino,
  style,
  children,
}: Props<I, D>) {
  const vista = useRef<VistaNativa>(null);
  const { registrarDestino } = arrastre;

  useEffect(() => {
    registrarDestino(destino, vista.current);
    return () => registrarDestino(destino, null);
  }, [destino, registrarDestino]);

  return (
    <View ref={vista} collapsable={false} style={style}>
      {children}
    </View>
  );
}
