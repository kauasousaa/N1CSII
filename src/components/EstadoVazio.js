import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/cores';
import Botao from './Botao';

export default function EstadoVazio({ mensagem, tituloBotao, onPressBotao }) {
  return (
    <View style={styles.container}>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {tituloBotao ? <Botao titulo={tituloBotao} onPress={onPressBotao} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'stretch',
  },
  mensagem: {
    fontSize: 16,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginBottom: 16,
  },
});
