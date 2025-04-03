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
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";

const EditModal = ({ modalVisible, setModalVisible, post }) => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  // Present file type selection options
  const showFileOptions = () => {
    Alert.alert(
      "Select File Type",
      "What type of file do you want to attach?",
      [
        {
          text: "Image",
          onPress: () => pickImage(),
        },
        {
          text: "Video",
          onPress: () => pickImage('video'),
        },
        {
          text: "PDF Document",
          onPress: () => pickPdf(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // Pick image or video using ImagePicker
  const pickImage = async (mediaType = 'image') => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need gallery permissions to upload media');
        return;
      }

      // Pick image or video
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType === 'video' ? 
          ImagePicker.MediaTypeOptions.Videos : 
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setDocument(result.assets[0]);
      }
    } catch (error) {
      console.log(`Error picking ${mediaType}:`, error);
      alert(`Error picking ${mediaType}. Please try again.`);
    }
  };

  // Pick PDF document
  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // For PDF, we need to manually assign the type
        setDocument({
          ...result.assets[0],
          type: 'application/pdf'
        });
      }
    } catch (error) {
      console.log("Error picking PDF:", error);
      alert("Error picking PDF. Please try again.");
    }
  };

  // Determine document type for display and validation
  const getDocumentType = (doc) => {
    const file = doc || document;
    if (!file) return null;
    
    if (file.type) {
      if (file.type.startsWith('image/')) return 'image';
      if (file.type.startsWith('video/')) return 'video';
      if (file.type === 'application/pdf') return 'pdf';
    }
    
    // Fallback to extension
    if (file.uri) {
      const ext = file.uri.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
      if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
      if (ext === 'pdf') return 'pdf';
    }
    
    return 'file';
  };

  // Get file type for existing post document
  const getPostDocumentType = () => {
    if (!post || !post.document) return null;
    
    if (post.documentType) {
      if (post.documentType.startsWith('image/')) return 'image';
      if (post.documentType.startsWith('video/')) return 'video';
      if (post.documentType === 'application/pdf') return 'pdf';
    }
    
    // Fallback to URL extension
    const url = post.document;
    if (!url) return 'file';
    
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) return 'video';
    if (extension === 'pdf') return 'pdf';
    
    return 'file';
  };

  // Render preview for new document
  const renderNewDocumentPreview = () => {
    if (!document) return null;
    
    const fileType = getDocumentType();
    
    switch (fileType) {
      case 'image':
        return (
          <Image 
            source={{ uri: document.uri }} 
            style={styles.previewImage}
          />
        );
      case 'video':
        return (
          <Video
            source={{ uri: document.uri }}
            style={styles.previewImage}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        );
      case 'pdf':
        return (
          <View style={styles.pdfPreview}>
            <FontAwesome5 name="file-pdf" size={40} color="#4361ee" />
            <Text style={styles.documentName}>{document.name}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.filePreview}>
            <FontAwesome5 name="file-alt" size={40} color="#4361ee" />
            <Text style={styles.documentName}>{document.name || "Selected File"}</Text>
          </View>
        );
    }
  };

  // Render preview for existing document
  const renderExistingDocumentPreview = () => {
    if (!post.document) return null;
    
    const fileType = getPostDocumentType();
    
    switch (fileType) {
      case 'image':
        return (
          <Image 
            source={{ uri: post.document }} 
            style={styles.previewImage}
          />
        );
      case 'video':
        return (
          <Video
            source={{ uri: post.document }}
            style={styles.previewImage}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        );
      case 'pdf':
        return (
          <View style={styles.pdfPreview}>
            <FontAwesome5 name="file-pdf" size={40} color="#4361ee" />
            <Text style={styles.documentName}>Current PDF Document</Text>
          </View>
        );
      default:
        return (
          <View style={styles.filePreview}>
            <FontAwesome5 name="file-alt" size={40} color="#4361ee" />
            <Text style={styles.documentName}>Current File Attachment</Text>
          </View>
        );
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
        
        // Determine the correct mime type
        let type = document.type;
        
        // If type is missing, try to determine from extension
        if (!type) {
          const ext = filename.split('.').pop().toLowerCase();
          if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            type = `image/${ext}`;
          } else if (['mp4'].includes(ext)) {
            type = 'video/mp4';
          } else if (ext === 'pdf') {
            type = 'application/pdf';
          } else {
            type = 'application/octet-stream';
          }
        }
        
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
          timeout: 60000, // 60 seconds timeout
        }
      );
      
      setLoading(false);
      alert(data?.message);
      navigation.push("Myposts");
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error.response?.data?.message || error.message);
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
            
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.inputBox}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.inputBox}
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            
            <TouchableOpacity style={styles.documentBtn} onPress={showFileOptions}>
              <Text style={styles.documentBtnText}>
                <FontAwesome5 name="file" size={16} /> {"  "}
                {document ? "Change Attachment" : "Update Attachment"}
              </Text>
            </TouchableOpacity>
            
            {document && (
              <View style={styles.documentInfo}>
                {renderNewDocumentPreview()}
                <Text style={styles.documentType}>
                  {getDocumentType() === 'image' && "Image"}
                  {getDocumentType() === 'video' && "Video"}
                  {getDocumentType() === 'pdf' && "PDF Document"}
                  {getDocumentType() === 'file' && "File"}
                </Text>
              </View>
            )}
            
            {!document && post?.document && (
              <View style={styles.documentInfo}>
                <Text style={styles.documentInfoText}>Current Attachment:</Text>
                {renderExistingDocumentPreview()}
                <Text style={styles.documentType}>
                  {getPostDocumentType() === 'image' && "Image"}
                  {getPostDocumentType() === 'video' && "Video"}
                  {getPostDocumentType() === 'pdf' && "PDF Document"}
                  {getPostDocumentType() === 'file' && "File"}
                </Text>
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
                disabled={loading}
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  inputBox: {
    marginBottom: 20,
    paddingTop: 10,
    textAlignVertical: "top",
    backgroundColor: "lightgray",
    borderRadius: 10,
    marginTop: 5,
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
    marginBottom: 20,
    width: '100%',
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  documentInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    fontWeight: '500',
  },
  documentName: {
    fontSize: 14,
    color: "#333",
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  documentType: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    fontStyle: 'italic',
  },
  previewImage: {
    width: 250,
    height: 150,
    borderRadius: 5,
  },
  pdfPreview: {
    width: 250,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  filePreview: {
    width: 250,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
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
