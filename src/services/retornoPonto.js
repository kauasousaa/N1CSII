let pontoPendente = null;

export function guardarRetorno(ponto) {
  pontoPendente = ponto;
}

export function lerRetorno() {
  const ponto = pontoPendente;
  pontoPendente = null;
  return ponto;
}

export function limparRetorno() {
  pontoPendente = null;
}
