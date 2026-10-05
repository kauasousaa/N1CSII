import { StyleSheet, Text, TextInput, View } from 'react-native';
import { cores } from '../theme/cores';

export default function CampoTexto({ rotulo, erro, ...propsInput }) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, erro && styles.inputComErro]}
        placeholderTextColor={cores.textoSecundario}
        {...propsInput}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: cores.texto,
    backgroundColor: cores.branco,
  },
  inputComErro: {
    borderColor: cores.erro,
  },
  erro: {
    color: cores.erro,
    marginTop: 4,
    fontSize: 14,
  },
});
