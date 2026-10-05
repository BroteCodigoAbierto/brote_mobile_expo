import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const colores = {
  principal: '#327e2c',
  secundario: '#00B894',
  fondo: '#F7F7FB',
  superficie: '#FFFFFF',
  texto: '#1E1E2E',
  textoMutado: '#6B7280',
  borde: '#E2E2EC',
  error: '#E74C3C',
  blanco: '#FFFFFF',
};

export default function App() {
  return (
    <SafeAreaView style={estilos.contenedor}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={estilos.contenedorPrincipal}>
          <View style={estilos.tarjeta}>
            {/* Logo */}
            <View style={estilos.logoCont}>
              <View style={estilos.insignia}>
                <Text style={estilos.insigniaTexto}>B</Text>
              </View>
              <Text style={estilos.titulo}>Brote</Text>
            </View>

            <Text style={estilos.subtitulo}>Inicia sesión para crear o unirte a un quiz</Text>

            {/* Email */}
            <View style={estilos.inputCont}>
              <Text style={estilos.etiqueta}>Correo electrónico</Text>
              <TextInput
                style={estilos.entrada}
                placeholder="docente@escuela.com"
                placeholderTextColor={colores.textoMutado}
                editable={false}
              />
            </View>

            {/* Contraseña */}
            <View style={estilos.inputCont}>
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

            {/* Botón */}
            <TouchableOpacity style={estilos.boton}>
              <Text style={estilos.botonTexto}>Iniciar sesión</Text>
            </TouchableOpacity>

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
      <StatusBar style="auto" />
    </SafeAreaView>
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
  logoCont: {
    alignItems: 'center',
    marginBottom: 24,
  },
  insignia: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colores.principal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  insigniaTexto: {
    color: colores.blanco,
    fontSize: 26,
    fontWeight: '700',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colores.texto,
  },
  subtitulo: {
    textAlign: 'center',
    color: colores.textoMutado,
    fontSize: 14,
    marginBottom: 24,
  },
  inputCont: {
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
  boton: {
    backgroundColor: colores.principal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: {
    color: colores.blanco,
    fontSize: 16,
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
