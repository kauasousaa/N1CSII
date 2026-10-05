const tamanhoMinimoTipo = 3;
const tamanhoMaximoTipo = 40;
const quantidadeMaxima = 1000;

function validarTipoItem(tipoItem) {
  const tipoLimpo = tipoItem.trim();

  if (!tipoLimpo) {
    return 'Informe o tipo do item.';
  }
  if (tipoLimpo.length < tamanhoMinimoTipo) {
    return `O tipo do item deve ter pelo menos ${tamanhoMinimoTipo} letras.`;
  }
  if (tipoLimpo.length > tamanhoMaximoTipo) {
    return `O tipo do item deve ter no máximo ${tamanhoMaximoTipo} letras.`;
  }
  return null;
}

function validarQuantidade(quantidade) {
  const quantidadeLimpa = quantidade.trim();

  if (!quantidadeLimpa) {
    return 'Informe a quantidade.';
  }
  if (!/^\d+$/.test(quantidadeLimpa) || Number(quantidadeLimpa) <= 0) {
    return 'A quantidade deve ser um número inteiro maior que zero.';
  }
  if (Number(quantidadeLimpa) > quantidadeMaxima) {
    return `A quantidade máxima por doação é ${quantidadeMaxima}.`;
  }
  return null;
}

function validarPontoDestino(pontoDestino) {
  return pontoDestino ? null : 'Escolha um ponto de destino.';
}

export function validarDoacao({ tipoItem, quantidade, pontoDestino }) {
  const erros = {
    tipoItem: validarTipoItem(tipoItem),
    quantidade: validarQuantidade(quantidade),
    pontoDestino: validarPontoDestino(pontoDestino),
  };

  // remove os campos sem erro pra facilitar a checagem depois
  return Object.fromEntries(Object.entries(erros).filter(([, mensagem]) => mensagem));
}

export function temErros(erros) {
  return Object.keys(erros).length > 0;
}
