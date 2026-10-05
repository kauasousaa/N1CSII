import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pontosColeta } from '../data/pontosColeta';
import { cores } from '../theme/cores';

export default function PontosScreen() {
  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Pontos de coleta</Text>
        {pontosColeta.map((ponto) => (
          <View key={ponto.id} style={styles.card}>
            <Text style={styles.nome}>{ponto.nome}</Text>
            <Text style={styles.info}>{ponto.endereco}</Text>
            <Text style={styles.info}>{ponto.horario}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.primariaEscura,
    marginBottom: 16,
  },
  card: {
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
