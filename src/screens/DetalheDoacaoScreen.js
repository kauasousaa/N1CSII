import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import Tela from '../components/Tela';
import { ErroApi } from '../services/api';
import { buscarPorId, excluir } from '../services/doacoesService';
import { limparRetorno } from '../services/retornoDoacao';
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
  const { id } = route.params;
  const [doacao, setDoacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      setMensagem('');

      buscarPorId(id)
        .then((encontrada) => {
          if (ativo) {
            setDoacao(encontrada);
          }
        })
        .catch((erro) => {
          if (!ativo) {
            return;
          }
          setDoacao(null);
          setMensagem(erro instanceof ErroApi && erro.status === 404
            ? 'doação não encontrada'
            : 'Não foi possível carregar a doação. Confira se a API está ligada.');
        })
        .finally(() => {
          if (ativo) {
            setCarregando(false);
          }
        });

      return () => {
        ativo = false;
      };
    }, [id])
  );

  function confirmarExclusao() {
    Alert.alert(
      'Excluir doação',
      `Deseja mesmo excluir a doação de ${doacao.quantidade}x ${doacao.tipoItem}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: apagarDoacao },
      ]
    );
  }

  async function apagarDoacao() {
    try {
      await excluir(id);
      limparRetorno();
      navigation.popTo('Historico');
    } catch {
      Alert.alert(
        'Não foi possível excluir',
        'A doação continua na lista. Confira se a API está ligada e tente de novo.'
      );
    }
  }

  if (carregando) {
    return (
      <Tela>
        <ActivityIndicator size="large" color={cores.primaria} style={styles.carregando} />
      </Tela>
    );
  }

  if (!doacao) {
    return (
      <Tela>
        <Text style={styles.aviso}>{mensagem}</Text>
      </Tela>
    );
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

        <Botao
          titulo="Editar doação"
          onPress={() => navigation.navigate('CadastroDoacao', { doacao })}
          estilo={styles.botao}
        />
        <Botao titulo="Excluir doação" variante="perigo" onPress={confirmarExclusao} />
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
