import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useContext } from "react";
import { PostContext } from "../context/postContext";
import FooterMenu from "../components/Menus/FooterMenu";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const Post = ({ navigation }) => {
  // global state
  const [posts, setPosts] = useContext(PostContext);
  // local state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick document using image picker
  const pickDocument = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload documents');
        return;
      }

      // Pick image or document
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setDocument(result.assets[0]);
      }
    } catch (error) {
      console.log("Error picking document:", error);
      alert("Error picking document. Please try again.");
    }
  };

  // handle form data post DATA
  const handlePost = async () => {
    try {
      setLoading(true);
      
      if (!title) {
        alert("Please add post title");
        setLoading(false);
        return;
      }
      
      if (!description) {
        alert("Please add post description");
        setLoading(false);
        return;
      }

      // Create FormData for server upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      
      // Append document if selected
      if (document) {
        const filename = document.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append("document", {
          uri: Platform.OS === 'ios' ? document.uri.replace('file://', '') : document.uri,
          name: filename,
          type: type,
        });
      }

      const { data } = await axios.post("/api/v1/post/create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setLoading(false);
      setPosts([...posts, data?.post]);
      alert(data?.message);
      navigation.navigate("Home");
    } catch (error) {
      console.log("Upload error:", error);
      alert(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.heading}>Create a post</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Add post title"
            placeholderTextColor={"gray"}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Add post description"
            placeholderTextColor={"gray"}
            multiline={true}
            numberOfLines={6}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          
          <TouchableOpacity style={styles.documentBtn} onPress={pickDocument}>
            <Text style={styles.documentBtnText}>
              <FontAwesome5 name="file" size={18} /> {"  "}
              {document ? "Document Selected" : "Attach Document"}
            </Text>
          </TouchableOpacity>
          
          {document && (
            <View style={styles.documentInfo}>
              <FontAwesome5 name="file-alt" size={16} color="#4361ee" />
              <Text style={styles.documentName} numberOfLines={1}>
                {document.uri.split('/').pop()}
              </Text>
              {document.type && document.type.startsWith('image/') && (
                <Image 
                  source={{ uri: document.uri }} 
                  style={styles.previewImage}
                />
              )}
            </View>
          )}
        </View>
        
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity 
            style={styles.postBtn} 
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.postBtnText}>
                <FontAwesome5 name="plus-square" size={18} /> {"  "}
                Create post
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <FooterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 40,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  inputBox: {
    backgroundColor: "#ffffff",
    textAlignVertical: "top",
    paddingTop: 10,
    width: 320,
    marginTop: 30,
    fontSize: 16,
    paddingLeft: 15,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  },
  documentBtn: {
    backgroundColor: "#4361ee",
    width: 320,
    marginTop: 30,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  documentBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  documentInfo: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    width: 320,
  },
  documentName: {
    marginLeft: 8,
    color: "#333",
    marginTop: 8,
  },
  previewImage: {
    width: 300,
    height: 150,
    marginTop: 10,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  postBtn: {
    backgroundColor: "black",
    width: 300,
    marginTop: 30,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  postBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Post;
