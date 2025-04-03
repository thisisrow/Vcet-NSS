import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";

const EditModal = ({ modalVisible, setModalVisible, post }) => {
  const navigation = useNavigation();
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

  //handle update post
  const updatePostHandler = async (id) => {
    try {
      setLoading(true);
      
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
      
      const { data } = await axios.put(
        `/api/v1/post/update-post/${id}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setLoading(false);
      alert(data?.message);
      navigation.push("Myposts");
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error?.response?.data?.message || "Update failed. Please try again.");
    }
  };

  //inital post data
  useEffect(() => {
    setTitle(post?.title);
    setDescription(post?.description);
    setDocument(null); // Reset document when modal opens
  }, [post]);
  
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Update Your Post</Text>
            
            <Text>Title</Text>
            <TextInput
              style={styles.inputBox}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
            
            <Text>Description</Text>
            <TextInput
              style={styles.inputBox}
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            
            <TouchableOpacity style={styles.documentBtn} onPress={pickDocument}>
              <Text style={styles.documentBtnText}>
                <FontAwesome5 name="file" size={16} /> {"  "}
                {document ? "Document Selected" : "Update Document"}
              </Text>
            </TouchableOpacity>
            
            {document && (
              <View style={styles.documentInfo}>
                <FontAwesome5 name="file-alt" size={14} color="#4361ee" />
                <Text style={styles.documentName} numberOfLines={1}>
                  {document.uri.split('/').pop()}
                </Text>
                {document.type?.startsWith('image/') && (
                  <Image 
                    source={{ uri: document.uri }} 
                    style={styles.previewImage}
                  />
                )}
              </View>
            )}
            
            {!document && post?.document && (
              <View style={styles.documentInfo}>
                <FontAwesome5 name="file-alt" size={14} color="#4361ee" />
                <Text style={styles.documentName} numberOfLines={1}>
                  Current document will be kept
                </Text>
                {post.document.match(/\.(jpeg|jpg|gif|png)$/i) && (
                  <Image 
                    source={{ uri: post.document }} 
                    style={styles.previewImage}
                  />
                )}
              </View>
            )}
            
            <View style={styles.btnContainer}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  updatePostHandler(post && post._id),
                  setModalVisible(!modalVisible);
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.textStyle}>UPDATE</Text>
                )}
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 320,
  },
  inputBox: {
    marginBottom: 20,
    paddingTop: 10,
    textAlignVertical: "top",
    backgroundColor: "lightgray",
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 10,
  },
  documentBtn: {
    backgroundColor: "#4361ee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  documentBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  documentInfo: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
  },
  documentName: {
    marginLeft: 8,
    color: "#333",
    marginTop: 5,
  },
  previewImage: {
    width: 250,
    height: 150,
    marginTop: 10,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "black",
    elevation: 2,
    width: 100,
    margin: 10,
    alignItems: "center",
  },
  buttonOpen: {
    // backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditModal;
