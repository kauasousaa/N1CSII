import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import EstadoVazio from '../components/EstadoVazio';
import Tela from '../components/Tela';
import { ErroApi } from '../services/api';
import { buscarPorId } from '../services/pontosService';
import { desfavoritar, listarIdsFavoritos, salvarIdsFavoritos } from '../storage/favoritosStorage';
import { cores, larguraMaximaConteudo } from '../theme/cores';

const MENSAGEM_VAZIA = 'Você ainda não favoritou nenhum ponto.';
const MENSAGEM_ERRO =
  'Não foi possível carregar os pontos favoritos. Confira se a API está ligada.';

export default function MeusPontosScreen() {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      setErro('');

      listarIdsFavoritos()
        .then(async (ids) => {
          const encontrados = [];
          for (const id of ids) {
            try {
              encontrados.push(await buscarPorId(id));
            } catch (falha) {
              if (!(falha instanceof ErroApi) || falha.status !== 404) {
                throw falha;
              }
            }
          }
          if (encontrados.length !== ids.length) {
            await salvarIdsFavoritos(encontrados.map((ponto) => ponto.id));
          }
          return encontrados;
        })
        .then((encontrados) => {
          if (ativo) {
            setPontos(encontrados);
          }
        })
        .catch(() => {
          if (ativo) {
            setPontos([]);
            setErro(MENSAGEM_ERRO);
          }
        })
        .finally(() => {
          if (ativo) {
            setCarregando(false);
          }
        });

      return () => {
        ativo = false;
      };
    }, [tentativa])
  );

  async function desmarcar(id) {
    await desfavoritar(id);
    setPontos((atuais) => atuais.filter((ponto) => ponto.id !== id));
  }

  return (
    <Tela>
      {carregando ? (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={styles.mensagem}>Carregando seus pontos...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.conteudo}>
          {erro ? (
            <EstadoVazio
              mensagem={erro}
              tituloBotao="Tentar de novo"
              onPressBotao={() => setTentativa((valor) => valor + 1)}
            />
          ) : null}
          {!erro && pontos.length === 0 ? <EstadoVazio mensagem={MENSAGEM_VAZIA} /> : null}
          {pontos.map((ponto) => (
            <View key={ponto.id} style={styles.card}>
              <Text style={styles.nome}>{ponto.nome}</Text>
              <Text style={styles.info}>{ponto.endereco}</Text>
              <Text style={styles.info}>{ponto.bairro}</Text>
              <Botao
                titulo="Desfavoritar"
                variante="secundario"
                onPress={() => desmarcar(ponto.id)}
                estilo={styles.botao}
              />
            </View>
          ))}
        </ScrollView>
      )}
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
  carregando: {
    marginTop: 32,
    alignItems: 'center',
  },
  mensagem: {
    marginTop: 12,
    fontSize: 16,
    color: cores.textoSecundario,
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: cores.textoSecundario,
  },
  botao: {
    marginTop: 12,
  },
});
