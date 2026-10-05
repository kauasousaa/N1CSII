import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import SeletorPonto from '../components/SeletorPonto';
import TelaComTeclado from '../components/TelaComTeclado';
import { temErros, validarDoacao } from '../utils/validacaoDoacao';

export default function CadastroDoacaoScreen({ route }) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState(route.params?.pontoInicial ?? '');
  const [erros, setErros] = useState({});

  function handleSalvar() {
    const errosEncontrados = validarDoacao({ tipoItem, quantidade, pontoDestino });
    setErros(errosEncontrados);

    if (temErros(errosEncontrados)) {
      return;
    }

    Alert.alert('Tudo certo!', 'Os dados da doação são válidos.');
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
  },
});
