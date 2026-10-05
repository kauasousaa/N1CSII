import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores } from '../theme/cores';

export default function Botao({ titulo, onPress, variante = 'primario', estilo }) {
  const estiloVariante = estilosVariante[variante] ?? estilosVariante.primario;

  return (
    <TouchableOpacity
      style={[styles.botao, estiloVariante.botao, estilo]}
      onPress={onPress}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <Text style={[styles.texto, estiloVariante.texto]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const estilosVariante = {
  primario: {
    botao: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    texto: { color: cores.branco },
  },
  secundario: {
    botao: { backgroundColor: cores.branco, borderColor: cores.primaria },
    texto: { color: cores.primaria },
  },
  perigo: {
    botao: { backgroundColor: cores.erro, borderColor: cores.erro },
    texto: { color: cores.branco },
  },
};
