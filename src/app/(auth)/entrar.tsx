import { Link } from "expo-router";
import { ArrowRight, Mail } from "lucide-react-native";
import { StyleSheet } from "react-native";
import Aviso from "../../componentes/Aviso";
import Boton from "../../componentes/Boton";
import CampoContrasena from "../../componentes/CampoContrasena";
import CampoTexto from "../../componentes/CampoTexto";
import FormularioCuenta from "../../componentes/FormularioCuenta";
import Texto from "../../componentes/Texto";
import { fuentes } from "../../constantes/tema";
import { useFormulario } from "../../hooks/useFormulario";
import { useSesion } from "../../hooks/useSesion";
import { MENSAJES_CUENTA } from "../../tipos/contrato";
import { validarEntrar } from "../../validacion/cuenta";

// Al entrar no se navega desde aquí: Stack.Protected cambia al inicio en cuanto
// la sesión existe (src/app/_layout.tsx).
export default function Entrar() {
  const { entrar, aviso } = useSesion();
  const { valores, errores, general, enviando, cambiar, manejarEnvio } = useFormulario({
    inicial: { correo: "", contrasena: "" },
    validar: validarEntrar,
    enviar: entrar,
  });

  let mensaje = null;
  if (general) mensaje = <Aviso texto={general} />;
  else if (aviso === "sesionTerminada") {
    mensaje = <Aviso tono="info" texto={MENSAJES_CUENTA.sesionTerminada} />;
  }

  return (
    <FormularioCuenta
      titulo="Entrar"
      subtitulo="Qué bueno verte de nuevo. Sigue donde te quedaste."
      mensaje={mensaje}
      pie={
        <Texto variante="cuerpoChico" color="textoSuave">
          ¿No tienes cuenta?{" "}
          <Link href="/registro">
            <Texto variante="cuerpoChico" color="primario" style={styles.enlace}>
              Crear cuenta
            </Texto>
          </Link>
        </Texto>
      }
    >
      <CampoTexto
        etiqueta="Correo"
        icono={Mail}
        tipo="correo"
        valor={valores.correo}
        alCambiar={(valor) => cambiar("correo", valor)}
        error={errores.correo}
      />
      <CampoContrasena
        etiqueta="Contraseña"
        autoComplete="current-password"
        valor={valores.contrasena}
        alCambiar={(valor) => cambiar("contrasena", valor)}
        error={errores.contrasena}
        alEnviar={manejarEnvio}
      />
      <Boton
        titulo="Entrar"
        iconoFinal={ArrowRight}
        alPresionar={manejarEnvio}
        enviando={enviando}
      />
    </FormularioCuenta>
  );
}

const styles = StyleSheet.create({
  enlace: {
    fontFamily: fuentes.seminegrita,
  },
});
