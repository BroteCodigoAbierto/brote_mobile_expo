import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import ElementoRespuesta from "../../componentes/ElementoRespuesta";
import type { MarcoArrastre } from "./useArrastrarElemento";

type Props = {
  arrastre: MarcoArrastre;
};

function sinAccion() {}

// La copia que sigue al dedo (docs/diseno.md, sección 4). Va fuera del ScrollView, porque
// dentro quedaría recortada. Al soltar desaparece, sin animación de regreso: el elemento
// nunca dejó su lugar. Es solo decoración, así que el lector de pantalla no la ve.
export default function CapaArrastre({ arrastre }: Props) {
  const { copia, refCapa, x, y } = arrastre;
  const estiloPosicion = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }],
  }));

  return (
    <View
      ref={refCapa}
      collapsable={false}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      {copia && (
        <Animated.View style={[styles.copia, { width: copia.ancho }, estiloPosicion]}>
          <ElementoRespuesta
            texto={copia.texto}
            forma={copia.forma}
            estado="seleccionada"
            etiqueta={copia.texto}
            alPulsar={sinAccion}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  copia: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
