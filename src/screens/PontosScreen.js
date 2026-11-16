import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import CampoBusca from '../components/CampoBusca';
import EstadoVazio from '../components/EstadoVazio';
import PontoItem from '../components/PontoItem';
import Tela from '../components/Tela';
import { buscarPagina } from '../services/pontosService';
import { cores, larguraMaximaConteudo } from '../theme/cores';

const TAMANHO_PAGINA = 10;
const MENSAGEM_API_DESLIGADA =
  'Não foi possível carregar os pontos. Confira se a API está ligada e se o celular está na mesma rede do computador.';

function chegouNaUltima(pagina) {
  return pagina.number + 1 >= pagina.totalPages;
}

export default function PontosScreen({ navigation }) {
  const [filtro, setFiltro] = useState('');
  const [pontos, setPontos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [chegouAoFim, setChegouAoFim] = useState(false);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const versaoBusca = useRef(0);
  const paginaEmAndamento = useRef(null);

  useEffect(() => {
    const versao = ++versaoBusca.current;
    paginaEmAndamento.current = null;
    setCarregandoInicial(true);
    setErro('');

    const esperar = filtro.trim() ? 400 : 0;
    const timer = setTimeout(() => {
      buscarPagina(filtro, 0, TAMANHO_PAGINA)
        .then((resposta) => {
          if (versao !== versaoBusca.current) {
            return;
          }
          setPontos(resposta.content);
          setPagina(0);
          setChegouAoFim(chegouNaUltima(resposta.page));
        })
        .catch(() => {
          if (versao !== versaoBusca.current) {
            return;
          }
          setPontos([]);
          setChegouAoFim(true);
          setErro(MENSAGEM_API_DESLIGADA);
        })
        .finally(() => {
          if (versao === versaoBusca.current) {
            setCarregandoInicial(false);
          }
        });
    }, esperar);

    return () => clearTimeout(timer);
  }, [filtro, tentativa]);

  const carregarMais = useCallback(() => {
    if (carregandoInicial || carregandoMais || chegouAoFim || erro) {
      return;
    }
    const proxima = pagina + 1;
    if (paginaEmAndamento.current === proxima) {
      return;
    }
    const versao = versaoBusca.current;
    paginaEmAndamento.current = proxima;
    setCarregandoMais(true);

    buscarPagina(filtro, proxima, TAMANHO_PAGINA)
      .then((resposta) => {
        if (versao !== versaoBusca.current) {
          return;
        }
        setPontos((atuais) => {
          const ids = new Set(atuais.map((ponto) => ponto.id));
          const novos = resposta.content.filter((ponto) => !ids.has(ponto.id));
          return [...atuais, ...novos];
        });
        setPagina(proxima);
        setChegouAoFim(chegouNaUltima(resposta.page));
      })
      .catch(() => {
        if (versao !== versaoBusca.current) {
          return;
        }
        paginaEmAndamento.current = null;
      })
      .finally(() => {
        if (versao === versaoBusca.current) {
          setCarregandoMais(false);
        }
      });
  }, [carregandoInicial, carregandoMais, chegouAoFim, erro, filtro, pagina]);

  const abrirDetalhe = useCallback(
    (id) => navigation.navigate('DetalhePonto', { id }),
    [navigation]
  );

  const renderizarPonto = useCallback(
    ({ item }) => <PontoItem ponto={item} onPress={abrirDetalhe} />,
    [abrirDetalhe]
  );

  return (
    <Tela>
      <View style={styles.busca}>
        <CampoBusca
          valor={filtro}
          onChangeTexto={setFiltro}
          placeholder="Buscar por nome ou bairro"
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
              onPressBotao={erro ? () => setTentativa((valor) => valor + 1) : undefined}
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
