import { StyleSheet, Text, View } from 'react-native';

const colores = {
  principal: '#327e2c',
  texto: '#1E1E2E',
  blanco: '#FFFFFF',
};

export function Logo() {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.insignia}>
        <Text style={estilos.insigniaTexto}>B</Text>
      </View>
      <Text style={estilos.titulo}>Brote</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
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
});