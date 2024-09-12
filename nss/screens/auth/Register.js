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

const Register = ({ navigation }) => {
  // states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState(""); // New state for year
  const [team, setTeam] = useState(""); // New state for team
  const [position, setPosition] = useState(""); // New state for position
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
      setLoading(false);
      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
        year,
        team,
        position,
      });
      alert(data && data.message);
      navigation.navigate("Login");
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.pageTitle}>Register</Text>
        <View >
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
        <Text style={styles.linkText}>
          Already Registered?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            LOGIN
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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

export default Register;
