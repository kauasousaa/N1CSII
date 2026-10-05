import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cores } from '../theme/cores';

export default function CampoBusca({ valor, onChangeTexto, placeholder }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={onChangeTexto}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSecundario}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {valor ? (
        <TouchableOpacity
          style={styles.botaoLimpar}
          onPress={() => onChangeTexto('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
        >
          <Text style={styles.textoLimpar}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: cores.texto,
  },
  botaoLimpar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoLimpar: {
    fontSize: 18,
    color: cores.textoSecundario,
  },
});
