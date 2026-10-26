import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import Boton from "../../componentes/Boton";
import CampoContrasena from "../../componentes/CampoContrasena";
import CampoTexto from "../../componentes/CampoTexto";
import FormularioCuenta from "../../componentes/FormularioCuenta";
import MensajeFormulario from "../../componentes/MensajeFormulario";
import { useColores } from "../../hooks/useColores";
import { useFormulario } from "../../hooks/useFormulario";
import { useSesion } from "../../hooks/useSesion";
import { MENSAJES_CUENTA } from "../../tipos/contrato";
import { validarEntrar } from "../../validacion/cuenta";

// Al entrar no se navega desde aquí: Stack.Protected cambia al inicio en cuanto
// la sesión existe (src/app/_layout.tsx).
export default function Entrar() {
  const c = useColores();
  const { entrar, aviso } = useSesion();
  const { valores, errores, general, enviando, cambiar, manejarEnvio } = useFormulario({
    inicial: { correo: "", contrasena: "" },
    validar: validarEntrar,
    enviar: entrar,
  });

  let mensaje = null;
  if (general) mensaje = <MensajeFormulario texto={general} />;
  else if (aviso === "sesionTerminada") {
    mensaje = <MensajeFormulario variante="aviso" texto={MENSAJES_CUENTA.sesionTerminada} />;
  }

  return (
    <FormularioCuenta
      titulo="Entrar"
      mensaje={mensaje}
      pie={
        <Text style={[styles.pie, { color: c.textoSuave }]}>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" style={[styles.enlace, { color: c.primario }]}>
            Crear cuenta
          </Link>
        </Text>
      }
    >
      <CampoTexto
        etiqueta="Correo"
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
      <Boton titulo="Entrar" alPresionar={manejarEnvio} enviando={enviando} />
    </FormularioCuenta>
  );
}

const styles = StyleSheet.create({
  pie: {
    fontSize: 15,
  },
  enlace: {
    fontWeight: "600",
  },
});
