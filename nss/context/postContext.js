import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

//context
const PostContext = createContext();

const PostProvider = ({ children }) => {
  //state
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  //get posts
  const [refreshing, setRefreshing] = useState(false);

// Define the onRefresh function
const onRefresh = async () => {
  setRefreshing(true); // Set refreshing to true to show the loading spinner
  await getAllPosts(); // Call the API to get the posts
  setRefreshing(false); // Reset refreshing state after the API call
};

// Get posts function
const getAllPosts = async () => {
  setLoading(true);
  try {
    const { data } = await axios.get("/post/get-all-post");
    setPosts(data?.posts || []); // Set posts to an empty array if undefined
  } catch (error) {
    console.log("Error fetching posts:", error);
  } finally {
    setLoading(false);
  }
};
  // inintal  posts
  useEffect(() => {
    getAllPosts();
  }, []);
  
  return (
    <PostContext.Provider value={[posts, setPosts, getAllPosts]}>
      {children}
    </PostContext.Provider>
  );
};

export { PostContext, PostProvider };
