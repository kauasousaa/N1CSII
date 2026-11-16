import { del, get, post, put } from './api';

const PONTOS = '/api/v1/pontos';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: string;
};

export type PaginaPontos = {
  content: Ponto[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type DadosPonto = {
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: string;
};

export function listar(): Promise<Ponto[]> {
  return get(PONTOS);
}

export function buscarPagina(filtro = '', page = 0, size = 10): Promise<PaginaPontos> {
  const parametros = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const termo = filtro.trim();
  if (termo) {
    parametros.set('filtro', termo);
  }
  return get(`${PONTOS}/filtro?${parametros.toString()}`);
}

export function buscarPorId(id: string): Promise<Ponto> {
  return get(`${PONTOS}/${id}`);
}

export function cadastrar(dados: DadosPonto): Promise<Ponto> {
  return post(PONTOS, dados);
}

export function editar(id: string, dados: DadosPonto): Promise<Ponto> {
  return put(`${PONTOS}/${id}`, dados);
}

export function excluir(id: string): Promise<null> {
  return del(`${PONTOS}/${id}`);
}
