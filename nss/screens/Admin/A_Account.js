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
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";

const A_Account = () => {
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
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{
            uri: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
          }}
          style={{ height: 200, width: 200, borderRadius: 100 }}
        />
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
      <A_FooterMenu></A_FooterMenu>
    </View>
  );
};
const { width, height } = Dimensions.get("window");
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
    width: width * 0.2,
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

export default A_Account;