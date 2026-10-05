export function filtrarPorTipo(doacoes, textoBusca) {
  const termo = textoBusca.trim().toLowerCase();

  if (!termo) {
    return doacoes;
  }

  return doacoes.filter((doacao) => doacao.tipoItem.toLowerCase().includes(termo));
}

export function ordenarMaisRecentes(doacoes) {
  return [...doacoes].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}
