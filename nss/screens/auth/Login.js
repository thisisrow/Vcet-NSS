import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ImageBackground
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import InputBox from "../../components/Forms/InputBox";
import SubmitButton from "../../components/Forms/SubmitButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import theme from "../../components/theme";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  // Global state
  const [state, setState] = useContext(AuthContext);

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login function
  const handleSubmit = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }
      
      setLoading(true);
      const { data } = await axios.post("/api/v1/auth/login", { email, password });

      if (data.success) {
        setState({
          user: data.user,
          token: data.token,
          role: data.user.role,
        });
        await AsyncStorage.setItem("@auth", JSON.stringify(data));
        
        // Navigate based on user role
        if (data.user.role === "Admin") {
          navigation.navigate("A_Home");
        } else {
          navigation.navigate("Home");
        }
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      Alert.alert(
        "Login Failed", 
        error.response?.data?.message || "Something went wrong. Please try again."
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.upperSection}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </View>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subtitleText}>Login to continue to NSS Portal</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="envelope" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="lock" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <FontAwesome5 
                name={showPassword ? "eye-slash" : "eye"} 
                size={16} 
                color={theme.colors.mediumGray} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.loginButtonText}>Please wait...</Text>
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={16} color={theme.colors.primary} style={styles.backIcon} />
          <Text style={styles.backText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  upperSection: {
    height: height * 0.3,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.white,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  logo: {
    width: 100,
    height: 100,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.black,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: theme.colors.mediumGray,
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.darkGray,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    ...theme.shadows.small,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 10,
  },
  backIcon: {
    marginRight: 8,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Login;
