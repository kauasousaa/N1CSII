import { del, get, post, put } from './api';

const DOACOES = '/api/v1/doacoes';

export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export type PaginaDoacoes = {
  content: Doacao[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type DadosDoacao = {
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
};

export function listarPagina(filtro = '', page = 0, size = 10): Promise<PaginaDoacoes> {
  const parametros = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const termo = filtro.trim();
  if (termo) {
    parametros.set('filtro', termo);
  }
  return get(`${DOACOES}/filtro?${parametros.toString()}`);
}

export function buscarPorId(id: string): Promise<Doacao> {
  return get(`${DOACOES}/${id}`);
}

export function cadastrar(dados: DadosDoacao): Promise<Doacao> {
  return post(DOACOES, dados);
}

export function editar(id: string, dados: DadosDoacao): Promise<Doacao> {
  return put(`${DOACOES}/${id}`, dados);
}

export function excluir(id: string): Promise<null> {
  return del(`${DOACOES}/${id}`);
}
