export function ordenarMaisRecentes(doacoes) {
  return [...doacoes].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}
