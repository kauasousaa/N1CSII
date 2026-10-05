import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import CampoBusca from '../components/CampoBusca';
import DoacaoItem from '../components/DoacaoItem';
import EstadoVazio from '../components/EstadoVazio';
import TelaComTeclado from '../components/TelaComTeclado';
import { useDoacoes } from '../hooks/useDoacoes';
import { cores, larguraMaximaConteudo } from '../theme/cores';
import { filtrarPorTipo } from '../utils/filtroDoacoes';

export default function HistoricoScreen({ navigation }) {
  const { doacoes, carregando, erro } = useDoacoes();
  const [textoBusca, setTextoBusca] = useState('');

  const doacoesFiltradas = useMemo(
    () => filtrarPorTipo(doacoes, textoBusca),
    [doacoes, textoBusca]
  );

  const abrirDetalhe = useCallback(
    (doacao) => navigation.navigate('DetalheDoacao', { doacao }),
    [navigation]
  );

  const renderizarDoacao = useCallback(
    ({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />,
    [abrirDetalhe]
  );

  function renderizarListaVazia() {
    if (doacoes.length === 0) {
      return (
        <EstadoVazio
          mensagem="Você ainda não registrou nenhuma doação."
          tituloBotao="Registrar minha primeira doação"
          onPressBotao={() => navigation.navigate('CadastroDoacao')}
        />
      );
    }

    return <EstadoVazio mensagem={`Nenhuma doação encontrada para "${textoBusca.trim()}".`} />;
  }

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
    <TelaComTeclado>
      {doacoes.length > 0 ? (
        <View style={styles.areaBusca}>
          <CampoBusca
            valor={textoBusca}
            onChangeTexto={setTextoBusca}
            placeholder="Buscar por tipo de item"
          />
        </View>
      ) : null}

      <FlatList
        data={doacoesFiltradas}
        keyExtractor={(doacao) => doacao.id}
        renderItem={renderizarDoacao}
        ListEmptyComponent={renderizarListaVazia()}
        contentContainerStyle={styles.conteudoLista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </TelaComTeclado>
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
  areaBusca: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
  conteudoLista: {
    padding: 16,
    paddingTop: 8,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
});
