import { ScrollView, StyleSheet, Text } from 'react-native';
import Botao from '../components/Botao';
import Tela from '../components/Tela';
import { cores } from '../theme/cores';

export default function HomeScreen({ navigation }) {
  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Bem-vindo ao Mão Amiga</Text>
        <Text style={styles.subtitulo}>
          Registre suas doações e encontre o ponto de coleta mais perto de você.
        </Text>

        <Botao
          titulo="Registrar doação"
          onPress={() => navigation.navigate('CadastroDoacao')}
          estilo={styles.botao}
        />
        <Botao
          titulo="Ver pontos de coleta"
          variante="secundario"
          onPress={() => navigation.navigate('Pontos')}
          estilo={styles.botao}
        />
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.primariaEscura,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: cores.textoSecundario,
    marginBottom: 20,
  },
  botao: {
    marginBottom: 12,
  },
});
