import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import Tela from '../components/Tela';
import { listarDoacoes } from '../storage/doacoesStorage';
import { cores, larguraMaximaConteudo } from '../theme/cores';

export default function HomeScreen({ navigation }) {
  const [doacoes, setDoacoes] = useState([]);
  const ultimaDoacao = doacoes[doacoes.length - 1];

  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then(setDoacoes);
    }, [])
  );

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Bem-vindo ao Mão Amiga</Text>
        <Text style={styles.subtitulo}>
          Registre suas doações e encontre o ponto de coleta mais perto de você.
        </Text>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>Última doação</Text>
          {ultimaDoacao ? (
            <>
              <Text style={styles.textoCard}>
                {ultimaDoacao.quantidade}x {ultimaDoacao.tipoItem} para {ultimaDoacao.pontoDestino}
              </Text>
              <Text style={styles.textoCard}>Total registrado: {doacoes.length}</Text>
            </>
          ) : (
            <Text style={styles.textoCard}>Você ainda não registrou nenhuma doação.</Text>
          )}
        </View>

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
    width: '100%',
    maxWidth: larguraMaximaConteudo,
    alignSelf: 'center',
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
  card: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  tituloCard: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 6,
  },
  textoCard: {
    fontSize: 16,
    color: cores.textoSecundario,
  },
  botao: {
    marginBottom: 12,
  },
});
