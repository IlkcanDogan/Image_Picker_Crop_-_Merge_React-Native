import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Theme from './src/core/theme';

//Screens
import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/home';
import SettingScreen from './src/screens/setting';

const Stack = createStackNavigator();
function App() {
  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerStyle: { backgroundColor: Theme.colors.primary }, headerTintColor: '#fff' }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerLeft: null, headerTitleAlign: 'center', headerTitle: 'Kimlik Fotoğrafı Yükle' }} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerTitleAlign: 'center', headerTitle: 'Ayarlar' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App;