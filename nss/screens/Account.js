import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StatusBar,
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/Menus/FooterMenu";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInDays } from "date-fns";
import axios from "axios";
import theme from "../components/theme";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const Account = () => {
  // Global state
  const [state, setState] = useContext(AuthContext);
  const { user } = state;

  // Local state
  const [name, setName] = useState(user?.name);
  const [password, setPassword] = useState(user?.password);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState(user?.attendance?.toString() || "0");
  const [hours, setHours] = useState(user?.hours?.toString() || "0");
  const [eventsAttended, setEventsAttended] = useState(
    user?.eventsAttended?.join(", ") || "None"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  // Handle update user data
  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    
    if (password && password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await axios.put("/api/v1/auth/update-user", {
        name,
        password,
        email: user?.email,
      });
      setLoading(false);
      setState({ ...state, user: data.updatedUser });
      Alert.alert("Success", data.message || "Profile updated successfully");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.response?.data?.message || "Update failed");
    }
  };

  // Refresh function to update local state from global context
  const onRefresh = () => {
    setRefreshing(true);
    setName(user?.name); // Reset name
    setPassword(user?.password); // Reset password
    setAttendance(user?.attendance?.toString() || "0");
    setHours(user?.hours?.toString() || "0");
    setEventsAttended(user?.eventsAttended?.join(", ") || "None");
    setRefreshing(false);
  };

  // Load stored image from AsyncStorage and check the date
  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImageUri = await AsyncStorage.getItem("@profile_image");
        const storedImageDate = await AsyncStorage.getItem(
          "@profile_image_date"
        );

        if (storedImageUri && storedImageDate) {
          const daysDifference = differenceInDays(
            new Date(),
            new Date(storedImageDate)
          );
          if (daysDifference > 5) {
            // If the image is older than 5 days, delete it
            await AsyncStorage.multiRemove([
              "@profile_image",
              "@profile_image_date",
            ]);
            setImageUri(null);
          } else {
            setImageUri(storedImageUri); // Set image if it's within 5 days
          }
        }
      } catch (error) {
        console.error("Error loading image from AsyncStorage", error);
      }
    };

    loadImage();
  }, []);

  // Handle image picking
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access media library is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square image
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedImageUri = result.assets[0].uri;
        const currentDate = new Date().toISOString(); // Save current date

        setImageUri(pickedImageUri);

        // Save both the image URI and the current date to AsyncStorage
        await AsyncStorage.multiSet([
          ["@profile_image", pickedImageUri],
          ["@profile_image_date", currentDate],
        ]);
      } else {
        // If no image is picked, clear the image and date from AsyncStorage
        setImageUri(null);
        await AsyncStorage.multiRemove([
          "@profile_image",
          "@profile_image_date",
        ]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Text style={styles.headerSubtitle}>{user?.email}</Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} 
          />
        }
      >
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageWrapper}>
            <Image
              source={{
                uri:
                  imageUri ||
                  "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
              }}
              style={styles.profileImage}
            />
            <View style={styles.editImageButton}>
              <FontAwesome5 name="camera" size={14} color={theme.colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHelpText}>Tap to change profile picture</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Editable Information</Text>
          <Text style={styles.warningText}>
            You can only update your name and password
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="user" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Your name"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="lock" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Your password"
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.updateButton,
              loading && styles.updateButtonDisabled
            ]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.updateButtonText}>
              {loading ? "Updating..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <FontAwesome5 name="envelope" size={16} color={theme.colors.primary} />
              <Text style={styles.infoLabelText}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <FontAwesome5 name="user-tag" size={16} color={theme.colors.primary} />
              <Text style={styles.infoLabelText}>Role</Text>
            </View>
            <Text style={styles.infoValue}>{user?.role}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <FontAwesome5 name="id-badge" size={16} color={theme.colors.primary} />
              <Text style={styles.infoLabelText}>Position</Text>
            </View>
            <Text style={styles.infoValue}>{user?.position || "Member"}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <FontAwesome5 name="users" size={16} color={theme.colors.primary} />
              <Text style={styles.infoLabelText}>Team</Text>
            </View>
            <Text style={styles.infoValue}>{user?.team || "Not assigned"}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>
              <FontAwesome5 name="calendar-alt" size={16} color={theme.colors.primary} />
              <Text style={styles.infoLabelText}>Year</Text>
            </View>
            <Text style={styles.infoValue}>{user?.year || "Not specified"}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Activity Information</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{attendance}</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{hours}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
          </View>
          
          <View style={styles.eventsSection}>
            <Text style={styles.eventsTitle}>Events Attended</Text>
            <ScrollView style={styles.eventsContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
              {user?.eventsAttended && user.eventsAttended.length > 0 ? (
                user.eventsAttended.map((event, index) => (
                  <View key={index} style={styles.eventChip}>
                    <Text style={styles.eventChipText}>{event}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noEventsText}>No events attended yet</Text>
              )}
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <FooterMenu />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.white,
    ...theme.shadows.medium,
  },
  editImageButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: theme.colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.small,
  },
  imageHelpText: {
    marginTop: 10,
    color: theme.colors.primary,
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: theme.colors.danger,
    marginBottom: 15,
    fontStyle: "italic",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
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
  updateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    ...theme.shadows.small,
  },
  updateButtonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  updateButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ultraLightGray,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabelText: {
    marginLeft: 10,
    fontSize: 15,
    color: theme.colors.darkGray,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: theme.colors.black,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: theme.colors.ultraLightGray,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: "45%",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.mediumGray,
  },
  eventsSection: {
    marginTop: 10,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.darkGray,
    marginBottom: 10,
  },
  eventsContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  eventChip: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  eventChipText: {
    color: theme.colors.white,
    fontSize: 14,
  },
  noEventsText: {
    color: theme.colors.mediumGray,
    fontStyle: "italic",
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

export default Account;
