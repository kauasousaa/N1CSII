import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import DoacaoItem from '../components/DoacaoItem';
import EstadoVazio from '../components/EstadoVazio';
import Tela from '../components/Tela';
import { useDoacoes } from '../hooks/useDoacoes';
import { cores, larguraMaximaConteudo } from '../theme/cores';

export default function HistoricoScreen({ navigation }) {
  const { doacoes, carregando, erro } = useDoacoes();

  const abrirDetalhe = useCallback(
    (doacao) => navigation.navigate('DetalheDoacao', { doacao }),
    [navigation]
  );

  const renderizarDoacao = useCallback(
    ({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />,
    [abrirDetalhe]
  );

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <Tela>
      <FlatList
        data={doacoes}
        keyExtractor={(doacao) => doacao.id}
        renderItem={renderizarDoacao}
        ListEmptyComponent={
          <EstadoVazio
            mensagem="Você ainda não registrou nenhuma doação."
            tituloBotao="Registrar minha primeira doação"
            onPressBotao={() => navigation.navigate('CadastroDoacao')}
          />
        }
        contentContainerStyle={styles.conteudoLista}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
    padding: 16,
  },
  erro: {
    fontSize: 16,
    color: cores.erro,
    textAlign: 'center',
  },
  conteudoLista: {
    padding: 16,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
});
