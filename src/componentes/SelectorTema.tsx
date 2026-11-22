import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { AREA_TACTIL, espacio, radio } from "../constantes/tema";
import { modos, temas } from "../constantes/temas";
import { useColores } from "../hooks/useColores";
import { useTema } from "../hooks/useTema";
import Superficie from "./Superficie";
import Texto from "./Texto";

export default function SelectorTema() {
  const c = useColores();
  const { preferencia, cambiar, estado } = useTema();
  const guardando = estado === "guardando";
  return (
    <Superficie style={styles.seccion}>
      <Texto variante="titulo2" accessibilityRole="header">
        Temas
      </Texto>
      <Texto variante="cuerpoChico" color="textoSuave">
        Elige los colores de Brote. Tu elección se guarda en este dispositivo.
      </Texto>
      <Texto variante="etiqueta">Paleta de colores</Texto>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Paleta de colores"
        style={styles.grupo}
      >
        {temas.map((tema) => {
          const elegido = preferencia.tema === tema.id;
          return (
            <Pressable
              key={tema.id}
              accessibilityRole="radio"
              accessibilityLabel={`${tema.nombre}. ${tema.descripcion}`}
              accessibilityState={{ checked: elegido, disabled: guardando }}
              disabled={guardando}
              onPress={() => cambiar({ ...preferencia, tema: tema.id })}
              style={({ pressed }) => [
                styles.opcion,
                {
                  borderColor: elegido ? c.primario : c.bordeFuerte,
                  backgroundColor: elegido ? c.primarioSuave : c.vidrioSuave,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={styles.textos}>
                <Texto variante="titulo3">{tema.nombre}</Texto>
                <Texto variante="cuerpoChico" color="textoSuave">
                  {tema.descripcion}
                </Texto>
              </View>
              {elegido && <Check color={c.primario} size={20} />}
            </Pressable>
          );
        })}
      </View>
      <Texto variante="etiqueta">Modo</Texto>
      <View accessibilityRole="radiogroup" accessibilityLabel="Modo" style={styles.grupo}>
        {modos.map((modo) => {
          const elegido = preferencia.modo === modo.id;
          return (
            <Pressable
              key={modo.id}
              accessibilityRole="radio"
              accessibilityLabel={modo.nombre}
              accessibilityState={{ checked: elegido, disabled: guardando }}
              disabled={guardando}
              onPress={() => cambiar({ ...preferencia, modo: modo.id })}
              style={({ pressed }) => [
                styles.opcion,
                {
                  borderColor: elegido ? c.primario : c.bordeFuerte,
                  backgroundColor: elegido ? c.primarioSuave : c.vidrioSuave,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Texto style={styles.textos}>{modo.nombre}</Texto>
              {elegido && <Check color={c.primario} size={20} />}
            </Pressable>
          );
        })}
      </View>
      <Texto variante="nota" color="textoSuave" accessibilityLiveRegion="polite">
        {estado === "error"
          ? "El tema se aplicó, pero no se pudo guardar. Solo durará esta sesión."
          : guardando
            ? "Guardando preferencia…"
            : estado === "guardado"
              ? "Preferencia guardada."
              : "Puedes cambiar el tema cuando quieras."}
      </Texto>
    </Superficie>
  );
}

const styles = StyleSheet.create({
  seccion: { padding: espacio[6], gap: espacio[5] },
  grupo: { gap: espacio[3] },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[4],
    minHeight: AREA_TACTIL,
    padding: espacio[4],
    borderWidth: 1,
    borderRadius: radio.medio,
  },
  textos: { flex: 1 },
});
