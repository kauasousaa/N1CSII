import { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import SeletorPonto from '../components/SeletorPonto';
import TelaComTeclado from '../components/TelaComTeclado';
import { doacaoSalva } from '../navigation/itemSalvo';
import { temStatus } from '../services/api';
import { cadastrar, editar } from '../services/doacoesService';
import { cores, larguraMaximaConteudo } from '../theme/cores';
import { temErros } from '../utils/validacao';
import { dadosDaDoacao, validarDoacao } from '../utils/validacaoDoacao';

function mensagemFalha(erro) {
  if (temStatus(erro, 400)) {
    return 'A API recusou os dados. Confira os campos e tente de novo.';
  }
  return 'Não foi possível salvar a doação. Confira se a API está ligada.';
}

export default function CadastroDoacaoScreen({ navigation, route }) {
  const doacaoEmEdicao = route.params?.doacao;
  const modoEdicao = Boolean(doacaoEmEdicao?.id);

  const [tipoItem, setTipoItem] = useState(doacaoEmEdicao?.tipoItem ?? '');
  const [quantidade, setQuantidade] = useState(
    doacaoEmEdicao ? String(doacaoEmEdicao.quantidade) : ''
  );
  const [pontoDestino, setPontoDestino] = useState(
    doacaoEmEdicao?.pontoDestino ?? route.params?.pontoInicial ?? ''
  );
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState('');
  const [enviando, setEnviando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: modoEdicao ? 'Editar doação' : 'Registrar doação' });
  }, [navigation, modoEdicao]);

  async function handleSalvar() {
    if (enviando) {
      return;
    }

    const errosEncontrados = validarDoacao({ tipoItem, quantidade, pontoDestino });
    setErros(errosEncontrados);
    setFalha('');

    if (temErros(errosEncontrados)) {
      return;
    }

    const dados = dadosDaDoacao({ tipoItem, quantidade, pontoDestino });
    setEnviando(true);

    try {
      const salva = modoEdicao
        ? await editar(doacaoEmEdicao.id, dados)
        : await cadastrar(dados);
      doacaoSalva.guardar(salva);
      navigation.goBack();
    } catch (erro) {
      setFalha(mensagemFalha(erro));
      setEnviando(false);
    }
  }

  const tituloBotao = enviando
    ? 'Salvando...'
    : modoEdicao
      ? 'Salvar alterações'
      : 'Salvar doação';

  return (
    <TelaComTeclado>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <CampoTexto
          rotulo="Tipo do item"
          placeholder="Ex.: roupa, alimento, brinquedo"
          value={tipoItem}
          onChangeText={setTipoItem}
          erro={erros.tipoItem}
          maxLength={120}
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

        {falha ? <Text style={styles.falha}>{falha}</Text> : null}

        <Botao titulo={tituloBotao} onPress={handleSalvar} estilo={styles.botao} />
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
  falha: {
    color: cores.erro,
    fontSize: 15,
    marginBottom: 12,
  },
});
