import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  RefreshControl
} from "react-native";
import axios from "axios";
import { EventContext } from "../../context/eventContext";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import theme from "../../components/theme";

const { width, height } = Dimensions.get("window");

const A_Attendance = () => {
  const { events, loading: eventLoading, fetchEvents } = useContext(EventContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [volunteers, setVolunteers] = useState([]); 
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  // Fetch volunteers (users)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/auth/all-users`);
      const data = response.data;
      setVolunteers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to fetch volunteers");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUsers(), fetchEvents()]);
    setRefreshing(false);
  };

  // Fetch volunteers when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and log only today's events
  const getTodayEvents = () => {
    const today = new Date().toDateString();
    return events.filter(
      (event) => new Date(event.date).toDateString() === today
    );
  };

  // Toggle volunteer selection
  const toggleVolunteerSelection = (volunteerId) => {
    if (selectedVolunteers.includes(volunteerId)) {
      setSelectedVolunteers(
        selectedVolunteers.filter((id) => id !== volunteerId)
      );
    } else {
      setSelectedVolunteers([...selectedVolunteers, volunteerId]);
    }
  };

  // Select all volunteers
  const selectAllVolunteers = () => {
    if (selectedVolunteers.length === volunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map(volunteer => volunteer._id));
    }
  };

  const handleSubmit = async () => {
    if (selectedVolunteers.length === 0) {
      Alert.alert("Error", "Please select at least one volunteer.");
      return;
    }
    
    const todaysEvents = getTodayEvents();
    if (todaysEvents.length === 0) {
      Alert.alert("Error", "No events scheduled for today.");
      return;
    }
    
    try {
      setSubmitting(true);
      const eventToday = todaysEvents[0]; // Assuming only one event for today
      const response = await axios.put("/api/v1/present/markattendance", {
        selectedVolunteers,
        eventName: eventToday.eventName,
        eventHours: eventToday.duration,
      });
      setSubmitting(false);
      Alert.alert("Success", "Attendance marked successfully!");
      setSelectedVolunteers([]);
    } catch (error) {
      setSubmitting(false);
      console.error("Error marking attendance:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to mark attendance.");
    }
  };

  const todaysEvents = getTodayEvents();
  const allSelected = volunteers.length > 0 && selectedVolunteers.length === volunteers.length;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSubtitle}>Mark attendance for today's events</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} 
          />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-check" size={20} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Today's Events</Text>
          </View>
          
          {loading || eventLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : todaysEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="calendar-times" size={30} color={theme.colors.lightGray} />
              <Text style={styles.emptyText}>No events scheduled for today</Text>
            </View>
          ) : (
            todaysEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventBadge}>
                    <FontAwesome5 name="calendar-day" size={16} color={theme.colors.white} />
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{event?.eventName || "Event Name Not Available"}</Text>
                    <Text style={styles.eventDate}>{new Date(event.date).toDateString()}</Text>
                  </View>
                  <View style={styles.eventDuration}>
                    <FontAwesome5 name="clock" size={14} color={theme.colors.primary} />
                    <Text style={styles.durationText}>{event.duration}h</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="users" size={20} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Volunteers</Text>
            
            <TouchableOpacity 
              style={styles.selectAllButton}
              onPress={selectAllVolunteers}
            >
              <Text style={styles.selectAllText}>
                {allSelected ? "Deselect All" : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading volunteers...</Text>
            </View>
          ) : volunteers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="users-slash" size={30} color={theme.colors.lightGray} />
              <Text style={styles.emptyText}>No volunteers available</Text>
            </View>
          ) : (
            volunteers.map((volunteer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.volunteerCard,
                  selectedVolunteers.includes(volunteer._id) && styles.selectedVolunteer
                ]}
                onPress={() => toggleVolunteerSelection(volunteer._id)}
              >
                <View style={styles.volunteerInfo}>
                  <View style={styles.volunteerAvatar}>
                    <Text style={styles.avatarText}>
                      {volunteer.name ? volunteer.name.charAt(0).toUpperCase() : "V"}
                    </Text>
                  </View>
                  <View style={styles.volunteerDetails}>
                    <Text style={styles.volunteerName}>{volunteer.name}</Text>
                    <Text style={styles.volunteerTeam}>{volunteer.team || "No Team"}</Text>
                  </View>
                </View>
                
                <View style={styles.checkboxContainer}>
                  <View style={[
                    styles.checkbox,
                    selectedVolunteers.includes(volunteer._id) && styles.checkboxSelected
                  ]}>
                    {selectedVolunteers.includes(volunteer._id) && (
                      <FontAwesome5 name="check" size={12} color={theme.colors.white} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (submitting || todaysEvents.length === 0 || selectedVolunteers.length === 0) && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={submitting || todaysEvents.length === 0 || selectedVolunteers.length === 0}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Submitting..." : "Mark Attendance"}
          </Text>
        </TouchableOpacity>
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
    paddingTop: 30,
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
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
    flex: 1,
  },
  selectAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
  },
  selectAllText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.mediumGray,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    marginTop: 10,
    color: theme.colors.mediumGray,
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  eventBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.black,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: theme.colors.mediumGray,
  },
  eventDuration: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  durationText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  volunteerCard: {
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedVolunteer: {
    backgroundColor: "rgba(0, 128, 0, 0.1)",
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  volunteerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  volunteerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  volunteerDetails: {
    flex: 1,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.black,
  },
  volunteerTeam: {
    fontSize: 14,
    color: theme.colors.mediumGray,
  },
  checkboxContainer: {
    paddingLeft: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.mediumGray,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  bottomSpace: {
    height: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
  },
});

export default A_Attendance;
