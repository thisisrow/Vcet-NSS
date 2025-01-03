import { View, Text, StyleSheet, Alert, Dimensions } from "react-native";
import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import EditModal from "./EditModal";

const { width, height } = Dimensions.get("window"); // Get device dimensions

const PostCard = ({ posts, myPostScreen }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [post, setPost] = useState({});
  const navigation = useNavigation();

  // handle delete prompt
  const handleDeletePropmt = (id) => {
    Alert.alert("Attention!", "Are You Sure Want to delete this post?", [
      {
        text: "Cancel",
        onPress: () => {
          console.log("cancel press");
        },
      },
      {
        text: "Delete",
        onPress: () => handleDeletePost(id),
      },
    ]);
  };

  // delete post data
  const handleDeletePost = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/post/delete-post/${id}`);
      setLoading(false);
      alert(data?.message);
      navigation.push("Myposts");
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
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
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text style={{ marginHorizontal: 20 }}>
                <FontAwesome5
                  name="pen"
                  size={16}
                  color={"darkblue"}
                  onPress={() => {
                    setPost(post), setModalVisible(true);
                  }}
                />
              </Text>
              <Text>
                <FontAwesome5
                  name="trash"
                  size={16}
                  color={"red"}
                  onPress={() => handleDeletePropmt(post?._id)}
                />
              </Text>
            </View>
          )}
          <Text style={styles.title}>Title : {post?.title}</Text>
          <Text style={styles.desc}> {post?.description}</Text>
          <View style={styles.footer}>
            <Text>
              <FontAwesome5 name="user" color={"orange"} />{" "}
              {post?.postedBy?.name}
            </Text>
            <Text>
              {" "}
              <FontAwesome5 name="clock" color={"orange"} />
              {" Created "}
              {moment(post?.createdAt).format("DD:MM:YYYY")}
            </Text>
            <Text>
              <FontAwesome5 name="clock" color={"orange"} />
              {" Updated "}
              {moment(post?.updatedAt).format("DD:MM:YYYY")}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: "green",
    textAlign: "center",
    fontSize: width * 0.05, // Dynamic font size based on screen width
    marginBottom: height * 0.02, // Dynamic margin-bottom
  },
  card: {
    width: width * 0.97, // Dynamic width for card
    backgroundColor: "#ffffff",
    borderWidth: 0.2,
    borderColor: "gray",
    padding: width * 0.03, // Dynamic padding
    borderRadius: 5,
    marginVertical: height * 0.009, // Dynamic margin vertical
  },
  title: {
    fontWeight: "bold",
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    fontSize: width * 0.045, // Dynamic font size for title
  },
  desc: {
    marginTop: height * 0.01, // Dynamic margin-top for description
    fontSize: width * 0.04, // Dynamic font size for description
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.02, // Dynamic margin-top for footer
    flexWrap: "wrap",
  },
});

export default PostCard;
