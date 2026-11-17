import { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import SeletorTipoPonto from '../components/SeletorTipoPonto';
import TelaComTeclado from '../components/TelaComTeclado';
import { pontoSalvo } from '../navigation/itemSalvo';
import { temStatus } from '../services/api';
import { cadastrar, editar } from '../services/pontosService';
import { cores, larguraMaximaConteudo } from '../theme/cores';
import { temErros } from '../utils/validacao';
import { dadosDoPonto, validarPonto } from '../utils/validacaoPonto';

function mensagemFalha(erro) {
  if (temStatus(erro, 400)) {
    return 'A API recusou os dados. Confira os campos e tente de novo.';
  }
  return 'Não foi possível salvar o ponto. Confira se a API está ligada.';
}

export default function CadastroPontoScreen({ navigation, route }) {
  const pontoEmEdicao = route.params?.ponto;
  const modoEdicao = Boolean(pontoEmEdicao?.id);

  const [nome, setNome] = useState(pontoEmEdicao?.nome ?? '');
  const [endereco, setEndereco] = useState(pontoEmEdicao?.endereco ?? '');
  const [bairro, setBairro] = useState(pontoEmEdicao?.bairro ?? '');
  const [horario, setHorario] = useState(pontoEmEdicao?.horario ?? '');
  const [tipo, setTipo] = useState(pontoEmEdicao?.tipo ?? '');
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState('');
  const [enviando, setEnviando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: modoEdicao ? 'Editar ponto' : 'Cadastrar ponto' });
  }, [navigation, modoEdicao]);

  async function handleSalvar() {
    if (enviando) {
      return;
    }

    const campos = { nome, endereco, bairro, horario, tipo };
    const errosEncontrados = validarPonto(campos);
    setErros(errosEncontrados);
    setFalha('');

    if (temErros(errosEncontrados)) {
      return;
    }

    const dados = dadosDoPonto(campos);
    setEnviando(true);

    try {
      const salvo = modoEdicao
        ? await editar(pontoEmEdicao.id, dados)
        : await cadastrar(dados);
      pontoSalvo.guardar(salvo);
      navigation.goBack();
    } catch (erro) {
      setFalha(mensagemFalha(erro));
      setEnviando(false);
    }
  }

  return (
    <TelaComTeclado>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <CampoTexto
          rotulo="Nome"
          placeholder="Ex.: Ponto Setor Oeste"
          value={nome}
          onChangeText={setNome}
          erro={erros.nome}
          maxLength={120}
        />
        <CampoTexto
          rotulo="Endereço"
          placeholder="Ex.: Rua 10, nº 20, Goiânia - GO"
          value={endereco}
          onChangeText={setEndereco}
          erro={erros.endereco}
          maxLength={200}
        />
        <CampoTexto
          rotulo="Bairro"
          placeholder="Ex.: Setor Oeste"
          value={bairro}
          onChangeText={setBairro}
          erro={erros.bairro}
          maxLength={80}
        />
        <CampoTexto
          rotulo="Horário"
          placeholder="Ex.: Seg a Sex, 8h às 17h"
          value={horario}
          onChangeText={setHorario}
          erro={erros.horario}
          maxLength={80}
        />
        <SeletorTipoPonto tipoSelecionado={tipo} onSelecionar={setTipo} erro={erros.tipo} />

        {falha ? <Text style={styles.falha}>{falha}</Text> : null}

        <Botao
          titulo={enviando ? 'Salvando...' : modoEdicao ? 'Salvar alterações' : 'Cadastrar ponto'}
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
  falha: {
    color: cores.erro,
    fontSize: 15,
    marginBottom: 12,
  },
});
