import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, Image, Linking, Platform } from "react-native";
import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import EditModal from "./EditModal";
import { Video } from "expo-av";

const { width, height } = Dimensions.get("window"); // Get device dimensions

// Theme colors
const PRIMARY_COLOR = "#4361ee";
const ACCENT_COLOR = "#3f37c9";
const BACKGROUND_COLOR = "#ffffff";
const TEXT_COLOR = "#333333";
const LIGHT_TEXT_COLOR = "#6c757d";
const BORDER_COLOR = "#e0e0e0";

const PostCard = ({ posts, myPostScreen }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [post, setPost] = useState({});
  const navigation = useNavigation();

  // handle delete prompt
  const handleDeletePrompt = (id) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          console.log("cancel press");
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeletePost(id),
      },
    ]);
  };

  // delete post data
  const handleDeletePost = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/v1/post/delete-post/${id}`);
      setLoading(false);
      alert(data?.message);
      navigation.push("Myposts");
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };

  // Open document
  const openDocument = (url) => {
    if (url) {
      Linking.openURL(url)
        .catch(err => alert('Unable to open document. Please try again later.'));
    }
  };

  // Get file type from documentType or URL
  const getFileType = (url, documentType) => {
    if (documentType) {
      if (documentType.startsWith('image/')) return 'image';
      if (documentType.startsWith('video/')) return 'video';
      if (documentType === 'application/pdf') return 'pdf';
      return 'file';
    }
    
    // Fallback to URL extension if documentType not available
    if (!url) return 'file';
    const extension = url.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) return 'video';
    if (extension === 'pdf') return 'pdf';
    return 'file';
  };

  // Get document icon based on file type
  const getDocumentIcon = (fileType) => {
    switch (fileType) {
      case 'image': return 'file-image';
      case 'video': return 'file-video';
      case 'pdf': return 'file-pdf';
      default: return 'file-alt';
    }
  };

  // Get document label based on file type
  const getDocumentLabel = (fileType) => {
    switch (fileType) {
      case 'image': return 'View Image';
      case 'video': return 'Watch Video';
      case 'pdf': return 'Open PDF';
      default: return 'View Attachment';
    }
  };

  // Render media preview based on file type
  const renderMediaPreview = (post) => {
    if (!post.document) return null;
    
    const fileType = getFileType(post.document, post.documentType);
    
    switch (fileType) {
      case 'image':
        return (
          <Image 
            source={{ uri: post.document }} 
            style={styles.mediaPreview}
            resizeMode="cover"
          />
        );
      case 'video':
        return (
          <Video
            source={{ uri: post.document }}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay={false}
            useNativeControls
            style={styles.mediaPreview}
          />
        );
      case 'pdf':
        return (
          <View style={styles.pdfPreview}>
            <FontAwesome5 name="file-pdf" size={40} color={PRIMARY_COLOR} />
            <Text style={styles.pdfText}>PDF Document</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View>
      {myPostScreen && (
        <EditModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          post={post}
        />
      )}
      {posts?.map((post, i) => (
        <View style={styles.card} key={i}>
          {myPostScreen && (
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  setPost(post);
                  setModalVisible(true);
                }}
              >
                <FontAwesome5 name="pen" size={16} color={PRIMARY_COLOR} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeletePrompt(post?._id)}
              >
                <FontAwesome5 name="trash" size={16} color="#dc3545" />
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={styles.title}>{post?.title}</Text>
          <Text style={styles.desc}>{post?.description}</Text>
          
          {post?.document && (
            <View style={styles.documentWrapper}>
              {renderMediaPreview(post)}
              
              <TouchableOpacity 
                style={styles.documentContainer}
                onPress={() => openDocument(post.document)}
              >
                <FontAwesome5 
                  name={getDocumentIcon(getFileType(post.document, post.documentType))} 
                  size={20} 
                  color={PRIMARY_COLOR} 
                />
                <Text style={styles.documentText}>
                  {getDocumentLabel(getFileType(post.document, post.documentType))}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <FontAwesome5 name="user" size={14} color={PRIMARY_COLOR} />
              <Text style={styles.footerText}>{post?.postedBy?.name}</Text>
            </View>
            <View style={styles.footerItem}>
              <FontAwesome5 name="calendar-plus" size={14} color={PRIMARY_COLOR} />
              <Text style={styles.footerText}>
                {moment(post?.createdAt).format("DD MMM YYYY")}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <FontAwesome5 name="clock" size={14} color={PRIMARY_COLOR} />
              <Text style={styles.footerText}>
                {moment(post?.updatedAt).format("DD MMM YYYY")}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_COLOR,
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: TEXT_COLOR,
    lineHeight: 22,
    marginBottom: 15,
  },
  documentWrapper: {
    marginBottom: 15,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  pdfPreview: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfText: {
    marginTop: 10,
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  documentText: {
    marginLeft: 10,
    color: PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  footerText: {
    fontSize: 13,
    color: LIGHT_TEXT_COLOR,
    marginLeft: 5,
  },
});

export default PostCard;
