import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cores } from '../theme/cores';
import EtiquetaTipo from './EtiquetaTipo';

function PontoItem({ ponto, favorito, onPress, onAlternarFavorito }) {
  return (
<<<<<<< HEAD
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.conteudo}
        onPress={() => onPress(ponto.id)}
        accessibilityRole="button"
        accessibilityHint="Abre os detalhes do ponto"
      >
        <EtiquetaTipo tipo={ponto.tipo} />
        <Text style={styles.nome}>{ponto.nome}</Text>
        <Text style={styles.info}>{ponto.endereco}</Text>
        <Text style={styles.info}>{ponto.horario}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.favorito}
        onPress={() => onAlternarFavorito(ponto.id)}
        accessibilityRole="button"
        accessibilityLabel={favorito ? 'Desfavoritar ponto' : 'Favoritar ponto'}
      >
        <Text style={styles.coracao}>{favorito ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </View>
=======
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(ponto.id)}
      accessibilityRole="button"
      accessibilityHint="Abre os detalhes do ponto"
    >
      <EtiquetaTipo tipo={ponto.tipo} />
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.info}>{ponto.endereco}</Text>
      <Text style={styles.info}>{ponto.horario}</Text>
    </TouchableOpacity>
>>>>>>> a63fc94865b3f97242ba2e2a3e0b20865e029b24
  );
}

export default memo(PontoItem);

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    backgroundColor: cores.branco,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conteudo: {
    flex: 1,
    padding: 16,
  },
  favorito: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coracao: {
    fontSize: 22,
    color: cores.primariaEscura,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: cores.textoSecundario,
  },
});
