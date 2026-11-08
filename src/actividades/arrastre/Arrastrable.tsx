import { useMemo, useRef, useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import { useReducedMotion } from "react-native-reanimated";
import BotonPausa from "../../componentes/BotonPausa";
import { ContextoPausaElemento, type FormaElemento } from "../../componentes/ElementoRespuesta";
import type { ImagenActividad } from "../../tipos/contrato";
import { esGif } from "../../utilidades/imagenes";
import type { Arrastre, Clave, VistaNativa } from "./useArrastrarElemento";

// Mantener pulsado este tiempo empieza a arrastrar. Si el dedo se mueve antes, el gesto
// falla y la pantalla se desplaza: justo lo que pide la spec, sin lógica propia. Más
// corto que un toque largo, para que no se sienta lento.
const ESPERA_ARRASTRE_MS = 250;

type Props<I extends Clave, D extends Clave> = {
  arrastre: Arrastre<I, D>;
  item: I;
  texto: string;
  forma: FormaElemento;
  // F13: el elemento de imagen, para la copia y la pausa de un GIF
  imagen?: ImagenActividad;
  deshabilitado?: boolean;
  children: ReactNode;
};

// Hace que un ElementoRespuesta se pueda arrastrar (research de F11, punto 3). Pulsarlo sigue
// siendo su Pressable, que es lo que usa el lector de pantalla: al activarse este gesto, gesture
// handler le cancela el toque (cancelsJSResponder). Un gesto por elemento: por eso es un componente.
// El BotonPausa de un GIF (F13) va aquí, al lado del gesto y no dentro: así pulsarlo, aunque
// sea largo, nunca empieza a arrastrar.
export default function Arrastrable<I extends Clave, D extends Clave>({
  arrastre,
  item,
  texto,
  forma,
  imagen,
  deshabilitado = false,
  children,
}: Props<I, D>) {
  const vista = useRef<VistaNativa>(null);
  const reducirMovimiento = useReducedMotion();
  const [pausada, setPausada] = useState(reducirMovimiento);
  const gif = imagen !== undefined && esGif(imagen);
  const { iniciar, mover, terminar } = arrastre;
  // se apaga mientras se arrastra otro; el que se arrastra sigue encendido
  const encendido = !deshabilitado && (arrastre.item === null || arrastre.item === item);

  // Memorizada: cambiar la configuración la vuelve a mandar al lado nativo, y no conviene
  // hacerlo en cada dibujo, a mitad de un arrastre. runOnJS: todo corre en JavaScript, sin
  // worklets, porque mientras se arrastra ese hilo no hace nada más.
  const configuracion = useMemo(
    () => ({
      activateAfterLongPress: ESPERA_ARRASTRE_MS,
      maxPointers: 1,
      runOnJS: true,
      enabled: encendido,
      onActivate: ({ absoluteX, absoluteY }: { absoluteX: number; absoluteY: number }) => {
        void iniciar(item, vista.current, { texto, forma, imagen }, absoluteX, absoluteY);
      },
      onUpdate: ({ absoluteX, absoluteY }: { absoluteX: number; absoluteY: number }) => {
        mover(absoluteX, absoluteY);
      },
      onFinalize: ({ canceled }: { canceled: boolean }) => {
        terminar(item, canceled);
      },
    }),
    [encendido, forma, imagen, iniciar, item, mover, terminar, texto],
  );
  const gesto = usePanGesture(configuracion);

  const elemento = (
    <GestureDetector gesture={gesto}>
      <View ref={vista} collapsable={false} style={styles.envoltura}>
        <ContextoPausaElemento.Provider value={pausada}>{children}</ContextoPausaElemento.Provider>
      </View>
    </GestureDetector>
  );
  if (!gif) return elemento;
  return (
    <View style={styles.envoltura}>
      {elemento}
      <BotonPausa pausada={pausada} alPulsar={() => setPausada(!pausada)} />
    </View>
  );
}

const styles = StyleSheet.create({
  // en una fila que se envuelve, un texto largo no se sale de la zona
  envoltura: {
    maxWidth: "100%",
  },
});
