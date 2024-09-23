import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useState,useEffect } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/Menus/FooterMenu";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInDays } from "date-fns";
import axios from "axios";
const Account = () => {
  //global state
  const [state, setState] = useContext(AuthContext);
  const { user, token } = state;
  //local state
  const [name, setName] = useState(user?.name);
  const [password, setPassword] = useState(user?.password);
  const [email] = useState(user?.email);
  const [role, setRole] = useState(user?.role);
  const [position, setPosition] = useState(user?.position);
  const [year, setYear] = useState(user?.year);
  const [team, setTeam] = useState(user?.team);
  const [attendance, setAttendance] = useState(user?.attendance);
  const [hours, setHours] = useState(user?.hours);
  const [eventsAttended, setEventsAttended] = useState(user?.eventsAttended);

  const [loading, setLoading] = useState(false);

  //handle update user data
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put("/auth/update-user", {
        name,
        password,
        email,
      });
      setLoading(false);
      let UD = JSON.stringify(data);
      setState({ ...state, user: UD?.updatedUser });
      alert(data && data.message);
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
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
            console.log("Image expired and removed after 5 days");
          } else {
            setImageUri(storedImageUri); // Set image if it's within 5 days
            console.log("Loaded image from storage:", storedImageUri);
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

        console.log(
          "Image and date saved to AsyncStorage:",
          pickedImageUri,
          currentDate
        );
      } else {
        // If no image is picked, clear the image and date from AsyncStorage
        setImageUri(null);
        await AsyncStorage.multiRemove([
          "@profile_image",
          "@profile_image_date",
        ]);
        console.log("Image removed from AsyncStorage");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  console.log(imageUri);

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
        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Name</Text>
            <TextInput
              style={styles.inputBox}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.email}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Password</Text>
            <TextInput
              style={styles.inputBox}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Role</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.role}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Position</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.position}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Team</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.team}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Year</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.year}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Attendance</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.attendance.toString()}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Hours</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.hours.toString()}
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Events Attended</Text>
            <TextInput
              style={styles.inputBox}
              value={state?.user.eventsAttended.join(", ")}
              editable={false}
            />
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

const { width, height } = Dimensions.get("window"); // Get device dimensions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: width * 0.01, 
    justifyContent: "space-between",
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
    width: width * 0.20, 
    color: "#000000",
  },
  inputBox: {
    width: width * 0.6, 
    backgroundColor: "#ffffff",
    marginLeft: width * 0.025, 
    fontSize: width * 0.04, 
    paddingLeft: width * 0.04, 
    borderRadius: 5,
  },
  updateBtn: {
    backgroundColor: "black",
    color: "white",
    height: height * 0.06, 
    width: width * 0.7, 
    borderRadius: 10,
    marginTop: height * 0.04, 
    alignItems: "center",
    justifyContent: "center",
  },
  updateBtnText: {
    color: "#ffffff",
    fontSize: width * 0.04, 
  },
});
export default Account;
