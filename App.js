import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider from './screens/store/auth-context';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './screens/store/auth-context';
import IconButton from './components/ui/IconButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
        headerRight:({ tintColor}) => (
          <IconButton icon="exit" color={tintColor} size={24} onPress = {authCtx.logout} />
        ),
      }} /> 
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
      <NavigationContainer>
        {!authCtx.isAuthenticated &&<AuthStack />}
        {authCtx.isAuthenticated &&<AuthenticatedStack />}
      </NavigationContainer>  

  );
}

function Root() {
  const [istryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
        const storedToken = AsyncStorage.getItem('token');

        if(storedToken) {
            authCtx.authenticate(storedToken);
        }

        setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  // if (istryingLogin) {
  //   // Keep the splash screen visible while we fetch resources
  //   SplashScreen.preventAutoHideAsync();
  // } else {
  //   await SplashScreen.hideAsync();
  // }
  return <Navigation />;
}

export default function App() {

  return (
    <>
      <StatusBar style="light" />
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
    </>
  );
}