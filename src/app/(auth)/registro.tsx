import { Link } from "expo-router";
import { Mail, Sparkles, UserRound } from "lucide-react-native";
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
import { validarCrearCuenta } from "../../validacion/cuenta";

// Al crear la cuenta la sesión queda iniciada y Stack.Protected lleva al inicio.
export default function Registro() {
  const { crearCuenta } = useSesion();
  const { valores, errores, general, enviando, cambiar, manejarEnvio } = useFormulario({
    inicial: { nombre: "", correo: "", contrasena: "", confirmacion: "" },
    validar: validarCrearCuenta,
    enviar: ({ nombre, correo, contrasena }) => crearCuenta({ nombre, correo, contrasena }),
  });

  return (
    <FormularioCuenta
      titulo="Crear cuenta"
      subtitulo="Una sola cuenta para aprender y para crear tus propios cursos."
      mensaje={general && <Aviso texto={general} />}
      // dismissTo: vuelve a "Entrar" sin apilar otra pantalla
      pie={
        <Texto variante="cuerpoChico" color="textoSuave">
          ¿Ya tienes cuenta?{" "}
          <Link href="/entrar" dismissTo>
            <Texto variante="cuerpoChico" color="primario" style={styles.enlace}>
              Entrar
            </Texto>
          </Link>
        </Texto>
      }
    >
      <CampoTexto
        etiqueta="Nombre para mostrar"
        icono={UserRound}
        ayuda="Así te verán como autor de tus cursos."
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
        valor={valores.nombre}
        alCambiar={(valor) => cambiar("nombre", valor)}
        error={errores.nombre}
      />
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
        autoComplete="new-password"
        valor={valores.contrasena}
        alCambiar={(valor) => cambiar("contrasena", valor)}
        error={errores.contrasena}
      />
      <CampoContrasena
        etiqueta="Repite la contraseña"
        autoComplete="new-password"
        valor={valores.confirmacion}
        alCambiar={(valor) => cambiar("confirmacion", valor)}
        error={errores.confirmacion}
        alEnviar={manejarEnvio}
      />
      <Boton
        titulo="Crear cuenta"
        icono={Sparkles}
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
