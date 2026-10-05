import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import EtiquetaTipo from '../components/EtiquetaTipo';
import Tela from '../components/Tela';
import { cores } from '../theme/cores';

function Secao({ titulo, children }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.tituloSecao}>{titulo}</Text>
      {children}
    </View>
  );
}

function ListaItens({ itens }) {
  return itens.map((item) => (
    <Text key={item} style={styles.texto}>
      • {item}
    </Text>
  ));
}

export default function DetalhePontoScreen({ navigation, route }) {
  const { ponto } = route.params;
  const recebeDoacoes = ponto.recebe.length > 0;

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.card}>
          <EtiquetaTipo tipo={ponto.tipo} />
          <Text style={styles.nome}>{ponto.nome}</Text>

          <Secao titulo="Endereço">
            <Text style={styles.texto}>{ponto.endereco}</Text>
          </Secao>

          <Secao titulo="Dias e horários">
            <Text style={styles.texto}>{ponto.diasHorarios}</Text>
          </Secao>

          {recebeDoacoes ? (
            <Secao titulo="Recebe">
              <ListaItens itens={ponto.recebe} />
            </Secao>
          ) : null}

          {ponto.distribui.length > 0 ? (
            <Secao titulo="Distribui">
              <ListaItens itens={ponto.distribui} />
            </Secao>
          ) : null}
        </View>

        {recebeDoacoes ? (
          <Botao
            titulo="Doar para este ponto"
            onPress={() => navigation.navigate('CadastroDoacao', { pontoInicial: ponto.nome })}
          />
        ) : (
          <Text style={styles.aviso}>
            Este ponto só distribui doações. Para doar, escolha um ponto de coleta.
          </Text>
        )}
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 16,
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.texto,
  },
  secao: {
    marginTop: 16,
  },
  tituloSecao: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 2,
  },
  texto: {
    fontSize: 16,
    color: cores.texto,
  },
  aviso: {
    fontSize: 15,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
