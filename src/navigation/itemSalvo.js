// Guarda o item que acabou de ser salvo para a lista mostrá-lo ao voltar para ela.
function criarItemSalvo() {
  let pendente = null;

  return {
    guardar(item) {
      pendente = item;
    },
    ler() {
      const item = pendente;
      pendente = null;
      return item;
    },
    limpar() {
      pendente = null;
    },
  };
}

export const pontoSalvo = criarItemSalvo();
export const doacaoSalva = criarItemSalvo();
