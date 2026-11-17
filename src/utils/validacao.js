export function campoVazio(valor) {
  return !String(valor ?? '').trim();
}

export function temErros(erros) {
  return Object.keys(erros).length > 0;
}
