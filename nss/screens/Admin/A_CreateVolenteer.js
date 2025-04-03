import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import InputBox from "../../components/Forms/InputBox";
import SubmitButton from "../../components/Forms/SubmitButton";
import axios from "axios";

const A_CreateVolenteer = ({ navigation }) => {
  // states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  // function
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password || !year || !team) {
        Alert.alert("Please Fill All Required Fields");
        setLoading(false);
        return;
      }

      // Sending registration details to backend
      const { data } = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        year,
        team,
        position,
      });

      alert(data && data.message); // Display message from the backend
      setLoading(false);

      // Navigate to another screen if registration is successful
      if (data.success) {
        navigation.navigate("A_ManageEvent");
      }
    } catch (error) {
      alert(error.response.data.message || "Error occurred");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.inner}>
          <View>
            <InputBox inputTitle={"Name"} value={name} setValue={setName} />
            <InputBox
              inputTitle={"Email"}
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              setValue={setEmail}
            />
            <InputBox
              inputTitle={"Password"}
              secureTextEntry={true}
              autoComplete="password"
              value={password}
              setValue={setPassword}
            />
            <InputBox
              inputTitle={"Year"}
              keyboardType="numeric"
              value={year}
              setValue={setYear}
            />
            <InputBox inputTitle={"Team"} value={team} setValue={setTeam} />
            <InputBox
              inputTitle={"Position"}
              value={position}
              setValue={setPosition}
            />
          </View>
          <SubmitButton
            btnTitle="Register"
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 20,
    flexGrow: 1, // Allows the container to expand to the available space
    justifyContent: "center",
    backgroundColor: "#e1d5c9",
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e2225",
    marginBottom: 20,
  },
  linkText: {
    textAlign: "center",
  },
  link: {
    color: "red",
  },
});

export default A_CreateVolenteer;
