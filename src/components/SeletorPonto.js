import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { listar } from '../services/pontosService';
import { cores } from '../theme/cores';

export default function SeletorPonto({ pontoSelecionado, onSelecionar, erro }) {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [falha, setFalha] = useState('');

  useEffect(() => {
    let ativo = true;
    listar()
      .then((lista) => {
        if (ativo) {
          setPontos(lista);
        }
      })
      .catch(() => {
        if (ativo) {
          setFalha('Não foi possível carregar os pontos da API.');
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });
    return () => {
      ativo = false;
    };
  }, []);

<<<<<<< HEAD
  const opcoes = pontos.filter(
    (ponto) => ponto.tipo === 'coleta' || ponto.nome === pontoSelecionado
  );

=======
>>>>>>> a63fc94865b3f97242ba2e2a3e0b20865e029b24
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>Ponto de destino</Text>
      {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
      {falha ? <Text style={styles.erro}>{falha}</Text> : null}
      <View style={styles.opcoes}>
<<<<<<< HEAD
        {opcoes.map((ponto) => {
=======
        {pontos.map((ponto) => {
>>>>>>> a63fc94865b3f97242ba2e2a3e0b20865e029b24
          const selecionado = ponto.nome === pontoSelecionado;
          return (
            <TouchableOpacity
              key={ponto.id}
              style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
              onPress={() => onSelecionar(ponto.nome)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selecionado }}
            >
              <Text style={[styles.textoOpcao, selecionado && styles.textoOpcaoSelecionada]}>
                {ponto.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 6,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcao: {
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 22,
    backgroundColor: cores.branco,
  },
  opcaoSelecionada: {
    borderColor: cores.primaria,
    backgroundColor: cores.primaria,
  },
  textoOpcao: {
    fontSize: 15,
    color: cores.texto,
  },
  textoOpcaoSelecionada: {
    color: cores.branco,
    fontWeight: 'bold',
  },
  erro: {
    color: cores.erro,
    marginTop: 4,
    marginBottom: 8,
    fontSize: 14,
  },
});
