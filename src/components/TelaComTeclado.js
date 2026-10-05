import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import Tela from './Tela';

export default function TelaComTeclado({ children }) {
  const alturaCabecalho = useHeaderHeight();

  return (
    <Tela>
      <KeyboardAvoidingView
        style={styles.conteudo}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? alturaCabecalho : 0}
      >
        {children}
      </KeyboardAvoidingView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
  },
});
