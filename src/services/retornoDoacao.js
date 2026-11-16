let doacaoPendente = null;

export function guardarRetorno(doacao) {
  doacaoPendente = doacao;
}

export function lerRetorno() {
  const doacao = doacaoPendente;
  doacaoPendente = null;
  return doacao;
}

export function limparRetorno() {
  doacaoPendente = null;
}
