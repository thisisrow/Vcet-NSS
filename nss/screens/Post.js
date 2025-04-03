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
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import { PostContext } from "../context/postContext";
import FooterMenu from "../components/Menus/FooterMenu";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import axios from "axios";

const Post = ({ navigation }) => {
  // global state
  const [posts, setPosts] = useContext(PostContext);
  // local state
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
  const getDocumentType = () => {
    if (!document) return null;
    
    if (document.type) {
      if (document.type.startsWith('image/')) return 'image';
      if (document.type.startsWith('video/')) return 'video';
      if (document.type === 'application/pdf') return 'pdf';
    }
    
    // Fallback to extension
    if (document.uri) {
      const ext = document.uri.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
      if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
      if (ext === 'pdf') return 'pdf';
    }
    
    return 'file';
  };

  // Render document preview
  const renderPreview = () => {
    if (!document) return null;
    
    const documentType = getDocumentType();
    
    switch (documentType) {
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
            <Text style={styles.documentName}>{document.name || "PDF Document"}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.documentName}>
            <Text>{document.name || "Selected File"}</Text>
          </View>
        );
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

      const { data } = await axios.post("/api/v1/post/create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds timeout
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
          
          <TouchableOpacity style={styles.documentBtn} onPress={showFileOptions}>
            <Text style={styles.documentBtnText}>
              <FontAwesome5 name="file" size={18} /> {"  "}
              {document ? "Change Attachment" : "Attach File"}
            </Text>
          </TouchableOpacity>
          
          {document && (
            <View style={styles.documentInfo}>
              {renderPreview()}
              <Text style={styles.documentType}>
                {getDocumentType() === 'image' && "Image"}
                {getDocumentType() === 'video' && "Video"}
                {getDocumentType() === 'pdf' && "PDF Document"}
                {getDocumentType() === 'file' && "File"}
              </Text>
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
    width: 320,
    marginTop: 10,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  documentName: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  documentType: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    fontStyle: 'italic',
  },
  previewImage: {
    width: 300,
    height: 180,
    borderRadius: 5,
  },
  pdfPreview: {
    width: 300,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
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
