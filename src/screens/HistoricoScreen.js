import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import CampoBusca from '../components/CampoBusca';
import DoacaoItem from '../components/DoacaoItem';
import EstadoVazio from '../components/EstadoVazio';
import TelaComTeclado from '../components/TelaComTeclado';
import { lerRetorno } from '../services/retornoDoacao';
import { listarPagina } from '../services/doacoesService';
import { cores, larguraMaximaConteudo } from '../theme/cores';

const TAMANHO_PAGINA = 10;
const MENSAGEM_CARREGANDO = 'Carregando doações...';
const MENSAGEM_API_DESLIGADA =
  'Não foi possível carregar as doações. Confira se a API está ligada e se o celular está na mesma rede do computador.';
const MENSAGEM_VAZIA = 'Você ainda não registrou nenhuma doação.';

function chegouNaUltima(pagina) {
  return pagina.number + 1 >= pagina.totalPages;
}

function aplicarDoacaoSalva(lista, doacao, filtro) {
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
  const [doacoes, setDoacoes] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [chegouAoFim, setChegouAoFim] = useState(false);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const versaoBusca = useRef(0);
  const paginaEmAndamento = useRef(null);
  const recarregando = useRef(true);

  useFocusEffect(
    useCallback(() => {
      const versao = ++versaoBusca.current;
      paginaEmAndamento.current = null;
      recarregando.current = true;
      setCarregandoInicial(true);
      setErro('');

      const esperar = filtro.trim() ? 400 : 0;
      const timer = setTimeout(() => {
        listarPagina(filtro, 0, TAMANHO_PAGINA)
          .then((resposta) => {
            if (versao !== versaoBusca.current) {
              return;
            }
            recarregando.current = false;
            setDoacoes(aplicarDoacaoSalva(resposta.content, lerRetorno(), filtro));
            setPagina(0);
            setChegouAoFim(chegouNaUltima(resposta.page));
          })
          .catch(() => {
            if (versao !== versaoBusca.current) {
              return;
            }
            setDoacoes([]);
            setChegouAoFim(true);
            setErro(MENSAGEM_API_DESLIGADA);
          })
          .finally(() => {
            if (versao === versaoBusca.current) {
              setCarregandoInicial(false);
            }
          });
      }, esperar);

      return () => {
        clearTimeout(timer);
        versaoBusca.current += 1;
        recarregando.current = true;
      };
    }, [filtro, tentativa])
  );

  const carregarMais = useCallback(() => {
    if (recarregando.current || carregandoInicial || carregandoMais || chegouAoFim || erro) {
      return;
    }
    const proxima = pagina + 1;
    if (paginaEmAndamento.current === proxima) {
      return;
    }
    const versao = versaoBusca.current;
    paginaEmAndamento.current = proxima;
    setCarregandoMais(true);

    listarPagina(filtro, proxima, TAMANHO_PAGINA)
      .then((resposta) => {
        if (versao !== versaoBusca.current) {
          return;
        }
        setDoacoes((atuais) => {
          const ids = new Set(atuais.map((doacao) => doacao.id));
          const novas = resposta.content.filter((doacao) => !ids.has(doacao.id));
          return [...atuais, ...novas];
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
    (id) => navigation.navigate('DetalheDoacao', { id }),
    [navigation]
  );

  const renderizarDoacao = useCallback(
    ({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />,
    [abrirDetalhe]
  );

  const mensagemVazia = filtro.trim()
    ? `Nenhuma doação encontrada para "${filtro.trim()}".`
    : MENSAGEM_VAZIA;

  return (
    <TelaComTeclado>
      <View style={styles.busca}>
        <CampoBusca
          valor={filtro}
          onChangeTexto={(texto) => {
            recarregando.current = true;
            setFiltro(texto);
          }}
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
          ListEmptyComponent={
            <EstadoVazio
              mensagem={erro || mensagemVazia}
              tituloBotao={erro ? 'Tentar de novo' : filtro.trim() ? undefined : 'Registrar doação'}
              onPressBotao={
                erro
                  ? () => setTentativa((valor) => valor + 1)
                  : filtro.trim()
                    ? undefined
                    : () => navigation.navigate('CadastroDoacao')
              }
            />
          }
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
