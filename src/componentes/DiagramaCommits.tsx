import { CircleCheck, CircleX } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { PixelRatio, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import type { ActividadGrafoCommits } from "../tipos/contrato";
import {
  acomodarGrafo,
  medirGrafo,
  nombreAccesibleCommit,
  rutaLinea,
  type EstadoCommit,
  type MedidaGrafo,
} from "../utilidades/grafo";
import Superficie from "./Superficie";
import Texto from "./Texto";

type Props = {
  actividad: ActividadGrafoCommits;
  elegido: number | null;
  comprobado: boolean;
  alElegir: (indice: number) => void;
};

function estadoDe(
  indice: number,
  elegido: number | null,
  comprobado: boolean,
  respuesta: number,
): EstadoCommit {
  if (comprobado && indice === respuesta) return "correcto";
  if (comprobado && indice === elegido) return "incorrecto";
  return indice === elegido ? "elegido" : "normal";
}

type PropsCommit = {
  nombre: string;
  estado: EstadoCommit;
  etiqueta: string;
  centro: { x: number; y: number };
  medida: MedidaGrafo;
  deshabilitado: boolean;
  alPulsar: () => void;
};

// Un commit: el área de 44 que se pulsa con el círculo de 40 dentro. Correcto e incorrecto,
// como las opciones, con icono; el incorrecto se sacude, salvo con "reducir movimiento".
function Commit({
  nombre,
  estado,
  etiqueta,
  centro,
  medida,
  deshabilitado,
  alPulsar,
}: PropsCommit) {
  const c = useColores();
  const reducirMovimiento = useReducedMotion();
  const desplazamiento = useSharedValue(0);

  useEffect(() => {
    if (estado !== "incorrecto" || reducirMovimiento) return;
    const paso = { duration: 60 };
    desplazamiento.value = withSequence(
      withTiming(-6, paso),
      withTiming(6, paso),
      withTiming(-6, paso),
      withTiming(6, paso),
      withTiming(0, paso),
    );
  }, [estado, reducirMovimiento, desplazamiento]);

  const estiloSacudida = useAnimatedStyle(() => ({
    transform: [{ translateX: desplazamiento.value }],
  }));

  const aspecto = {
    normal: { borde: c.textoTenue, fondo: "transparent" },
    elegido: { borde: c.primario, fondo: c.primarioSuave },
    correcto: { borde: c.broteFuerte, fondo: c.broteSuave },
    incorrecto: { borde: c.error, fondo: c.errorSuave },
  }[estado];
  const { area, circulo } = medida;

  return (
    <Pressable
      onPress={alPulsar}
      disabled={deshabilitado}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      accessibilityState={{ selected: estado === "elegido", disabled: deshabilitado }}
      style={({ pressed }) => [
        styles.commit,
        { left: centro.x - area / 2, top: centro.y - area / 2, width: area, height: area },
        pressed && !deshabilitado && styles.presionado,
      ]}
    >
      <Animated.View
        style={[
          styles.circulo,
          {
            width: circulo,
            height: circulo,
            borderColor: aspecto.borde,
            // debajo del color del estado, el vidrio opaco: la línea no se ve a través
            backgroundColor: c.vidrioOpaco,
          },
          estiloSacudida,
        ]}
      >
        <View style={[styles.relleno, { backgroundColor: aspecto.fondo }]} />
        <Texto variante="codigo">{nombre}</Texto>
        {(estado === "correcto" || estado === "incorrecto") && (
          <View style={[styles.icono, { backgroundColor: c.vidrioOpaco }]}>
            {estado === "correcto" ? (
              <CircleCheck size={16} color={c.broteFuerte} strokeWidth={2.25} />
            ) : (
              <CircleX size={16} color={c.error} strokeWidth={2.25} />
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// El grafo de commits (docs/diseno.md, sección 4): líneas con react-native-svg y cada commit
// un botón encima, en las posiciones de acomodarGrafo y medirGrafo (brote_specs, research de
// F12, puntos 2 y 3). Con letra grande, si no cabe, se desplaza hacia los lados.
export default function DiagramaCommits({ actividad, elegido, comprobado, alElegir }: Props) {
  const c = useColores();
  const [disponible, setDisponible] = useState(0);
  const acomodo = useMemo(() => acomodarGrafo(actividad), [actividad]);
  const medida =
    disponible > 0 ? medirGrafo(acomodo, actividad, disponible, PixelRatio.getFontScale()) : null;

  // por columna y, en cada una, de arriba abajo: el orden en que los recorre el lector
  const orden = actividad.commits
    .map((_, indice) => indice)
    .sort((a, b) => {
      const [pa, pb] = [acomodo.posiciones[a], acomodo.posiciones[b]];
      return pa.columna - pb.columna || pa.fila - pb.fila;
    });

  const caja = medida && (
    <View style={{ width: medida.ancho, height: medida.alto }}>
      <Svg
        width={medida.ancho}
        height={medida.alto}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {actividad.commits.flatMap((commit, hijo) =>
          commit.padres.map((padre, i) => (
            <Path
              key={`${hijo}-${i}`}
              d={rutaLinea(medida.centros[padre], medida.centros[hijo], i === 0, medida.separacion)}
              stroke={c.textoTenue}
              strokeWidth={2}
              fill="none"
            />
          )),
        )}
      </Svg>
      {/* las ramas y HEAD ya van en el nombre de cada commit */}
      {medida.etiquetas.map((etiqueta, i) => (
        <View
          key={i}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.etiqueta,
            {
              left: etiqueta.x,
              top: etiqueta.y,
              width: etiqueta.ancho,
              height: medida.altoEtiqueta,
              backgroundColor: etiqueta.tipo === "head" ? c.primario : c.vidrioOpaco,
            },
          ]}
        >
          {etiqueta.tipo === "rama" && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: c.primarioSuave }]} />
          )}
          <Texto
            variante="codigo"
            color={etiqueta.tipo === "head" ? "sobrePrimario" : "primario"}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {etiqueta.texto}
          </Texto>
        </View>
      ))}
      {orden.map((indice) => {
        const estado = estadoDe(indice, elegido, comprobado, actividad.respuesta);
        return (
          <Commit
            key={indice}
            nombre={actividad.commits[indice].nombre}
            estado={estado}
            etiqueta={nombreAccesibleCommit(actividad, indice, estado)}
            centro={medida.centros[indice]}
            medida={medida}
            deshabilitado={comprobado}
            alPulsar={() => alElegir(indice)}
          />
        );
      })}
    </View>
  );

  return (
    <Superficie style={styles.superficie}>
      <View onLayout={(evento) => setDisponible(evento.nativeEvent.layout.width)}>
        {medida?.desborda ? (
          <ScrollView horizontal>{caja}</ScrollView>
        ) : (
          <View style={styles.centrado}>{caja}</View>
        )}
      </View>
    </Superficie>
  );
}

const styles = StyleSheet.create({
  superficie: {
    padding: espacio[5],
  },
  // no se estira de más: va al centro
  centrado: {
    alignItems: "center",
  },
  etiqueta: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radio.pildora,
    overflow: "hidden",
  },
  commit: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  circulo: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: radio.pildora,
  },
  relleno: {
    position: "absolute",
    inset: 0,
    borderRadius: radio.pildora,
  },
  presionado: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  // en la esquina, sobre un círculo opaco, para que se vea encima del borde
  icono: {
    position: "absolute",
    top: -espacio[3],
    right: -espacio[3],
    borderRadius: radio.pildora,
  },
});
