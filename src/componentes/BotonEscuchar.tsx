import { Snail, Square, Volume2 } from "lucide-react-native";
import Boton from "./Boton";

type Props = {
  velocidad?: "normal" | "lenta";
  sonando?: boolean;
  // mientras llega el audio: un indicador en lugar del icono, sin poder pulsarse
  cargando?: boolean;
  deshabilitado?: boolean;
  alPulsar: () => void;
  // otro texto, que también es su nombre ("Escuchar mi grabación"), con Volume2
  etiqueta?: string;
  tamano?: "normal" | "chico";
};

// "Escuchar" y "Más lento" de escuchar y repetir (docs/diseno.md, sección 4; spec F14).
// Mientras suena, "Detener". Su nombre dice qué suena: "Escuchar la frase". Como la web.
export default function BotonEscuchar({
  velocidad = "normal",
  sonando = false,
  cargando = false,
  deshabilitado = false,
  alPulsar,
  etiqueta,
  tamano = "normal",
}: Props) {
  const lenta = velocidad === "lenta" && !etiqueta;
  const texto = etiqueta ?? (lenta ? "Más lento" : "Escuchar");
  const nombre = etiqueta ?? (lenta ? "Escuchar la frase más lento" : "Escuchar la frase");

  if (sonando) {
    return (
      <Boton
        titulo="Detener"
        variante="secundario"
        tamano={tamano}
        icono={Square}
        alPresionar={alPulsar}
      />
    );
  }
  return (
    <Boton
      titulo={texto}
      etiqueta={nombre}
      variante="secundario"
      tamano={tamano}
      icono={lenta ? Snail : Volume2}
      enviando={cargando}
      deshabilitado={deshabilitado}
      alPresionar={alPulsar}
    />
  );
}
