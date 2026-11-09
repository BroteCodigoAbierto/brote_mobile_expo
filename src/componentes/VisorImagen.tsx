import { X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, View, type LayoutChangeEvent } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  type PanGestureActiveEvent,
  type PinchGestureActiveEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AREA_TACTIL, espacio } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";
import type { ImagenActividad } from "../tipos/contrato";
import { esGif } from "../utilidades/imagenes";
import BotonPausa from "./BotonPausa";
import ImagenCurso from "./ImagenCurso";

type Props = {
  imagen: ImagenActividad;
  abierto: boolean;
  // un GIF empieza como estaba en la actividad
  pausadaInicial?: boolean;
  alCerrar: () => void;
};

const ESCALA_MAX = 4;

// La imagen a pantalla completa (docs/diseno.md, sección 4; spec F13, "Ampliar una imagen";
// research de F13, punto 12). Un Modal con su propio GestureHandlerRootView, porque en Android
// los gestos de un Modal no llegan al de la raíz. Pellizcar acerca de 1 a 4 veces y, ya
// acercada, arrastrar la mueve sin que se salga del todo. El botón de volver de Android la
// cierra. Con "reducir movimiento" aparece y se va sin animación.
export default function VisorImagen({ imagen, abierto, pausadaInicial = false, alCerrar }: Props) {
  const c = useColores();
  const s = useSombras();
  const margenes = useSafeAreaInsets();
  const reducirMovimiento = useReducedMotion();
  const [pausada, setPausada] = useState(pausadaInicial);
  // un GIF vuelve a empezar como estaba en la actividad cada vez que se abre
  const [abiertoAntes, setAbiertoAntes] = useState(abierto);
  if (abierto !== abiertoAntes) {
    setAbiertoAntes(abierto);
    if (abierto) setPausada(pausadaInicial);
  }

  const escala = useSharedValue(1);
  const escalaInicio = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const inicioX = useSharedValue(0);
  const inicioY = useSharedValue(0);
  const ancho = useSharedValue(0);
  const alto = useSharedValue(0);

  // cada vez que se abre, sin acercar
  useEffect(() => {
    if (!abierto) return;
    escala.set(1);
    x.set(0);
    y.set(0);
  }, [abierto, escala, x, y]);

  // Las funciones corren en el hilo de la interfaz (worklets): solo tocan valores compartidos.
  // Memorizadas, como en Arrastrable, para no volver a mandar la configuración en cada dibujo.
  const configPellizco = useMemo(
    () => ({
      onActivate: () => {
        "worklet";
        escalaInicio.set(escala.get());
      },
      onUpdate: (evento: PinchGestureActiveEvent) => {
        "worklet";
        escala.set(Math.min(ESCALA_MAX, Math.max(1, escalaInicio.get() * evento.scale)));
        // al alejar, lo que estaba movido vuelve a caber
        const limiteX = ((escala.get() - 1) * ancho.get()) / 2;
        const limiteY = ((escala.get() - 1) * alto.get()) / 2;
        x.set(Math.min(limiteX, Math.max(-limiteX, x.get())));
        y.set(Math.min(limiteY, Math.max(-limiteY, y.get())));
      },
    }),
    [alto, ancho, escala, escalaInicio, x, y],
  );
  const configArrastre = useMemo(
    () => ({
      maxPointers: 2,
      onActivate: () => {
        "worklet";
        inicioX.set(x.get());
        inicioY.set(y.get());
      },
      onUpdate: (evento: PanGestureActiveEvent) => {
        "worklet";
        // sin acercar no se mueve
        if (escala.get() <= 1) return;
        const limiteX = ((escala.get() - 1) * ancho.get()) / 2;
        const limiteY = ((escala.get() - 1) * alto.get()) / 2;
        x.set(Math.min(limiteX, Math.max(-limiteX, inicioX.get() + evento.translationX)));
        y.set(Math.min(limiteY, Math.max(-limiteY, inicioY.get() + evento.translationY)));
      },
    }),
    [alto, ancho, escala, inicioX, inicioY, x, y],
  );
  const pellizco = usePinchGesture(configPellizco);
  const arrastre = usePanGesture(configArrastre);
  const gestos = useSimultaneousGestures(pellizco, arrastre);

  const estiloImagen = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: escala.get() }],
  }));

  function medir(evento: LayoutChangeEvent) {
    ancho.set(evento.nativeEvent.layout.width);
    alto.set(evento.nativeEvent.layout.height);
  }

  const boton = {
    backgroundColor: c.vidrioOpaco,
    borderColor: c.vidrioBorde,
    boxShadow: s.suave,
  };
  const nombre = imagen.textoAlternativo
    ? `Imagen ampliada. ${imagen.textoAlternativo}`
    : "Imagen ampliada";

  return (
    <Modal
      visible={abierto}
      transparent
      animationType={reducirMovimiento ? "none" : "fade"}
      statusBarTranslucent
      onRequestClose={alCerrar}
    >
      <GestureHandlerRootView style={[styles.raiz, { backgroundColor: c.fondoVisor }]}>
        <View accessibilityViewIsModal style={styles.raiz}>
          <GestureDetector gesture={gestos}>
            <View
              collapsable={false}
              onLayout={medir}
              style={[
                styles.marco,
                {
                  paddingTop: margenes.top + espacio[5],
                  paddingBottom: margenes.bottom + espacio[5],
                  paddingLeft: margenes.left + espacio[5],
                  paddingRight: margenes.right + espacio[5],
                },
              ]}
              accessible
              accessibilityRole="image"
              accessibilityLabel={nombre}
            >
              <Animated.View style={[styles.imagen, estiloImagen]}>
                <ImagenCurso
                  imagen={imagen}
                  llenar
                  pausada={pausada}
                  etiqueta={imagen.textoAlternativo}
                />
              </Animated.View>
            </View>
          </GestureDetector>
          {esGif(imagen) && (
            <BotonPausa
              pausada={pausada}
              alPulsar={() => setPausada(!pausada)}
              style={{
                bottom: margenes.bottom + espacio[5],
                left: margenes.left + espacio[5],
              }}
            />
          )}
          <Pressable
            onPress={alCerrar}
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
            style={({ pressed }) => [
              styles.cerrar,
              boton,
              { top: margenes.top + espacio[3], right: margenes.right + espacio[3] },
              pressed && styles.presionado,
            ]}
          >
            <X size={20} color={c.texto} strokeWidth={2} />
          </Pressable>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
  },
  marco: {
    flex: 1,
  },
  imagen: {
    flex: 1,
  },
  // con el aspecto de BotonPausa (docs/diseno.md, sección 4, VisorImagen)
  cerrar: {
    position: "absolute",
    zIndex: 1,
    width: AREA_TACTIL,
    height: AREA_TACTIL,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: AREA_TACTIL / 2,
  },
  presionado: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
