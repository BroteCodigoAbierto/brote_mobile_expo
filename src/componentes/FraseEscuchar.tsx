import { StyleSheet } from "react-native";
import { ETIQUETA_VOZ, type IdiomaCurso } from "../tipos/contrato";
import Texto from "./Texto";

type Props = {
  frase: string;
  idioma: IdiomaCurso;
  // hasta comprobar: la frase no se dibuja, tampoco para un lector de pantalla
  oculta: boolean;
};

// La frase de escuchar y repetir (docs/diseno.md, sección 4; spec F14). Marcada con el idioma
// del curso, para que VoiceOver la lea con su voz de ese idioma. Siempre como texto: lo
// escribió el autor. Como la web.
export default function FraseEscuchar({ frase, idioma, oculta }: Props) {
  if (oculta) {
    return (
      <Texto color="textoSuave" style={styles.centrada}>
        El texto aparece al comprobar.
      </Texto>
    );
  }
  return (
    <Texto variante="titulo2" style={styles.centrada} accessibilityLanguage={ETIQUETA_VOZ[idioma]}>
      {frase}
    </Texto>
  );
}

const styles = StyleSheet.create({
  centrada: {
    textAlign: "center",
  },
});
