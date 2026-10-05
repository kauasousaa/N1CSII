import { useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import SeletorPonto from '../components/SeletorPonto';
import TelaComTeclado from '../components/TelaComTeclado';
import { atualizarDoacao, salvarDoacao } from '../storage/doacoesStorage';
import { larguraMaximaConteudo } from '../theme/cores';
import { temErros, validarDoacao } from '../utils/validacaoDoacao';

function montarDoacao({ tipoItem, quantidade, pontoDestino }) {
  return {
    tipoItem: tipoItem.trim(),
    quantidade: Number(quantidade),
    pontoDestino,
  };
}

export default function CadastroDoacaoScreen({ navigation, route }) {
  const doacaoEmEdicao = route.params?.doacao;
  const modoEdicao = Boolean(doacaoEmEdicao);

  const [tipoItem, setTipoItem] = useState(doacaoEmEdicao?.tipoItem ?? '');
  const [quantidade, setQuantidade] = useState(
    doacaoEmEdicao ? String(doacaoEmEdicao.quantidade) : ''
  );
  const [pontoDestino, setPontoDestino] = useState(
    doacaoEmEdicao?.pontoDestino ?? route.params?.pontoInicial ?? ''
  );
  const [erros, setErros] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: modoEdicao ? 'Editar doação' : 'Registrar doação' });
  }, [navigation, modoEdicao]);

  async function salvarEdicao(dadosFormulario) {
    const doacaoAtualizada = await atualizarDoacao({ ...doacaoEmEdicao, ...dadosFormulario });
    Alert.alert('Pronto!', 'A doação foi atualizada.');
    navigation.popTo('DetalheDoacao', { doacao: doacaoAtualizada });
  }

  async function salvarNovaDoacao(dadosFormulario) {
    await salvarDoacao(dadosFormulario);
    Alert.alert('Obrigado!', 'Sua doação foi registrada.');
    navigation.goBack();
  }

  async function handleSalvar() {
    const errosEncontrados = validarDoacao({ tipoItem, quantidade, pontoDestino });
    setErros(errosEncontrados);

    if (temErros(errosEncontrados)) {
      return;
    }

    const dadosFormulario = montarDoacao({ tipoItem, quantidade, pontoDestino });

    try {
      if (modoEdicao) {
        await salvarEdicao(dadosFormulario);
      } else {
        await salvarNovaDoacao(dadosFormulario);
      }
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar a doação. Tente novamente.');
    }
  }

  return (
    <TelaComTeclado>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <CampoTexto
          rotulo="Tipo do item"
          placeholder="Ex.: roupa, alimento, brinquedo"
          value={tipoItem}
          onChangeText={setTipoItem}
          erro={erros.tipoItem}
          maxLength={40}
        />

        <CampoTexto
          rotulo="Quantidade"
          placeholder="Ex.: 5"
          value={quantidade}
          onChangeText={setQuantidade}
          erro={erros.quantidade}
          keyboardType="number-pad"
          maxLength={4}
        />

        <SeletorPonto
          pontoSelecionado={pontoDestino}
          onSelecionar={setPontoDestino}
          erro={erros.pontoDestino}
        />

        <Botao
          titulo={modoEdicao ? 'Salvar alterações' : 'Salvar doação'}
          onPress={handleSalvar}
          estilo={styles.botao}
        />
        <Botao titulo="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
      </ScrollView>
    </TelaComTeclado>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 16,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
  botao: {
    marginBottom: 12,
  },
});
