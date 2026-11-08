import { router, useLocalSearchParams, usePreventRemove } from "expo-router";
import { CircleSlash, NotebookPen } from "lucide-react-native";
import { useCallback, useState, type ReactNode } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EncabezadoLeccion from "../../../actividades/EncabezadoLeccion";
import ReproductorLeccion from "../../../actividades/ReproductorLeccion";
import { actividadesConocidas } from "../../../actividades/registro";
import Boton from "../../../componentes/Boton";
import ErrorCarga from "../../../componentes/ErrorCarga";
import EstadoVacio from "../../../componentes/EstadoVacio";
import FondoAmbiental from "../../../componentes/FondoAmbiental";
import IndicadorCarga from "../../../componentes/IndicadorCarga";
import ResultadoLeccion from "../../../componentes/ResultadoLeccion";
import { MARGEN_PANTALLA } from "../../../constantes/tema";
import { useGuardarProgreso } from "../../../hooks/useGuardarProgreso";
import { usePeticion } from "../../../hooks/usePeticion";
import { useReproductor } from "../../../hooks/useReproductor";
import { esNoDisponible, leerErrorDeCarga } from "../../../servicios/cursos";
import { traerLeccion } from "../../../servicios/lecciones";
import { MENSAJES_LECCION, type Actividad, type DetalleLeccion } from "../../../tipos/contrato";

// Cursar una lección (spec F03), a pantalla completa encima del detalle del curso.
export default function PantallaLeccion() {
  const { idCurso, idLeccion } = useLocalSearchParams<{ idCurso: string; idLeccion: string }>();
  const { datos, cargando, error, recargar } = usePeticion(
    useCallback(() => traerLeccion(idCurso, idLeccion), [idCurso, idLeccion]),
  );

  // vuelve al detalle del curso, que quedó debajo
  function salir() {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: "/curso/[idCurso]", params: { idCurso } });
  }

  function conEncabezado(contenido: ReactNode) {
    return (
      <Marco>
        <EncabezadoLeccion alSalir={salir} />
        <View style={styles.estado}>{contenido}</View>
      </Marco>
    );
  }

  if (cargando) return conEncabezado(<IndicadorCarga />);

  if (esNoDisponible(error)) {
    return conEncabezado(
      <EstadoVacio
        icono={CircleSlash}
        titulo={MENSAJES_LECCION.leccionNoDisponible}
        anunciar
        accion={
          <Boton
            titulo="Ver cursos"
            variante="secundario"
            alPresionar={() => router.dismissTo("/")}
          />
        }
      />,
    );
  }

  if (error || !datos) {
    return conEncabezado(<ErrorCarga mensaje={leerErrorDeCarga(error)} alReintentar={recargar} />);
  }

  const actividades = actividadesConocidas(datos.leccion.actividades);
  if (actividades.length === 0) {
    return conEncabezado(
      <EstadoVacio
        icono={NotebookPen}
        titulo="Esta lección todavía no tiene actividades."
        accion={<Boton titulo="Volver al curso" variante="secundario" alPresionar={salir} />}
      />,
    );
  }

  return (
    <CursarLeccion
      key={datos.leccion.id}
      idCurso={idCurso}
      idLeccion={idLeccion}
      leccion={datos.leccion}
      actividades={actividades}
      alSalir={salir}
    />
  );
}

function Marco({ children }: { children: ReactNode }) {
  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.pantalla} edges={["top"]}>
        {children}
      </SafeAreaView>
    </FondoAmbiental>
  );
}

type PropsCursarLeccion = {
  idCurso: string;
  idLeccion: string;
  leccion: DetalleLeccion;
  actividades: Actividad[];
  alSalir: () => void;
};

// La lección ya cargada: el reproductor, la pantalla final y la confirmación
// de salida. Va aparte porque sus hooks necesitan las actividades.
function CursarLeccion({ idCurso, idLeccion, leccion, actividades, alSalir }: PropsCursarLeccion) {
  const reproductor = useReproductor(actividades);
  const { hizoAlgo, terminada, aciertos, preguntas } = reproductor;
  const [saliendo, setSaliendo] = useState(false);

  // La X, el botón atrás de Android y el gesto de iOS pasan por aquí (research
  // de F03, punto 9). Cerrar la app no pide confirmación (spec F03). "Salir"
  // apaga el bloqueo y repite la acción con `repeat`: volver a despacharla con
  // navigation.dispatch la vuelve a bloquear.
  usePreventRemove(hizoAlgo && !terminada && !saliendo, ({ repeat }) => {
    Alert.alert("¿Salir de la lección?", "Perderás tu avance en esta lección.", [
      { text: "Seguir aquí", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: () => {
          setSaliendo(true);
          repeat();
        },
      },
    ]);
  });

  if (terminada) {
    return (
      <LeccionTerminada
        idCurso={idCurso}
        idLeccion={idLeccion}
        titulo={leccion.titulo}
        total={actividades.length}
        aciertos={aciertos}
        preguntas={preguntas}
        alSalir={alSalir}
      />
    );
  }

  return (
    <Marco>
      <ReproductorLeccion
        actividades={actividades}
        idioma={leccion.idioma}
        reproductor={reproductor}
        alSalir={alSalir}
      />
    </Marco>
  );
}

type PropsLeccionTerminada = {
  idCurso: string;
  idLeccion: string;
  titulo: string;
  total: number;
  aciertos: number;
  preguntas: number;
  alSalir: () => void;
};

// La pantalla final: guarda el resultado al aparecer (spec F04). Mientras
// guarda, "Volver al curso" y la X esperan. usePreventRemove ya no bloquea
// (terminada), así que el gesto de atrás sí sale: la petición sigue y el
// detalle la muestra al recargar (research de F04, punto 7).
function LeccionTerminada({
  idCurso,
  idLeccion,
  titulo,
  total,
  aciertos,
  preguntas,
  alSalir,
}: PropsLeccionTerminada) {
  const { estado, reintentar } = useGuardarProgreso(idCurso, idLeccion, { aciertos, preguntas });

  return (
    <Marco>
      <EncabezadoLeccion
        alSalir={alSalir}
        progreso={{ actual: total, total }}
        deshabilitada={estado === "guardando"}
      />
      <View style={styles.estado}>
        <ResultadoLeccion
          titulo={titulo}
          aciertos={aciertos}
          preguntas={preguntas}
          alVolver={alSalir}
          guardado={estado}
          alReintentar={reintentar}
        />
      </View>
    </Marco>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  estado: {
    flex: 1,
    paddingHorizontal: MARGEN_PANTALLA,
  },
});
