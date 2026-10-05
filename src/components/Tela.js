import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../theme/cores';

export default function Tela({ children }) {
  // o topo já é tratado pelo cabeçalho da navegação
  return (
    <SafeAreaView style={styles.tela} edges={['bottom', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
});
