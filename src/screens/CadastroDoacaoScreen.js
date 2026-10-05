import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import SeletorPonto from '../components/SeletorPonto';
import TelaComTeclado from '../components/TelaComTeclado';
import { salvarDoacao } from '../storage/doacoesStorage';
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
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState(route.params?.pontoInicial ?? '');
  const [erros, setErros] = useState({});

  async function handleSalvar() {
    const errosEncontrados = validarDoacao({ tipoItem, quantidade, pontoDestino });
    setErros(errosEncontrados);

    if (temErros(errosEncontrados)) {
      return;
    }

    try {
      await salvarDoacao(montarDoacao({ tipoItem, quantidade, pontoDestino }));
      Alert.alert('Obrigado!', 'Sua doação foi registrada.');
      navigation.goBack();
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

        <Botao titulo="Salvar doação" onPress={handleSalvar} />
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
});
