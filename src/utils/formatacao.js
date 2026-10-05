function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

export function formatarData(dataIso) {
  const data = new Date(dataIso);
  const dia = doisDigitos(data.getDate());
  const mes = doisDigitos(data.getMonth() + 1);
  const hora = doisDigitos(data.getHours());
  const minuto = doisDigitos(data.getMinutes());

  return `${dia}/${mes}/${data.getFullYear()} às ${hora}:${minuto}`;
}

export function pluralizar(quantidade, singular, plural) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}
