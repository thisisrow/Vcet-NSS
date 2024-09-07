import React, { useState } from "react";
import { View, Text, Image, StyleSheet,useWindowDimensions, } from "react-native";
import logo from "../assets/image/logo.png";
import CustomButton from './reuse/CustomButton'

export default function HomeScreen({ navigation }) {
  const { height } = useWindowDimensions();
  return (
    <View>
      <Image
        source={logo}
        style={[style.logo, { height: height * 0.2 }]}
      ></Image>
      <Text>Welcome to the App</Text>
      <CustomButton
        text="Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const style = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    resizeMode: "contain",
    alignSelf: "center",
    width: "70%",
    maxWidth: 300,
    max: 100,
  },
});
