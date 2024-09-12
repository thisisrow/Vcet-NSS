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
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/Menus/FooterMenu";
import axios from "axios";
const Account = () => {
  //global state
  const [state, setState] = useContext(AuthContext);
  const { user, token } = state;
  //local state
  const [name, setName] = useState(user?.name);
  const [password, setPassword] = useState(user?.password);
  const [email] = useState(user?.email);
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
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{
              uri: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
            }}
            style={{ height: 200, width: 200, borderRadius: 100 }}
          />
        </View>
        <Text>{JSON.stringify({user})}</Text>
        <Text style={styles.warningtext}>
          Currently You Can Only Update Your Name And Password*
        </Text>
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
          <TextInput style={styles.inputBox} value={email} editable={false} />
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
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>
              {loading ? "Please Wait" : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <FooterMenu />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window"); // Get device dimensions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: width * 0.03, // Responsive margin based on screen width
    justifyContent: "space-between",
    marginTop: height * 0.05, // Responsive top margin based on screen height
  },
  warningtext: {
    color: "red",
    fontSize: width * 0.035, // Responsive font size based on screen width
    textAlign: "center",
  },
  inputContainer: {
    marginTop: height * 0.025, // Responsive top margin
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    fontWeight: "bold",
    width: width * 0.18, // Responsive width based on screen width
    color: "#000000",
  },
  inputBox: {
    width: width * 0.7, // Responsive width for input box
    backgroundColor: "#ffffff",
    marginLeft: width * 0.025, // Responsive margin-left
    fontSize: width * 0.04, // Responsive font size
    paddingLeft: width * 0.05, // Responsive padding-left
    borderRadius: 5,
  },
  updateBtn: {
    backgroundColor: "black",
    color: "white",
    height: height * 0.06, // Responsive height for button
    width: width * 0.7, // Responsive width for button
    borderRadius: 10,
    marginTop: height * 0.04, // Responsive top margin
    alignItems: "center",
    justifyContent: "center",
  },
  updateBtnText: {
    color: "#ffffff",
    fontSize: width * 0.04, // Responsive font size
  },
});
export default Account;
