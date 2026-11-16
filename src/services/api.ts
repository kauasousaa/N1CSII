const URL_BASE = 'http://192.168.1.2:8080';

export class ErroApi extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

async function requisitar(caminho: string, opcoes: RequestInit = {}) {
  let resposta: Response;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      ...opcoes,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...opcoes.headers,
      },
    });
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar à API.');
  }

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, `A API respondeu com status ${resposta.status}.`);
  }

  if (resposta.status === 204) {
    return null;
  }

  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}

export function get(caminho: string) {
  return requisitar(caminho);
}

export function post(caminho: string, corpo: unknown) {
  return requisitar(caminho, { method: 'POST', body: JSON.stringify(corpo) });
}

export function put(caminho: string, corpo: unknown) {
  return requisitar(caminho, { method: 'PUT', body: JSON.stringify(corpo) });
}

export function del(caminho: string) {
  return requisitar(caminho, { method: 'DELETE' });
}
