import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
import { useNavigation } from "@react-navigation/native";
import { EventContext } from "../../context/eventContext"; 
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import theme from "../../components/theme";

const { width, height } = Dimensions.get("window");

const A_ManageEvent = () => {
  const navigation = useNavigation();
  const { events, loading, fetchEvents } = useContext(EventContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  // Handle navigation to the event creation screen
  const handleCreateEvent = () => {
    navigation.navigate("A_Event");
  };
  
  // Filter today's events
  const getTodayEvents = () => {
    const today = new Date().toDateString();
    return events.filter(event => new Date(event.date).toDateString() === today);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const todaysEvents = getTodayEvents();

  // Render event details modal
  const renderEventModal = () => {
    if (!selectedEvent) return null;

    return (
      <Modal
        visible={showEventModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Event Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowEventModal(false)}
              >
                <FontAwesome5 name="times" size={20} color={theme.colors.darkGray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <View style={styles.detailRow}>
                  <FontAwesome5 name="calendar-day" size={16} color={theme.colors.primary} />
                  <Text style={styles.detailLabel}>Event Name:</Text>
                  <Text style={styles.detailValue}>{selectedEvent.eventName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <FontAwesome5 name="calendar" size={16} color={theme.colors.primary} />
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedEvent.date)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <FontAwesome5 name="clock" size={16} color={theme.colors.primary} />
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>{selectedEvent.duration} hours</Text>
                </View>

                {selectedEvent.location && (
                  <View style={styles.detailRow}>
                    <FontAwesome5 name="map-marker-alt" size={16} color={theme.colors.primary} />
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{selectedEvent.location}</Text>
                  </View>
                )}

                <View style={styles.descriptionSection}>
                  <Text style={styles.descriptionLabel}>
                    <FontAwesome5 name="file-alt" size={16} color={theme.colors.primary} /> Description:
                  </Text>
                  <Text style={styles.descriptionText}>{selectedEvent.description}</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.editButton]}
                onPress={() => {
                  setShowEventModal(false);
                  // Add edit functionality here
                }}
              >
                <FontAwesome5 name="edit" size={16} color={theme.colors.white} />
                <Text style={styles.buttonText}>Edit Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Events</Text>
        <Text style={styles.headerSubtitle}>Create and track NSS events</Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing || loading} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} 
          />
        }
      >
        {/* Today's Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-day" size={20} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Today's Events</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : todaysEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="calendar-times" size={24} color={theme.colors.lightGray} />
              <Text style={styles.emptyText}>No events scheduled for today</Text>
            </View>
          ) : (
            todaysEvents.map((event, index) => (
              <TouchableOpacity
                key={index}
                style={styles.todayEventCard}
                onPress={() => handleEventClick(event)}
              >
                <View style={styles.eventCardHeader}>
                  <View style={styles.eventDateBadge}>
                    <Text style={styles.eventDateDay}>{new Date(event.date).getDate()}</Text>
                    <Text style={styles.eventDateMonth}>
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </Text>
                  </View>
                  
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.eventName}</Text>
                    <View style={styles.eventMeta}>
                      <View style={styles.eventMetaItem}>
                        <FontAwesome5 name="clock" size={12} color={theme.colors.mediumGray} />
                        <Text style={styles.eventMetaText}>{event.duration} hours</Text>
                      </View>
                      {event.location && (
                        <View style={styles.eventMetaItem}>
                          <FontAwesome5 name="map-marker-alt" size={12} color={theme.colors.mediumGray} />
                          <Text style={styles.eventMetaText}>{event.location}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        
        {/* All Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-alt" size={20} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>All Events</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="calendar-minus" size={24} color={theme.colors.lightGray} />
              <Text style={styles.emptyText}>No events found</Text>
              <Text style={styles.emptySubText}>Create your first event</Text>
            </View>
          ) : (
            events.map((event, index) => (
              <TouchableOpacity
                key={event._id || index}
                style={styles.eventCard}
                onPress={() => {
                  // View event details or edit functionality could be added here
                  Alert.alert("Event Details", `${event.eventName}\n${formatDate(event.date)}\nDuration: ${event.duration} hours`);
                }}
              >
                <View style={styles.eventCardContent}>
                  <View style={styles.eventCardLeft}>
                    <Text style={styles.eventCardDate}>{formatDate(event.date)}</Text>
                    <Text style={styles.eventCardTitle}>{event.eventName}</Text>
                    {event.description && (
                      <Text 
                        style={styles.eventCardDescription} 
                        numberOfLines={2}
                      >
                        {event.description}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.eventCardRight}>
                    <View style={styles.durationBadge}>
                      <FontAwesome5 name="clock" size={12} color={theme.colors.white} />
                      <Text style={styles.durationText}>{event.duration}h</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={16} color={theme.colors.mediumGray} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {renderEventModal()}
      
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleCreateEvent}
        >
          <FontAwesome5 name="plus" size={20} color={theme.colors.white} />
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
    paddingBottom: 100,
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
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: theme.colors.mediumGray,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    marginTop: 10,
    color: theme.colors.darkGray,
    fontSize: 16,
    fontWeight: "500",
  },
  emptySubText: {
    marginTop: 5,
    color: theme.colors.mediumGray,
    fontSize: 14,
  },
  todayEventCard: {
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  eventCardHeader: {
    flexDirection: "row",
    padding: 12,
  },
  eventDateBadge: {
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventDateDay: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDateMonth: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.black,
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  eventMetaText: {
    fontSize: 12,
    color: theme.colors.mediumGray,
    marginLeft: 4,
  },
  eventCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  eventCardContent: {
    padding: 12,
    flexDirection: "row",
  },
  eventCardLeft: {
    flex: 1,
  },
  eventCardDate: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.black,
    marginBottom: 4,
  },
  eventCardDescription: {
    fontSize: 14,
    color: theme.colors.mediumGray,
  },
  eventCardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  durationText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  bottomPadding: {
    height: 20,
  },
  fabContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    maxHeight: height * 0.8,
    width: '100%',
    ...theme.shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: theme.colors.darkGray,
    marginLeft: 10,
    marginRight: 5,
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
  },
  descriptionSection: {
    marginTop: 10,
  },
  descriptionLabel: {
    fontSize: 16,
    color: theme.colors.darkGray,
    fontWeight: '500',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: theme.colors.black,
    lineHeight: 24,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    ...theme.shadows.small,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default A_ManageEvent;