import { StyleSheet, Text } from 'react-native';
import { cores } from '../theme/cores';

export default function EtiquetaTipo({ tipo }) {
  return <Text style={styles.etiqueta}>{tipo}</Text>;
}

const styles = StyleSheet.create({
  etiqueta: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
    color: cores.primariaEscura,
    backgroundColor: cores.primariaClara,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 6,
  },
});
