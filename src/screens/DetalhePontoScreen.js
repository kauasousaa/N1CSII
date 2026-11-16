import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import EtiquetaTipo from '../components/EtiquetaTipo';
import Tela from '../components/Tela';
import { ErroApi } from '../services/api';
import { buscarPorId } from '../services/pontosService';
import { cores, larguraMaximaConteudo } from '../theme/cores';

function Secao({ titulo, children }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.tituloSecao}>{titulo}</Text>
      {children}
    </View>
  );
}

export default function DetalhePontoScreen({ navigation, route }) {
  const { id } = route.params;
  const [ponto, setPonto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setMensagem('');

    buscarPorId(id)
      .then((encontrado) => {
        if (ativo) {
          setPonto(encontrado);
        }
      })
      .catch((erro) => {
        if (!ativo) {
          return;
        }
        setPonto(null);
        setMensagem(erro instanceof ErroApi && erro.status === 404
          ? 'ponto não encontrado'
          : 'Não foi possível carregar o ponto. Confira se a API está ligada.');
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) {
    return (
      <Tela>
        <ActivityIndicator size="large" color={cores.primaria} style={styles.carregando} />
      </Tela>
    );
  }

  if (!ponto) {
    return (
      <Tela>
        <Text style={styles.aviso}>{mensagem}</Text>
      </Tela>
    );
  }

  const podeReceberDoacao = ponto.tipo === 'coleta';

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.card}>
          <EtiquetaTipo tipo={ponto.tipo} />
          <Text style={styles.nome}>{ponto.nome}</Text>

          <Secao titulo="Endereço">
            <Text style={styles.texto}>{ponto.endereco}</Text>
          </Secao>

          <Secao titulo="Bairro">
            <Text style={styles.texto}>{ponto.bairro}</Text>
          </Secao>

          <Secao titulo="Horário">
            <Text style={styles.texto}>{ponto.horario}</Text>
          </Secao>
        </View>

        {podeReceberDoacao ? (
          <Botao
            titulo="Doar para este ponto"
            onPress={() => navigation.navigate('CadastroDoacao', { pontoInicial: ponto.nome })}
          />
        ) : (
          <Text style={styles.aviso}>
            Este ponto só distribui doações. Para doar, escolha um ponto de coleta.
          </Text>
        )}
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
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.texto,
  },
  secao: {
    marginTop: 16,
  },
  tituloSecao: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 2,
  },
  texto: {
    fontSize: 16,
    color: cores.texto,
  },
  aviso: {
    fontSize: 16,
    color: cores.textoSecundario,
    textAlign: 'center',
    margin: 24,
  },
  carregando: {
    marginTop: 32,
  },
});
