import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Dimensions,
} from "react-native";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { PostContext } from "../../context/postContext";
import { AuthContext } from "../../context/authContext";
import PostCard from "../../components/PostCard";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
import theme from "../../components/theme";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const A_Home = () => {
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
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Admin Dashboard
        </Text>
        <Text style={styles.subText}>
          Welcome, {state?.user?.name || "Admin"}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[theme.colors.primary]} 
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
      
      <View style={styles.footerContainer}>
        <A_FooterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  statCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: width * 0.29,
    ...theme.shadows.small,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.mediumGray,
    marginTop: 3,
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
    color: theme.colors.black,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: theme.colors.mediumGray,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.mediumGray,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.lightGray,
  },
  bottomPadding: {
    height: 100,
  },
  footerContainer: {
    backgroundColor: theme.colors.white,
  },
});

export default A_Home;
