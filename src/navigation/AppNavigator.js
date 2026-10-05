import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroDoacaoScreen from '../screens/CadastroDoacaoScreen';
import DetalhePontoScreen from '../screens/DetalhePontoScreen';
import HomeScreen from '../screens/HomeScreen';
import PontosScreen from '../screens/PontosScreen';
import { cores } from '../theme/cores';

const Stack = createNativeStackNavigator();

const opcoesCabecalho = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: cores.branco,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={opcoesCabecalho}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Instituto Mão Amiga' }} />
        <Stack.Screen name="Pontos" component={PontosScreen} options={{ title: 'Pontos de coleta' }} />
        <Stack.Screen
          name="DetalhePonto"
          component={DetalhePontoScreen}
          options={{ title: 'Detalhe do ponto' }}
        />
        <Stack.Screen
          name="CadastroDoacao"
          component={CadastroDoacaoScreen}
          options={{ title: 'Registrar doação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
