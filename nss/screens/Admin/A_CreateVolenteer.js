import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import theme from "../../components/theme";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";

const { width, height } = Dimensions.get("window");

const A_CreateVolenteer = ({ navigation }) => {
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form validation function
  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name");
      return false;
    }
    
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    
    if (!password || password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    
    if (!year || isNaN(year) || parseInt(year) < 1 || parseInt(year) > 5) {
      Alert.alert("Error", "Year should be a number between 1 and 5");
      return false;
    }
    
    if (!team.trim()) {
      Alert.alert("Error", "Please select a team");
      return false;
    }
    
    return true;
  };

  // Function to handle registration
  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setLoading(true);

      // Sending registration details to backend
      const { data } = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        year,
        team,
        position,
      });

      setLoading(false);
      Alert.alert("Success", data?.message || "Registration successful");

      // Navigate to another screen if registration is successful
      if (data.success) {
        resetForm();
        navigation.navigate("A_allVolenteer");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Registration Failed", 
        error.response?.data?.message || "An error occurred during registration"
      );
      console.log(error);
    }
  };
  
  // Reset form after submission
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setYear("");
    setTeam("");
    setPosition("");
  };

  // List of available teams for the dropdown
  const teams = ["Technical", "Documentation", "Creative", "Management", "Event"];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Volunteer</Text>
        <Text style={styles.headerSubtitle}>Create a volunteer account</Text>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter volunteer's name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Password <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create password (min. 6 characters)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <FontAwesome5 
                    name={showPassword ? "eye-slash" : "eye"} 
                    size={16} 
                    color={theme.colors.mediumGray} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Year Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Year <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="calendar-alt" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter year (1-5)"
                  value={year}
                  onChangeText={setYear}
                  keyboardType="numeric"
                  maxLength={1}
                />
              </View>
            </View>
            
            {/* Team Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Team <Text style={styles.required}>*</Text>
              </Text>
              <View>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="users" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Select a team"
                    value={team}
                    onChangeText={setTeam}
                  />
                </View>
                <View style={styles.teamChipsContainer}>
                  {teams.map((teamOption, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.teamChip, 
                        team === teamOption && styles.teamChipSelected
                      ]}
                      onPress={() => setTeam(teamOption)}
                    >
                      <Text 
                        style={[
                          styles.teamChipText,
                          team === teamOption && styles.teamChipTextSelected
                        ]}
                      >
                        {teamOption}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            {/* Position Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Position</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="id-badge" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter position (optional)"
                  value={position}
                  onChangeText={setPosition}
                />
              </View>
            </View>
            
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.resetButton
                ]}
                onPress={resetForm}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.submitButton,
                  loading && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "Registering..." : "Register Volunteer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={styles.footerContainer}>
        <A_FooterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...theme.shadows.medium,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  formSection: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.small,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.darkGray,
    marginBottom: 8,
  },
  required: {
    color: theme.colors.danger,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    padding: 8,
  },
  teamChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  teamChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  teamChipSelected: {
    backgroundColor: theme.colors.primary,
  },
  teamChipText: {
    fontSize: 14,
    color: theme.colors.darkGray,
  },
  teamChipTextSelected: {
    color: theme.colors.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    ...theme.shadows.small,
  },
  resetButton: {
    backgroundColor: theme.colors.ultraLightGray,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    flex: 2,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  resetButtonText: {
    color: theme.colors.darkGray,
    fontSize: 16,
    fontWeight: "500",
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
  },
});

export default A_CreateVolenteer;
