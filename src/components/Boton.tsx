import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const colores = {
  principal: '#327e2c',
  blanco: '#FFFFFF',
};

export function Boton({ titulo }: { titulo: string }) {
  return (
    <TouchableOpacity style={estilos.boton}>
      <Text style={estilos.botonTexto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
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
});