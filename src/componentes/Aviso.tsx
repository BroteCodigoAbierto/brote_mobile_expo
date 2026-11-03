import { CircleAlert, CircleCheck, Info, Sparkles, type LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { espacio, fuentes, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import Texto from "./Texto";

type Tono = "info" | "exito" | "error" | "calido";

type Props = {
  texto: string;
  tono?: Tono;
};

const ICONOS: Record<Tono, LucideIcon> = {
  info: Info,
  exito: CircleCheck,
  error: CircleAlert,
  calido: Sparkles,
};

// Mensaje general de un formulario o de una pantalla: un error que no es de
// un campo ("Correo o contraseña incorrectos.") o un aviso ("Tu sesión
// terminó..."). Se anuncia en cuanto aparece.
export default function Aviso({ texto, tono = "error" }: Props) {
  const c = useColores();
  const Icono = ICONOS[tono];
  const aspecto = {
    info: { fondo: c.primarioSuave, icono: c.primario, texto: c.texto },
    exito: { fondo: c.broteSuave, icono: c.broteFuerte, texto: c.texto },
    error: { fondo: c.errorSuave, icono: c.error, texto: c.error },
    calido: { fondo: c.acentoSuave, icono: c.acento, texto: c.texto },
  }[tono];

  return (
    <View
      style={[styles.aviso, { backgroundColor: aspecto.fondo }]}
      accessibilityRole={tono === "error" ? "alert" : "text"}
      accessibilityLiveRegion="polite"
    >
      <Icono size={20} color={aspecto.icono} strokeWidth={2.25} />
      <Texto variante="cuerpoChico" style={[styles.texto, { color: aspecto.texto }]}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  aviso: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacio[4],
    paddingVertical: espacio[4],
    paddingHorizontal: espacio[5],
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  texto: {
    flex: 1,
    fontFamily: fuentes.medio,
  },
});
