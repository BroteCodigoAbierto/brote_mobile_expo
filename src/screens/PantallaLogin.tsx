import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Logo } from '../components/Logo';
import { Boton } from '../components/Boton';

const colores = {
  principal: '#327e2c',
  fondo: '#F7F7FB',
  superficie: '#FFFFFF',
  texto: '#1E1E2E',
  textoMutado: '#6B7280',
  borde: '#E2E2EC',
};

export function PantallaLogin() {
  return (
    <KeyboardAvoidingView
      style={estilos.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={estilos.contenedorPrincipal}>
        <View style={estilos.tarjeta}>
          <Logo />
          <Text style={estilos.subtitulo}>Inicia sesión para crear o unirte a un quiz</Text>

          {/* Email */}
          <View style={estilos.campoCont}>
            <Text style={estilos.etiqueta}>Correo electrónico</Text>
            <TextInput
              style={estilos.entrada}
              placeholder="docente@escuela.com"
              placeholderTextColor={colores.textoMutado}
              editable={false}
            />
          </View>

          {/* Contraseña */}
          <View style={estilos.campoCont}>
            <Text style={estilos.etiqueta}>Contraseña</Text>
            <TextInput
              style={estilos.entrada}
              placeholder="••••••••"
              placeholderTextColor={colores.textoMutado}
              editable={false}
            />
          </View>

          <TouchableOpacity style={estilos.olvidePaswd}>
            <Text style={estilos.olvidePaswdTexto}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <Boton titulo="Iniciar sesión" />

          {/* Registrar */}
          <View style={estilos.registroFila}>
            <Text style={estilos.registroTexto}>¿No tienes cuenta?</Text>
            <TouchableOpacity>
              <Text style={estilos.registroEnlace}> Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenedorPrincipal: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  subtitulo: {
    textAlign: 'center',
    color: colores.textoMutado,
    fontSize: 14,
    marginBottom: 24,
  },
  campoCont: {
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoMutado,
    marginBottom: 6,
  },
  entrada: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colores.texto,
    backgroundColor: colores.superficie,
  },
  olvidePaswd: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  olvidePaswdTexto: {
    color: colores.principal,
    fontSize: 13,
    fontWeight: '600',
  },
  registroFila: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registroTexto: {
    color: colores.textoMutado,
    fontSize: 14,
  },
  registroEnlace: {
    color: colores.principal,
    fontSize: 14,
    fontWeight: '700',
  },
});
