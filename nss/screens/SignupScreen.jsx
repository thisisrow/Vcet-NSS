import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import CoustomInput from "./reuse/input";

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setEmail] = useState("");
  return (
    <View>
      <Text>Only Admin</Text>
      <Text>Sign Up</Text>
      <CoustomInput
        placeholder="username"
        value={username}
        setValue={setUsername}
      ></CoustomInput>
      <CoustomInput
        placeholder="Password"
        value={password}
        setValue={setpassword}
        secureTextEntry
      ></CoustomInput>
      <CoustomInput
      
        placeholder="Email"
        value={email}
        setValue={setEmail}
        keyboardType="email-address"
      ></CoustomInput>

      <Button title="Sign Up" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}
