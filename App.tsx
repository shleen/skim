import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, PTSans_400Regular, PTSans_700Bold } from '@expo-google-fonts/pt-sans';
import * as Linking from 'expo-linking';
import Login from './pages/Login';
import Home from './pages/Home';

const Stack = createStackNavigator();
Stack.Navigator.defaultProps = {
  headerMode: 'none',
};

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

export default function App() {
  const [loaded] = useFonts({
    PTSans_400Regular,
    PTSans_700Bold,
  });

  if (!loaded) {
    return null;
  }

  const linking = {
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        Home: 'home',
        Login: 'login',
      }
    }
  };


  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login} />
        <Stack.Screen
          name="Home"
          component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
