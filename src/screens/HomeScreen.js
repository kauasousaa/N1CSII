import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import Tela from '../components/Tela';
import { listarPagina } from '../services/doacoesService';
import { cores, larguraMaximaConteudo } from '../theme/cores';
import { pluralizar } from '../utils/formatacao';

export default function HomeScreen({ navigation }) {
  const [ultimaDoacao, setUltimaDoacao] = useState(null);
  const [total, setTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarPagina('', 0, 1)
        .then((pagina) => {
          if (!ativo) {
            return;
          }
          setUltimaDoacao(pagina.content[0] ?? null);
          setTotal(pagina.page.totalElements);
        })
        .catch(() => {
          if (ativo) {
            setUltimaDoacao(null);
            setTotal(0);
          }
        });
      return () => {
        ativo = false;
      };
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
              <Text style={styles.textoCard}>
                Total registrado: {pluralizar(total, 'doação', 'doações')}
              </Text>
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
          titulo="Minhas doações"
          variante="secundario"
          onPress={() => navigation.navigate('Historico')}
          estilo={styles.botao}
        />
        <Botao
          titulo="Ver pontos de coleta"
          variante="secundario"
          onPress={() => navigation.navigate('Pontos')}
          estilo={styles.botao}
        />
        <Botao
          titulo="Meus pontos"
          variante="secundario"
          onPress={() => navigation.navigate('MeusPontos')}
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
