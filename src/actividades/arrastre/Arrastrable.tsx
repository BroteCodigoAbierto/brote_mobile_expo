import { useMemo, useRef, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import type { FormaElemento } from "../../componentes/ElementoRespuesta";
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
  deshabilitado?: boolean;
  children: ReactNode;
};

// Hace que un ElementoRespuesta se pueda arrastrar (research de F11, punto 3). Pulsarlo sigue
// siendo su Pressable, que es lo que usa el lector de pantalla: al activarse este gesto, gesture
// handler le cancela el toque (cancelsJSResponder). Un gesto por elemento: por eso es un componente.
export default function Arrastrable<I extends Clave, D extends Clave>({
  arrastre,
  item,
  texto,
  forma,
  deshabilitado = false,
  children,
}: Props<I, D>) {
  const vista = useRef<VistaNativa>(null);
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
        void iniciar(item, vista.current, { texto, forma }, absoluteX, absoluteY);
      },
      onUpdate: ({ absoluteX, absoluteY }: { absoluteX: number; absoluteY: number }) => {
        mover(absoluteX, absoluteY);
      },
      onFinalize: ({ canceled }: { canceled: boolean }) => {
        terminar(item, canceled);
      },
    }),
    [encendido, forma, iniciar, item, mover, terminar, texto],
  );
  const gesto = usePanGesture(configuracion);

  return (
    <GestureDetector gesture={gesto}>
      <View ref={vista} collapsable={false} style={styles.envoltura}>
        {children}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  // en una fila que se envuelve, un texto largo no se sale de la zona
  envoltura: {
    maxWidth: "100%",
  },
});
