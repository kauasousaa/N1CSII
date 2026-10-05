import AsyncStorage from '@react-native-async-storage/async-storage';

// Único lugar do app que mexe no AsyncStorage para doações.
const chaveDoacoes = '@maoAmiga:doacoes';

function gerarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function gravarDoacoes(doacoes) {
  await AsyncStorage.setItem(chaveDoacoes, JSON.stringify(doacoes));
}

export async function listarDoacoes() {
  const doacoesSalvas = await AsyncStorage.getItem(chaveDoacoes);
  return doacoesSalvas ? JSON.parse(doacoesSalvas) : [];
}

export async function salvarDoacao(doacao) {
  const doacoes = await listarDoacoes();
  const novaDoacao = {
    ...doacao,
    id: gerarId(),
    criadoEm: new Date().toISOString(),
  };

  await gravarDoacoes([...doacoes, novaDoacao]);
  return novaDoacao;
}

export async function atualizarDoacao(doacaoAtualizada) {
  const doacoes = await listarDoacoes();
  const novaLista = doacoes.map((doacao) =>
    doacao.id === doacaoAtualizada.id ? { ...doacao, ...doacaoAtualizada } : doacao
  );

  await gravarDoacoes(novaLista);
  return novaLista.find((doacao) => doacao.id === doacaoAtualizada.id);
}

export async function excluirDoacao(id) {
  const doacoes = await listarDoacoes();
  await gravarDoacoes(doacoes.filter((doacao) => doacao.id !== id));
}
