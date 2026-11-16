import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@maoAmiga:pontosFavoritos';

export async function listarIdsFavoritos() {
  const salvo = await AsyncStorage.getItem(CHAVE);
  if (!salvo) {
    return [];
  }
  try {
    const ids = JSON.parse(salvo);
    return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

async function gravarIds(ids) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(ids));
  return ids;
}

export async function salvarIdsFavoritos(ids) {
  return gravarIds(ids);
}

export async function alternarFavorito(id) {
  const ids = await listarIdsFavoritos();
  const novos = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
  return gravarIds(novos);
}

export async function desfavoritar(id) {
  const ids = (await listarIdsFavoritos()).filter((item) => item !== id);
  return gravarIds(ids);
}
