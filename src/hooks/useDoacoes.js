import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { listarDoacoes } from '../storage/doacoesStorage';
import { ordenarMaisRecentes } from '../utils/filtroDoacoes';

export function useDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // recarrega sempre que a tela volta a ficar visível (depois de cadastrar, editar ou excluir)
  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      listarDoacoes()
        .then((lista) => {
          if (telaAtiva) {
            setDoacoes(ordenarMaisRecentes(lista));
            setErro(null);
          }
        })
        .catch(() => {
          if (telaAtiva) {
            setErro('Não foi possível carregar as doações.');
          }
        })
        .finally(() => {
          if (telaAtiva) {
            setCarregando(false);
          }
        });

      return () => {
        telaAtiva = false;
      };
    }, [])
  );

  return { doacoes, carregando, erro };
}
