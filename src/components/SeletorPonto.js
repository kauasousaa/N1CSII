import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { pontosQueRecebemDoacao } from '../data/pontosColeta';
import { cores } from '../theme/cores';

export default function SeletorPonto({ pontoSelecionado, onSelecionar, erro }) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>Ponto de destino</Text>
      <View style={styles.opcoes}>
        {pontosQueRecebemDoacao().map((ponto) => {
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
    fontSize: 14,
  },
});
