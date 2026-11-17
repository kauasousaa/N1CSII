import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cores } from '../theme/cores';

const TIPOS = [
  { valor: 'coleta', rotulo: 'Coleta' },
  { valor: 'distribuição', rotulo: 'Distribuição' },
];

export default function SeletorTipoPonto({ tipoSelecionado, onSelecionar, erro }) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>Tipo</Text>
      <View style={styles.opcoes}>
        {TIPOS.map(({ valor, rotulo }) => {
          const escolhido = tipoSelecionado === valor;
          return (
            <TouchableOpacity
              key={valor}
              style={[styles.opcao, escolhido && styles.opcaoEscolhida]}
              onPress={() => onSelecionar(valor)}
              accessibilityRole="button"
              accessibilityState={{ selected: escolhido }}
            >
              <Text style={[styles.texto, escolhido && styles.textoEscolhido]}>{rotulo}</Text>
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
    gap: 8,
  },
  opcao: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    backgroundColor: cores.branco,
  },
  opcaoEscolhida: {
    borderColor: cores.primaria,
    backgroundColor: cores.primaria,
  },
  texto: {
    fontSize: 16,
    color: cores.texto,
  },
  textoEscolhido: {
    color: cores.branco,
    fontWeight: 'bold',
  },
  erro: {
    color: cores.erro,
    marginTop: 4,
    fontSize: 14,
  },
});
