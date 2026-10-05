import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores } from '../theme/cores';
import EtiquetaTipo from './EtiquetaTipo';

function PontoItem({ ponto, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(ponto)}
      accessibilityRole="button"
      accessibilityHint="Abre os detalhes do ponto"
    >
      <EtiquetaTipo tipo={ponto.tipo} />
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.info}>{ponto.endereco}</Text>
      <Text style={styles.info}>{ponto.diasHorarios}</Text>
    </TouchableOpacity>
  );
}

export default memo(PontoItem);

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
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
