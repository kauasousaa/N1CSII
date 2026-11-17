import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { temStatus } from '../services/api';

export default function useItemDaApi({ buscarPorId, id, mensagemNaoEncontrado, mensagemErro }) {
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      setMensagem('');

      buscarPorId(id)
        .then((encontrado) => {
          if (ativo) {
            setItem(encontrado);
          }
        })
        .catch((erro) => {
          if (!ativo) {
            return;
          }
          setItem(null);
          setMensagem(temStatus(erro, 404) ? mensagemNaoEncontrado : mensagemErro);
        })
        .finally(() => {
          if (ativo) {
            setCarregando(false);
          }
        });

      return () => {
        ativo = false;
      };
    }, [buscarPorId, id, mensagemNaoEncontrado, mensagemErro])
  );

  return { item, carregando, mensagem };
}
