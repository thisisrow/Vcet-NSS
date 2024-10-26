import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { PostContext } from "../../context/postContext";
import PostCard from "../../components/PostCard";
import A_FooterMenu from '../../components/Menus/A_FooterMenu';

const A_Home = () => {
  // Global state
  const [posts, , getAllPosts] = useContext(PostContext); // Ensure you're destructuring correctly
  const [refreshing, setRefreshing] = useState(false);

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllPosts(); // Call the function to get posts
    setRefreshing(false);
  }, [getAllPosts]); // Include getAllPosts in the dependency array
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PostCard posts={posts} />
        </ScrollView>
        <View style={{ backgroundColor: "#ffffff" }}>
        <A_FooterMenu/>
        </View>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 2,
    justifyContent: "space-between",
  },
});

export default A_Home

