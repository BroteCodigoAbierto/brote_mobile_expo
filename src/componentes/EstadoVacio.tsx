import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { espacio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import Superficie from "./Superficie";
import Texto from "./Texto";

type Props = {
  icono: LucideIcon;
  titulo: string;
  texto?: string;
  // botón para salir del estado
  accion?: ReactNode;
  tono?: "neutro" | "error";
  // el título se anuncia en cuanto aparece (errores)
  anunciar?: boolean;
};

// Lo que se ve cuando no hay datos que mostrar: vacío, sin resultados o error
// (docs/diseno.md, sección 5).
export default function EstadoVacio({
  icono: Icono,
  titulo,
  texto,
  accion,
  tono = "neutro",
  anunciar = false,
}: Props) {
  const c = useColores();

  return (
    <View style={styles.estado}>
      <Superficie style={styles.circulo}>
        <Icono size={30} color={tono === "error" ? c.error : c.primario} strokeWidth={1.75} />
      </Superficie>
      <View style={styles.textos}>
        <Texto
          variante="titulo3"
          style={styles.centrado}
          accessibilityRole={anunciar ? "alert" : "text"}
          accessibilityLiveRegion={anunciar ? "polite" : "none"}
        >
          {titulo}
        </Texto>
        {texto && (
          <Texto variante="cuerpoChico" color="textoSuave" style={styles.centrado}>
            {texto}
          </Texto>
        )}
      </View>
      {accion}
    </View>
  );
}

const styles = StyleSheet.create({
  estado: {
    alignItems: "center",
    gap: espacio[6],
    paddingVertical: espacio[9],
    paddingHorizontal: espacio[5],
  },
  circulo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  textos: {
    gap: espacio[3],
    maxWidth: 420,
  },
  centrado: {
    textAlign: "center",
  },
});
