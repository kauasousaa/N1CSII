import { campoVazio } from './validacao';

export function validarPonto({ nome, endereco, bairro, horario, tipo }) {
  const erros = {};

  if (campoVazio(nome)) {
    erros.nome = 'Informe o nome.';
  }
  if (campoVazio(endereco)) {
    erros.endereco = 'Informe o endereço.';
  }
  if (campoVazio(bairro)) {
    erros.bairro = 'Informe o bairro.';
  }
  if (campoVazio(horario)) {
    erros.horario = 'Informe o horário.';
  }
  if (tipo !== 'coleta' && tipo !== 'distribuição') {
    erros.tipo = 'Escolha o tipo do ponto.';
  }

  return erros;
}

export function dadosDoPonto({ nome, endereco, bairro, horario, tipo }) {
  return {
    nome: nome.trim(),
    endereco: endereco.trim(),
    bairro: bairro.trim(),
    horario: horario.trim(),
    tipo,
  };
}
