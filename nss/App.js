import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import NewPassword from './screens/NewPassword';
import AdminDashboard from './screens/AdminDashboard';
import VolunteerDashboard from './screens/VolunteerDashboard';
import EventManagementScreen from './screens/EventManagementScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Forgot Password" component={NewPassword} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen
          name="VolunteerDashboard"
          component={VolunteerDashboard}
        />
        <Stack.Screen
          name="EventManagement"
          component={EventManagementScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
