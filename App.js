import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PontosScreen from './src/screens/PontosScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <PontosScreen />
    </SafeAreaProvider>
  );
}
