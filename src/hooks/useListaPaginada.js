import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

const TAMANHO_PAGINA = 10;
const ESPERA_DIGITACAO_MS = 400;

function chegouNaUltima(pagina) {
  return pagina.number + 1 >= pagina.totalPages;
}

function semRepetidos(atuais, novos) {
  const ids = new Set(atuais.map((item) => item.id));
  return [...atuais, ...novos.filter((item) => !ids.has(item.id))];
}

// buscarPagina e ajustarPrimeiraPagina precisam ser estáveis (funções de módulo ou useCallback)
export default function useListaPaginada({ buscarPagina, filtro, ajustarPrimeiraPagina, mensagemErro }) {
  const [itens, setItens] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [chegouAoFim, setChegouAoFim] = useState(false);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const versaoBusca = useRef(0);
  const paginaEmAndamento = useRef(null);
  const filtroCarregado = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const versao = ++versaoBusca.current;
      paginaEmAndamento.current = null;
      filtroCarregado.current = null;
      setCarregandoInicial(true);
      setErro('');

      const timer = setTimeout(() => {
        buscarPagina(filtro, 0, TAMANHO_PAGINA)
          .then((resposta) => {
            if (versao !== versaoBusca.current) {
              return;
            }
            filtroCarregado.current = filtro;
            setItens(ajustarPrimeiraPagina ? ajustarPrimeiraPagina(resposta.content, filtro) : resposta.content);
            setPagina(0);
            setChegouAoFim(chegouNaUltima(resposta.page));
          })
          .catch(() => {
            if (versao !== versaoBusca.current) {
              return;
            }
            setItens([]);
            setChegouAoFim(true);
            setErro(mensagemErro);
          })
          .finally(() => {
            if (versao === versaoBusca.current) {
              setCarregandoInicial(false);
            }
          });
      }, filtro.trim() ? ESPERA_DIGITACAO_MS : 0);

      return () => {
        clearTimeout(timer);
        versaoBusca.current += 1;
        filtroCarregado.current = null;
      };
    }, [buscarPagina, filtro, ajustarPrimeiraPagina, mensagemErro, tentativa])
  );

  const carregarMais = useCallback(() => {
    const listaDesatualizada = filtroCarregado.current !== filtro;
    if (listaDesatualizada || carregandoInicial || carregandoMais || chegouAoFim || erro) {
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
        setItens((atuais) => semRepetidos(atuais, resposta.content));
        setPagina(proxima);
        setChegouAoFim(chegouNaUltima(resposta.page));
      })
      .catch(() => {
        if (versao === versaoBusca.current) {
          paginaEmAndamento.current = null;
        }
      })
      .finally(() => {
        if (versao === versaoBusca.current) {
          setCarregandoMais(false);
        }
      });
  }, [buscarPagina, carregandoInicial, carregandoMais, chegouAoFim, erro, filtro, pagina]);

  const tentarDeNovo = useCallback(() => setTentativa((valor) => valor + 1), []);

  return { itens, carregandoInicial, carregandoMais, erro, carregarMais, tentarDeNovo };
}
