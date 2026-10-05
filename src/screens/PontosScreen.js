import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PontoItem from '../components/PontoItem';
import Tela from '../components/Tela';
import { pontosColeta } from '../data/pontosColeta';
import { larguraMaximaConteudo } from '../theme/cores';

export default function PontosScreen({ navigation }) {
  const abrirDetalhe = useCallback(
    (ponto) => navigation.navigate('DetalhePonto', { ponto }),
    [navigation]
  );

  const renderizarPonto = useCallback(
    ({ item }) => <PontoItem ponto={item} onPress={abrirDetalhe} />,
    [abrirDetalhe]
  );

  return (
    <Tela>
      <FlatList
        contentContainerStyle={styles.conteudo}
        data={pontosColeta}
        keyExtractor={(ponto) => ponto.id}
        renderItem={renderizarPonto}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 16,
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
  },
});
