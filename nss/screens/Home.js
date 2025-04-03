import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState, useCallback, useEffect } from "react";
import FooterMenu from "../components/Menus/FooterMenu";
import { PostContext } from "../context/postContext";
import { AuthContext } from "../context/authContext";
import PostCard from "../components/PostCard";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

// Theme colors
const PRIMARY_COLOR = "#4361ee";
const BACKGROUND_COLOR = "#f8f9fa";
const TEXT_COLOR = "#333333";

const Home = ({ navigation }) => {
  // Global state
  const [posts, , getAllPosts] = useContext(PostContext);
  const [state] = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      await getAllPosts();
      setLoading(false);
    };
    loadInitialData();
  }, []);

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllPosts();
    setRefreshing(false);
  }, [getAllPosts]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {state?.user?.name || "Volunteer"}
        </Text>
        <Text style={styles.subText}>
          NSS Volunteer Portal
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Latest Posts</Text>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[PRIMARY_COLOR]} 
            />
          }
        >
          {loading ? (
            <Text style={styles.loadingText}>Loading posts...</Text>
          ) : posts?.length > 0 ? (
            <PostCard posts={posts} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts available</Text>
              <Text style={styles.emptySubText}>Pull down to refresh</Text>
            </View>
          )}
          
          <View style={styles.bottomPadding}/>
        </ScrollView>
      </View>
      
      {/* Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate("ChatVideo")}
      >
        <Icon name="chatbubbles" size={28} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.footerContainer}>
        <FooterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 10,
    color: TEXT_COLOR,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#6c757d",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#adb5bd",
  },
  bottomPadding: {
    height: 100,
  },
  footerContainer: {
    backgroundColor: "#ffffff",
  },
  chatButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
});

export default Home;
