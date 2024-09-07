import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import Input from './reuse/input';
import CustomButton from './reuse/CustomButton';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <Text>Login</Text>
      <Input
        placeholder="username"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton
        text="Login as Admin"
        onPress={() => navigation.navigate("AdminDashboard")}
      />
      <CustomButton
        text="Login as Volunteer"
        onPress={() => navigation.navigate("VolunteerDashboard")}
      />
      <CustomButton
        text="Sign Up"
        onPress={() => navigation.navigate("Signup")}
        type="SECONDARY"
      />
      <CustomButton
        text="Create New Password"
        onPress={() => navigation.navigate("Forgot Password")}
        type="TERTIARY"
      />
    </View>
  );
}
