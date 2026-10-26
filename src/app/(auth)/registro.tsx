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
import { validarCrearCuenta } from "../../validacion/cuenta";

// Al crear la cuenta la sesión queda iniciada y Stack.Protected lleva al inicio.
export default function Registro() {
  const c = useColores();
  const { crearCuenta } = useSesion();
  const { valores, errores, general, enviando, cambiar, manejarEnvio } = useFormulario({
    inicial: { nombre: "", correo: "", contrasena: "" },
    validar: validarCrearCuenta,
    enviar: crearCuenta,
  });

  return (
    <FormularioCuenta
      titulo="Crear cuenta"
      mensaje={general && <MensajeFormulario texto={general} />}
      // dismissTo: vuelve a "Entrar" sin apilar otra pantalla
      pie={
        <Text style={[styles.pie, { color: c.textoSuave }]}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/entrar" dismissTo style={[styles.enlace, { color: c.primario }]}>
            Entrar
          </Link>
        </Text>
      }
    >
      <CampoTexto
        etiqueta="Nombre para mostrar"
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
        valor={valores.nombre}
        alCambiar={(valor) => cambiar("nombre", valor)}
        error={errores.nombre}
      />
      <CampoTexto
        etiqueta="Correo"
        tipo="correo"
        valor={valores.correo}
        alCambiar={(valor) => cambiar("correo", valor)}
        error={errores.correo}
      />
      <CampoContrasena
        etiqueta="Contraseña"
        autoComplete="new-password"
        valor={valores.contrasena}
        alCambiar={(valor) => cambiar("contrasena", valor)}
        error={errores.contrasena}
        alEnviar={manejarEnvio}
      />
      <Boton titulo="Crear cuenta" alPresionar={manejarEnvio} enviando={enviando} />
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
