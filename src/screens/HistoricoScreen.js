import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import CampoBusca from '../components/CampoBusca';
import DoacaoItem from '../components/DoacaoItem';
import EstadoVazio from '../components/EstadoVazio';
import TelaComTeclado from '../components/TelaComTeclado';
import useListaPaginada from '../hooks/useListaPaginada';
import { doacaoSalva } from '../navigation/itemSalvo';
import { listarPagina } from '../services/doacoesService';
import { cores, larguraMaximaConteudo } from '../theme/cores';

const MENSAGEM_CARREGANDO = 'Carregando doações...';
const MENSAGEM_API_DESLIGADA =
  'Não foi possível carregar as doações. Confira se a API está ligada e se o celular está na mesma rede do computador.';
const MENSAGEM_VAZIA = 'Você ainda não registrou nenhuma doação.';

function comDoacaoSalva(lista, filtro) {
  const doacao = doacaoSalva.ler();
  if (!doacao?.id) {
    return lista;
  }
  const termo = filtro.trim().toLowerCase();
  const aparece = termo.length === 0 || doacao.tipoItem.toLowerCase().includes(termo);
  if (!aparece) {
    return lista.filter((item) => item.id !== doacao.id);
  }
  const indice = lista.findIndex((item) => item.id === doacao.id);
  if (indice >= 0) {
    const copia = [...lista];
    copia[indice] = doacao;
    return copia;
  }
  return [doacao, ...lista];
}

export default function HistoricoScreen({ navigation }) {
  const [filtro, setFiltro] = useState('');
  const { itens: doacoes, carregandoInicial, carregandoMais, erro, carregarMais, tentarDeNovo } =
    useListaPaginada({
      buscarPagina: listarPagina,
      filtro,
      ajustarPrimeiraPagina: comDoacaoSalva,
      mensagemErro: MENSAGEM_API_DESLIGADA,
    });

  const abrirDetalhe = useCallback(
    (id) => navigation.navigate('DetalheDoacao', { id }),
    [navigation]
  );

  const renderizarDoacao = useCallback(
    ({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />,
    [abrirDetalhe]
  );

  const termo = filtro.trim();
  let estadoVazio;
  if (erro) {
    estadoVazio = { mensagem: erro, tituloBotao: 'Tentar de novo', onPressBotao: tentarDeNovo };
  } else if (termo) {
    estadoVazio = { mensagem: `Nenhuma doação encontrada para "${termo}".` };
  } else {
    estadoVazio = {
      mensagem: MENSAGEM_VAZIA,
      tituloBotao: 'Registrar doação',
      onPressBotao: () => navigation.navigate('CadastroDoacao'),
    };
  }

  return (
    <TelaComTeclado>
      <View style={styles.busca}>
        <CampoBusca
          valor={filtro}
          onChangeTexto={setFiltro}
          placeholder="Buscar por tipo de item"
        />
      </View>
      {carregandoInicial ? (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={styles.mensagemCarregando}>{MENSAGEM_CARREGANDO}</Text>
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(doacao) => doacao.id}
          renderItem={renderizarDoacao}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListFooterComponent={
            carregandoMais ? (
              <ActivityIndicator color={cores.primaria} style={styles.rodape} />
            ) : null
          }
          ListEmptyComponent={<EstadoVazio {...estadoVazio} />}
        />
      )}
    </TelaComTeclado>
  );
}

const styles = StyleSheet.create({
  busca: {
    paddingHorizontal: 16,
    paddingTop: 16,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
  conteudo: {
    padding: 16,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
  carregando: {
    marginTop: 32,
    alignItems: 'center',
  },
  mensagemCarregando: {
    marginTop: 12,
    fontSize: 16,
    color: cores.textoSecundario,
  },
  rodape: {
    marginVertical: 16,
  },
});
