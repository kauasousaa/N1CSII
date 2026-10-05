import { capitalizar } from './formatacao';

function normalizarTipo(tipoItem) {
  return tipoItem.trim().toLowerCase();
}

function somarPorTipo(doacoes) {
  return doacoes.reduce((totais, doacao) => {
    const chave = normalizarTipo(doacao.tipoItem);
    const totalAtual = totais[chave] ?? { tipo: capitalizar(chave), quantidade: 0, numeroDoacoes: 0 };

    return {
      ...totais,
      [chave]: {
        ...totalAtual,
        quantidade: totalAtual.quantidade + doacao.quantidade,
        numeroDoacoes: totalAtual.numeroDoacoes + 1,
      },
    };
  }, {});
}

export function calcularResumo(doacoes) {
  const totaisPorTipo = Object.values(somarPorTipo(doacoes));

  return {
    totalDoacoes: doacoes.length,
    totalItens: doacoes.reduce((soma, doacao) => soma + doacao.quantidade, 0),
    tipos: totaisPorTipo.sort((a, b) => b.quantidade - a.quantidade),
  };
}
