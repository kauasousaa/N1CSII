import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import Botao from '../components/Botao';
import CampoBusca from '../components/CampoBusca';
import EstadoVazio from '../components/EstadoVazio';
import PontoItem from '../components/PontoItem';
import Tela from '../components/Tela';
import useListaPaginada from '../hooks/useListaPaginada';
import { pontoSalvo } from '../navigation/itemSalvo';
import { buscarPagina } from '../services/pontosService';
import { alternarFavorito, listarIdsFavoritos } from '../storage/favoritosStorage';
import { cores, larguraMaximaConteudo } from '../theme/cores';

const MENSAGEM_API_DESLIGADA =
  'Não foi possível carregar os pontos. Confira se a API está ligada e se o celular está na mesma rede do computador.';

function comPontoSalvo(lista, filtro) {
  const ponto = pontoSalvo.ler();
  if (!ponto?.id) {
    return lista;
  }
  const restantes = lista.filter((item) => item.id !== ponto.id);
  const termo = filtro.trim().toLowerCase();
  const aparece = termo.length === 0
    || ponto.nome.toLowerCase().includes(termo)
    || ponto.bairro.toLowerCase().includes(termo);
  if (!aparece) {
    return restantes;
  }
  return [...restantes, ponto].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export default function PontosScreen({ navigation }) {
  const [filtro, setFiltro] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const { itens: pontos, carregandoInicial, carregandoMais, erro, carregarMais, tentarDeNovo } =
    useListaPaginada({
      buscarPagina,
      filtro,
      ajustarPrimeiraPagina: comPontoSalvo,
      mensagemErro: MENSAGEM_API_DESLIGADA,
    });

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarIdsFavoritos().then((ids) => {
        if (ativo) {
          setFavoritos(ids);
        }
      });
      return () => {
        ativo = false;
      };
    }, [])
  );

  const alternar = useCallback(async (id) => {
    setFavoritos(await alternarFavorito(id));
  }, []);

  const abrirDetalhe = useCallback(
    (id) => navigation.navigate('DetalhePonto', { id }),
    [navigation]
  );

  const renderizarPonto = useCallback(
    ({ item }) => (
      <PontoItem
        ponto={item}
        favorito={favoritos.includes(item.id)}
        onPress={abrirDetalhe}
        onAlternarFavorito={alternar}
      />
    ),
    [abrirDetalhe, alternar, favoritos]
  );

  return (
    <Tela>
      <View style={styles.busca}>
        <CampoBusca
          valor={filtro}
          onChangeTexto={setFiltro}
          placeholder="Buscar por nome ou bairro"
        />
        <Botao
          titulo="Cadastrar ponto"
          onPress={() => navigation.navigate('CadastroPonto')}
          estilo={styles.cadastrar}
        />
      </View>
      {carregandoInicial ? (
        <ActivityIndicator size="large" color={cores.primaria} style={styles.carregando} />
      ) : (
        <FlatList
          contentContainerStyle={styles.conteudo}
          data={pontos}
          keyExtractor={(ponto) => ponto.id}
          renderItem={renderizarPonto}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            carregandoMais ? (
              <ActivityIndicator color={cores.primaria} style={styles.rodape} />
            ) : null
          }
          ListEmptyComponent={
            <EstadoVazio
              mensagem={erro || 'Nenhum ponto encontrado.'}
              tituloBotao={erro ? 'Tentar de novo' : undefined}
              onPressBotao={erro ? tentarDeNovo : undefined}
            />
          }
        />
      )}
    </Tela>
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
  cadastrar: {
    marginTop: 12,
  },
  conteudo: {
    padding: 16,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
  carregando: {
    marginTop: 32,
  },
  rodape: {
    marginVertical: 16,
  },
});
