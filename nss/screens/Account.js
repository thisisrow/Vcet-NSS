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
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/Menus/FooterMenu";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInDays } from "date-fns";
import axios from "axios";

const Account = () => {
  // Global state
  const [state, setState] = useContext(AuthContext);
  const { user } = state;

  // Local state
  const [name, setName] = useState(user?.name);
  const [password, setPassword] = useState(user?.password);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState(user?.attendance.toString());
  const [hours, setHours] = useState(user?.hours.toString());
  const [eventsAttended, setEventsAttended] = useState(
    user?.eventsAttended.join(", ")
  );
  const [refreshing, setRefreshing] = useState(false);

  // Handle update user data
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put("/auth/update-user", {
        name,
        password,
        email: user?.email,
      });
      setLoading(false);
      setState({ ...state, user: data.updatedUser });
      alert(data.message);
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  // Refresh function to update local state from global context
  const onRefresh = () => {
    setRefreshing(true);
    setName(user?.name); // Reset name
    setPassword(user?.password); // Reset password
    setAttendance(user?.attendance.toString());
    setHours(user?.hours.toString());
    setEventsAttended(user?.eventsAttended.join(", "));
    setRefreshing(false);
  };

  // Local state for image URI
  const [imageUri, setImageUri] = useState(null);

  // Load stored image from AsyncStorage and check the date
  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImageUri = await AsyncStorage.getItem("@profile_image");
        const storedImageDate = await AsyncStorage.getItem(
          "@profile_image_date"
        ); // Get the stored date

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
        alert("Permission to access media library is required!");
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
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                imageUri ||
                "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
            }}
            style={{ height: 200, width: 200, borderRadius: 100 }}
          />
        </TouchableOpacity>
        <Text style={{ color: "blue" }}>Tap to change profile picture</Text>
      </View>
      <Text style={styles.warningtext}>
        Currently You Can Only Update Your Name And Password*
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Name :</Text>
            <TextInput
              style={styles.inputBox}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Password :</Text>
            <TextInput
              style={styles.inputBox}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Email :</Text>
            <Text style={styles.normalInText}>{user?.email}</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Role :</Text>
            <Text style={styles.normalInText}>{user?.role}</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Position :</Text>
            <Text style={styles.normalInText}>{user?.position}</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Team :</Text>
            <Text style={styles.normalInText}>{user?.team}</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Year :</Text>
            <Text style={styles.normalInText}>{user?.year}</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Attendance :</Text>
            <Text style={styles.normalInText}>{attendance}</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Hours :</Text>
            <Text style={styles.normalInText}>{hours}</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normaltext}>Events Attended :</Text>
            <ScrollView style={styles.normalInText} horizontal={true}>
              <Text>{eventsAttended}</Text>
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.updateBtnText}>
            {loading ? "Please Wait" : "Update Profile"}
          </Text>
        </TouchableOpacity>
      </View>
      <FooterMenu />
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: width * 0.01,
    marginTop: height * 0.01,
  },
  warningtext: {
    color: "red",
    fontSize: width * 0.035,
    textAlign: "center",
  },
  inputContainer: {
    marginTop: height * 0.02,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    fontWeight: "bold",
    color: "#000000",
    margin: width * 0.015,
    marginLeft: width * 0.07,
    width: width * 0.25,
  },
  inputBox: {
    width: width * 0.6,
    backgroundColor: "#ffffff",
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
    paddingLeft: width * 0.04,
    borderRadius: 5,
  },
  updateBtn: {
    backgroundColor: "black",
    height: height * 0.06,
    width: width * 0.8,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  updateBtnText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "400",
  },
  normal: {
    flexDirection: "row",
    marginTop: width * 0.0015,
  },
  normaltext: {
    color: "black",
    fontSize: width * 0.04,
    fontWeight: "bold",
    margin: width * 0.015,
    marginLeft: width * 0.07,
    width: width * 0.25,
  },
});

export default Account;
