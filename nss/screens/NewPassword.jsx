import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import CoustomInput from "./reuse/input";

export default function NewPassword({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [phone, setPhone] = useState('');
  const  Password=()=>{
    if (password === newPassword) {
      navigation.navigate("Login");
    }else{
        Alert.alert("Login failed", "Invalid credentials");
    }
    
  }
  return (
    <View>
      <Text>Creat new Password</Text>
      <CoustomInput
        placeholder="username"
        value={username}
        setValue={setUsername}
      ></CoustomInput>
      <CoustomInput
        placeholder="Phone Number"
        value={phone}
        setValue={setPhone}
      ></CoustomInput>
      <CoustomInput
        placeholder="Enter New Password"
        value={password}
        setValue={setpassword}
        secureTextEntry
      ></CoustomInput>
      <CoustomInput
        placeholder="Enter New Password"
        value={newPassword}
        setValue={setnewPassword}
        secureTextEntry
      ></CoustomInput>

      <Button title="Sign Up" onPress={Password} />
    </View>
  );
}
