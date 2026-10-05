import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cores } from '../theme/cores';
import { formatarData, pluralizar } from '../utils/formatacao';

function DoacaoItem({ doacao, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(doacao)}
      accessibilityRole="button"
      accessibilityHint="Abre os detalhes da doação"
    >
      <View style={styles.linhaTopo}>
        <Text style={styles.tipo} numberOfLines={1}>
          {doacao.tipoItem}
        </Text>
        <Text style={styles.quantidade}>{pluralizar(doacao.quantidade, 'unidade', 'unidades')}</Text>
      </View>
      <Text style={styles.info} numberOfLines={2}>
        Destino: {doacao.pontoDestino}
      </Text>
      <Text style={styles.data}>{formatarData(doacao.criadoEm)}</Text>
    </TouchableOpacity>
  );
}

export default memo(DoacaoItem);

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
    elevation: 2,
  },
  linhaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tipo: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
  },
  quantidade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  info: {
    fontSize: 15,
    color: cores.textoSecundario,
  },
  data: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 4,
  },
});
