import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/cores';
import { pluralizar } from '../utils/formatacao';
import { calcularResumo } from '../utils/resumoDoacoes';

export default function ResumoDoacoes({ doacoes }) {
  const resumo = calcularResumo(doacoes);

  if (resumo.totalDoacoes === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.titulo}>Resumo</Text>
        <Text style={styles.linha}>Nenhuma doação registrada ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Resumo</Text>
      <Text style={styles.total}>
        {pluralizar(resumo.totalDoacoes, 'doação', 'doações')} ·{' '}
        {pluralizar(resumo.totalItens, 'item', 'itens')}
      </Text>
      {resumo.tipos.map((tipo) => (
        <Text key={tipo.tipo} style={styles.linha}>
          <Text style={styles.nomeTipo}>{tipo.tipo}:</Text>{' '}
          {pluralizar(tipo.quantidade, 'unidade', 'unidades')} em{' '}
          {pluralizar(tipo.numeroDoacoes, 'doação', 'doações')}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.primariaClara,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.primariaEscura,
    marginBottom: 4,
  },
  total: {
    fontSize: 15,
    color: cores.texto,
    marginBottom: 8,
  },
  linha: {
    fontSize: 15,
    color: cores.texto,
    marginBottom: 2,
  },
  nomeTipo: {
    fontWeight: 'bold',
  },
});
