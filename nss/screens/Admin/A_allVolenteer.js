import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
import theme from "../../components/theme";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const A_allVolunteer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/auth/all-users`);
      const data = response.data;
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Volunteers Management</Text>
        <Text style={styles.headerSubtitle}>All NSS Volunteers</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.actionHeader}>
          <Text style={styles.sectionTitle}>
            {users.length} {users.length === 1 ? 'Volunteer' : 'Volunteers'}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate("A_CreateVolenteer")}
          >
            <FontAwesome5 name="user-plus" size={14} color="#fff" style={styles.addButtonIcon} />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
        >
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading volunteers...</Text>
            </View>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.userCard}
                onPress={() => {
                  // View volunteer details or edit screen
                  console.log("View volunteer:", user.name);
                }}
              >
                <View style={styles.userCardTop}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.avatarText}>
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.userMetaRow}>
                      <FontAwesome5 name="envelope" size={12} color={theme.colors.mediumGray} style={styles.metaIcon} />
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                  </View>
                  <FontAwesome5 
                    name="chevron-right" 
                    size={16} 
                    color={theme.colors.mediumGray} 
                    style={styles.chevronIcon}
                  />
                </View>
                
                <View style={styles.userCardBottom}>
                  <View style={styles.userDetail}>
                    <Text style={styles.detailLabel}>Team</Text>
                    <Text style={styles.detailValue}>{user.team || "Not assigned"}</Text>
                  </View>
                  <View style={styles.userDetail}>
                    <Text style={styles.detailLabel}>Position</Text>
                    <Text style={styles.detailValue}>{user.position || "Member"}</Text>
                  </View>
                  <View style={styles.userDetail}>
                    <Text style={styles.detailLabel}>Year</Text>
                    <Text style={styles.detailValue}>{user.year || "N/A"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="users-slash" size={50} color={theme.colors.lightGray} />
              <Text style={styles.emptyText}>No volunteers found</Text>
              <Text style={styles.emptySubtext}>Add new volunteers to get started</Text>
            </View>
          )}
          
          <View style={styles.bottomPadding} />
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
    ...theme.shadows.medium,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  actionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.black,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    ...theme.shadows.small,
  },
  addButtonIcon: {
    marginRight: 6,
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: "500",
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.mediumGray,
    fontSize: 16,
  },
  userCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  userCardTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ultraLightGray,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.black,
    marginBottom: 4,
  },
  userMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    marginRight: 6,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.mediumGray,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  userCardBottom: {
    flexDirection: "row",
    padding: 12,
    justifyContent: "space-between",
  },
  userDetail: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.mediumGray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.darkGray,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.darkGray,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.mediumGray,
    marginTop: 8,
  },
  bottomPadding: {
    height: 100,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
  },
});

export default A_allVolunteer;
