import AsyncStorage from '@react-native-async-storage/async-storage';

const chaveUltimaDoacao = '@maoAmiga:ultimaDoacao';

export async function salvarUltimaDoacao(doacao) {
  await AsyncStorage.setItem(chaveUltimaDoacao, JSON.stringify(doacao));
}

export async function buscarUltimaDoacao() {
  const doacaoSalva = await AsyncStorage.getItem(chaveUltimaDoacao);
  return doacaoSalva ? JSON.parse(doacaoSalva) : null;
}
