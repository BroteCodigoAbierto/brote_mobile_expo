import { useMemo, type ComponentType } from "react";
import { StyleSheet, View } from "react-native";
import { ContextoImagenes } from "../contextos/ContextoImagenes";
import { usePrecargarImagenes } from "../hooks/usePrecargarImagenes";
import type { Reproductor } from "../hooks/useReproductor";
import type { Actividad } from "../tipos/contrato";
import EncabezadoLeccion from "./EncabezadoLeccion";
import { registroActividades } from "./registro";
import type { ResultadoActividad } from "./tipos";

type Props = {
  // ya sin los tipos que esta app no conoce
  actividades: Actividad[];
  reproductor: Reproductor;
  alSalir: () => void;
};

// Lo que el reproductor sabe de cualquier actividad: su componente recibe la
// actividad y avisa al terminar.
type ComponenteActividad = ComponentType<{
  actividad: Actividad;
  alInteractuar: () => void;
  alTerminar: (resultado: ResultadoActividad) => void;
}>;

// Reproductor de lecciones (spec F03; docs/diseno.md, sección 6). No sabe nada
// de ningún tipo: busca el componente de la actividad actual en el registro.
// Cada actividad dibuja su contenido desplazable y su barra fija abajo. Al abrir, precarga
// las imágenes de toda la lección; las que no cargaron se vuelven a pedir al volver la
// conexión (F13).
export default function ReproductorLeccion({ actividades, reproductor, alSalir }: Props) {
  const { indice, total, interactuar, terminarActividad } = reproductor;
  const intento = usePrecargarImagenes(actividades);
  const imagenes = useMemo(() => ({ intento }), [intento]);
  const actividad = actividades[indice];
  if (!actividad) return null;
  // TypeScript no relaciona el tipo de la actividad con el de su componente
  const Componente = registroActividades[actividad.tipo] as ComponenteActividad;

  return (
    <View style={styles.reproductor}>
      <EncabezadoLeccion alSalir={alSalir} progreso={{ actual: indice, total }} />
      <ContextoImagenes.Provider value={imagenes}>
        {/* key: cada actividad empieza sin el estado de la anterior */}
        <Componente
          key={indice}
          actividad={actividad}
          alInteractuar={interactuar}
          alTerminar={terminarActividad}
        />
      </ContextoImagenes.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  reproductor: {
    flex: 1,
  },
});
