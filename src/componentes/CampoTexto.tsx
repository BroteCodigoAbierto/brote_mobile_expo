import { CircleAlert, type LucideIcon } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { espacio, radio, tipografia } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import Texto from "./Texto";

type Props = {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  error?: string;
  ayuda?: string;
  icono?: LucideIcon;
  // "correo" pone el teclado de correo y el autocompletado del sistema
  tipo?: "texto" | "correo";
  placeholder?: string;
  esPassword?: boolean;
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  // al pulsar la tecla de enviar del teclado
  alEnviar?: () => void;
  // algo dentro del recuadro, a la derecha (p. ej. "Mostrar" en la contraseña)
  accesorio?: ReactNode;
};

// Campo con su etiqueta y, debajo, su error o ayuda (docs/diseno.md,
// sección 4): con foco se marca el borde y aparece un halo.
export default function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  error,
  ayuda,
  icono: Icono,
  tipo = "texto",
  placeholder,
  esPassword = false,
  autoComplete,
  textContentType,
  autoCapitalize = "none",
  alEnviar,
  accesorio,
}: Props) {
  const c = useColores();
  const [conFoco, setConFoco] = useState(false);
  const esCorreo = tipo === "correo";
  const descripcion = error ?? ayuda;

  let borde = c.borde;
  let fondo = c.vidrioSuave;
  if (conFoco) {
    borde = c.primario;
    fondo = c.vidrioOpaco;
  }
  if (error) {
    borde = c.error;
    fondo = c.errorSuave;
  }

  return (
    <View style={styles.contenedor}>
      <Texto variante="etiqueta" color="textoSuave">
        {etiqueta}
      </Texto>
      <View
        style={[
          styles.control,
          { borderColor: borde, backgroundColor: fondo },
          conFoco && { boxShadow: `0px 0px 0px 3px ${error ? c.errorSuave : c.primarioSuave}` },
        ]}
      >
        {Icono && (
          <Icono
            size={19}
            color={error ? c.error : conFoco ? c.primario : c.textoTenue}
            strokeWidth={2}
          />
        )}
        <TextInput
          style={[styles.entrada, { color: c.texto }]}
          value={valor}
          onChangeText={alCambiar}
          onFocus={() => setConFoco(true)}
          onBlur={() => setConFoco(false)}
          placeholder={placeholder}
          placeholderTextColor={c.textoTenue}
          selectionColor={c.primario}
          secureTextEntry={esPassword} // oculta lo que se escribe
          keyboardType={esCorreo ? "email-address" : "default"}
          autoComplete={autoComplete ?? (esCorreo ? "email" : undefined)}
          textContentType={textContentType ?? (esCorreo ? "emailAddress" : undefined)}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          returnKeyType={alEnviar ? "go" : "next"}
          onSubmitEditing={alEnviar}
          underlineColorAndroid="transparent"
          accessibilityLabel={etiqueta}
          accessibilityHint={descripcion}
        />
        {accesorio}
      </View>
      {descripcion && (
        <View style={styles.descripcion}>
          {error && <CircleAlert size={15} color={c.error} strokeWidth={2.25} />}
          <Texto
            variante="nota"
            color={error ? "error" : "textoSuave"}
            style={styles.textoDescripcion}
            accessibilityLiveRegion={error ? "polite" : "none"}
          >
            {descripcion}
          </Texto>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: espacio[3],
  },
  control: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
    minHeight: 54,
    paddingLeft: espacio[6],
    paddingRight: espacio[2],
    borderWidth: 1,
    borderRadius: radio.medio,
    borderCurve: "continuous",
  },
  entrada: {
    flex: 1,
    minHeight: 44,
    paddingVertical: espacio[3],
    paddingRight: espacio[4],
    ...tipografia.cuerpo,
  },
  descripcion: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacio[2],
    paddingHorizontal: espacio[1],
  },
  textoDescripcion: {
    flex: 1,
  },
});
