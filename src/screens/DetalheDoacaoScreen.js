import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import Tela from '../components/Tela';
import { excluirDoacao } from '../storage/doacoesStorage';
import { cores, larguraMaximaConteudo } from '../theme/cores';
import { formatarData, pluralizar } from '../utils/formatacao';

function LinhaDetalhe({ rotulo, valor }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

export default function DetalheDoacaoScreen({ navigation, route }) {
  const { doacao } = route.params;

  async function apagarDoacao() {
    try {
      await excluirDoacao(doacao.id);
      navigation.popTo('Historico');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível excluir a doação. Tente novamente.');
    }
  }

  function handleExcluir() {
    Alert.alert(
      'Excluir doação',
      `Deseja mesmo excluir a doação de ${doacao.quantidade}x ${doacao.tipoItem}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: apagarDoacao },
      ]
    );
  }

  function handleEditar() {
    navigation.navigate('CadastroDoacao', { doacao });
  }

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.card}>
          <LinhaDetalhe rotulo="Tipo do item" valor={doacao.tipoItem} />
          <LinhaDetalhe
            rotulo="Quantidade"
            valor={pluralizar(doacao.quantidade, 'unidade', 'unidades')}
          />
          <LinhaDetalhe rotulo="Ponto de destino" valor={doacao.pontoDestino} />
          <LinhaDetalhe rotulo="Registrada em" valor={formatarData(doacao.criadoEm)} />
        </View>

        <Botao titulo="Editar doação" onPress={handleEditar} estilo={styles.botao} />
        <Botao
          titulo="Excluir doação"
          variante="perigo"
          onPress={handleExcluir}
          estilo={styles.botao}
        />
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 16,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  linha: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundo,
  },
  rotulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 2,
  },
  valor: {
    fontSize: 18,
    color: cores.texto,
    fontWeight: 'bold',
  },
  botao: {
    marginBottom: 12,
  },
});
