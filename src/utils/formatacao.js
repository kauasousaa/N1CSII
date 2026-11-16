function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

export function formatarData(dataIso) {
  const texto = String(dataIso ?? '');
  const partes = texto.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (partes) {
    const [, ano, mes, dia, hora, minuto] = partes;
    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
  }

  const data = new Date(texto);
  if (Number.isNaN(data.getTime())) {
    return texto;
  }
  const dia = doisDigitos(data.getDate());
  const mes = doisDigitos(data.getMonth() + 1);
  const hora = doisDigitos(data.getHours());
  const minuto = doisDigitos(data.getMinutes());

  return `${dia}/${mes}/${data.getFullYear()} às ${hora}:${minuto}`;
}

export function pluralizar(quantidade, singular, plural) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}
