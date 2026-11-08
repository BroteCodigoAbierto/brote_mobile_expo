import { CircleCheck, CircleX } from "lucide-react-native";
import { createContext, useContext, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { espacio, fuentes, medidasImagen, radio } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";
import type { ImagenActividad } from "../tipos/contrato";
import MosaicoImagen from "./MosaicoImagen";
import type { EstadoOpcion } from "./OpcionRespuesta";
import Texto from "./Texto";

// "mosaico" (F13): un elemento de imagen
export type FormaElemento = "tarjeta" | "compacta" | "mosaico";

// Si el GIF de un elemento está en pausa. Lo da Arrastrable, que pone el BotonPausa fuera de
// su gesto para que pulsarlo no empiece a arrastrar (F13).
export const ContextoPausaElemento = createContext(false);

type Props = {
  texto?: string;
  // F13: un elemento de imagen, en forma "mosaico"
  imagen?: ImagenActividad;
  // F13: el mosaico toma el ancho de su contenedor (las columnas de emparejar)
  llenar?: boolean;
  // F13: un GIF quieto, como en la copia que sigue al dedo
  quieta?: boolean;
  estado?: EstadoOpcion;
  forma?: FormaElemento;
  // el número que se ve en los dos elementos de una pareja
  marca?: number;
  // su lugar de origen, mientras se arrastra
  atenuada?: boolean;
  // el destino que el elemento arrastrado tiene debajo
  resaltada?: boolean;
  deshabilitada?: boolean;
  // nombre accesible, con su estado (p. ej. "git push, pareja 2")
  etiqueta: string;
  alPulsar: () => void;
};

// Elemento que se mueve o se une en las actividades de relacionar (docs/diseno.md, sección
// 4): el aspecto de OpcionRespuesta, pero es un botón y no un radio, y lleva número. Arrastrar
// lo pone Arrastrable, por fuera: aquí solo se pulsa, también con un lector de pantalla. Con
// imagen (F13), un mosaico con la marca y el icono como insignias.
export default function ElementoRespuesta({
  texto,
  imagen,
  llenar = false,
  quieta = false,
  estado = "normal",
  forma = "tarjeta",
  marca,
  atenuada = false,
  resaltada = false,
  deshabilitada = false,
  etiqueta,
  alPulsar,
}: Props) {
  const c = useColores();
  const s = useSombras();
  const reducirMovimiento = useReducedMotion();
  const desplazamiento = useSharedValue(0);
  const pausada = useContext(ContextoPausaElemento);

  useEffect(() => {
    if (estado !== "incorrecta" || reducirMovimiento) return;
    const paso = { duration: 60 };
    desplazamiento.set(
      withSequence(
        withTiming(-6, paso),
        withTiming(6, paso),
        withTiming(-6, paso),
        withTiming(6, paso),
        withTiming(0, paso),
      ),
    );
  }, [estado, reducirMovimiento, desplazamiento]);

  const estiloSacudida = useAnimatedStyle(() => ({
    transform: [{ translateX: desplazamiento.get() }],
  }));

  const aspecto = {
    normal: { borde: c.borde, fondo: c.vidrioOpaco, sombra: undefined },
    seleccionada: { borde: c.primario, fondo: c.primarioSuave, sombra: s.elevada },
    correcta: { borde: c.broteFuerte, fondo: c.broteSuave, sombra: undefined },
    incorrecta: { borde: c.error, fondo: c.errorSuave, sombra: undefined },
  }[estado];
  const icono =
    estado === "correcta"
      ? (tamano: number) => <CircleCheck size={tamano} color={c.broteFuerte} strokeWidth={2.25} />
      : estado === "incorrecta"
        ? (tamano: number) => <CircleX size={tamano} color={c.error} strokeWidth={2.25} />
        : null;
  const borde = resaltada ? c.primario : aspecto.borde;
  const fondo = resaltada ? c.primarioSuave : aspecto.fondo;

  return (
    <Animated.View style={[estiloSacudida, atenuada ? styles.atenuada : null]}>
      <Pressable
        onPress={alPulsar}
        disabled={deshabilitada}
        accessibilityRole="button"
        accessibilityLabel={etiqueta}
        accessibilityState={{ selected: estado === "seleccionada", disabled: deshabilitada }}
        style={({ pressed }) => [
          styles.elemento,
          imagen ? (llenar ? styles.mosaicoLleno : styles.mosaico) : null,
          // debajo del color del elemento, el vidrio opaco
          { borderColor: borde, backgroundColor: c.vidrioOpaco, boxShadow: aspecto.sombra },
          pressed && !deshabilitada && styles.presionada,
        ]}
      >
        <View
          style={[
            styles.relleno,
            imagen
              ? styles.rellenoMosaico
              : forma === "compacta"
                ? styles.compacta
                : styles.tarjeta,
            { backgroundColor: fondo },
          ]}
        >
          {imagen && (
            <>
              <MosaicoImagen imagen={imagen} quieta={quieta} pausada={pausada} />
              {marca !== undefined && (
                <View
                  style={[styles.marca, styles.marcaMosaico, { backgroundColor: c.primarioSuave }]}
                >
                  <Texto variante="etiqueta" color="primario">
                    {marca}
                  </Texto>
                </View>
              )}
              {icono && (
                <View style={[styles.iconoMosaico, { backgroundColor: c.vidrioOpaco }]}>
                  {icono(22)}
                </View>
              )}
            </>
          )}
          {!imagen && marca !== undefined && (
            <View style={[styles.marca, { backgroundColor: c.primarioSuave }]}>
              <Texto variante="etiqueta" color="primario">
                {marca}
              </Texto>
              {/* con número, el icono va de insignia: al borde le quitaría ancho al texto en
                  las columnas de emparejar, y las palabras se partirían */}
              {icono && (
                <View style={[styles.insignia, { backgroundColor: c.vidrioOpaco }]}>
                  {icono(14)}
                </View>
              )}
            </View>
          )}
          {!imagen && <Texto style={styles.texto}>{texto}</Texto>}
          {!imagen && marca === undefined && icono && <View style={styles.icono}>{icono(22)}</View>}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  atenuada: {
    opacity: 0.4,
  },
  elemento: {
    borderWidth: 2,
    borderRadius: radio.medio,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  presionada: {
    transform: [{ scale: 0.98 }],
  },
  relleno: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
    paddingHorizontal: espacio[4],
  },
  // con el borde de 2 px, mide al menos 56
  tarjeta: {
    minHeight: 52,
    paddingVertical: espacio[4],
  },
  // con el borde de 2 px, mide al menos 44
  compacta: {
    minHeight: 40,
    paddingVertical: espacio[3],
  },
  marca: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: radio.pildora,
  },
  // en la esquina superior derecha del número, un poco por fuera
  insignia: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radio.pildora,
  },
  texto: {
    flexShrink: 1,
    fontFamily: fuentes.medio,
  },
  // al borde, como en OpcionRespuesta
  icono: {
    marginLeft: "auto",
  },
  // F13: el mosaico de un elemento de imagen, cuadrado
  mosaico: {
    width: medidasImagen.mosaicoElemento,
    height: medidasImagen.mosaicoElemento,
  },
  mosaicoLleno: {
    width: "100%",
    aspectRatio: 1,
  },
  rellenoMosaico: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: espacio[1],
    paddingVertical: espacio[1],
  },
  marcaMosaico: {
    position: "absolute",
    top: espacio[2],
    left: espacio[2],
    zIndex: 1,
  },
  iconoMosaico: {
    position: "absolute",
    top: espacio[2],
    right: espacio[2],
    zIndex: 1,
    borderRadius: radio.pildora,
  },
});
