import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Text, 
  StyleSheet, 
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions 
} from "react-native";
import axios from "axios";
import theme from "../../components/theme";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";

const { width, height } = Dimensions.get("window");

const A_Event = ({ navigation }) => {
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    duration: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name, value) => {
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleDateChange = (selectedDate) => {
    const currentDate = selectedDate || new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    handleChange('date', formattedDate);
    setShowDatePicker(false);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async () => {
    if (!eventDetails.eventName || !eventDetails.description || !eventDetails.date || !eventDetails.duration) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/events/create", eventDetails);
      setLoading(false);
      Alert.alert("Success", data.message || "Event created successfully");
      resetForm();
      navigation.navigate("A_ManageEvent");
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert("Error", error.response?.data?.message || "Failed to create event");
    }
  };

  const resetForm = () => {
    setEventDetails({ 
      eventName: "", 
      description: "", 
      date: new Date().toISOString().split('T')[0],
      duration: "",
      location: "",
    });
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'android') {
      if (showDatePicker) {
        return (
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => {
                const today = new Date();
                handleDateChange(today);
              }}
            >
              <Text style={styles.dateOptionText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                handleDateChange(tomorrow);
              }}
            >
              <Text style={styles.dateOptionText}>Tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateOption}
              onPress={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                handleDateChange(nextWeek);
              }}
            >
              <Text style={styles.dateOptionText}>Next Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateOption, styles.cancelOption]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={[styles.dateOptionText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return null;
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Event</Text>
        <Text style={styles.headerSubtitle}>Add an event for NSS volunteers</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Event Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="calendar-day" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter event name"
                value={eventDetails.eventName}
                onChangeText={(value) => handleChange("eventName", value)}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter event description"
                value={eventDetails.description}
                onChangeText={(value) => handleChange("description", value)}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={showDatePickerModal}
            >
              <FontAwesome5 name="calendar-alt" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
              <Text style={[styles.input, eventDetails.date ? {} : styles.placeholderText]}>
                {eventDetails.date ? formatDate(eventDetails.date) : "Select date"}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {renderDatePicker()}
              </View>
            </View>
          </Modal>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Duration <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="clock" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Hours"
                value={eventDetails.duration}
                onChangeText={(value) => handleChange("duration", value)}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="map-marker-alt" size={16} color={theme.colors.mediumGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter event location"
                value={eventDetails.location}
                onChangeText={(value) => handleChange("location", value)}
              />
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]}
              onPress={resetForm}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.submitButton,
                (loading || showDatePicker) && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={loading || showDatePicker}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Creating..." : "Create Event"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <A_FooterMenu />
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 100,
  },
  formSection: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    ...theme.shadows.small,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.darkGray,
    marginBottom: 8,
  },
  required: {
    color: theme.colors.danger,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textAreaContainer: {
    height: 120,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
  },
  textArea: {
    height: 100,
  },
  placeholderText: {
    color: theme.colors.mediumGray,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    ...theme.shadows.medium,
  },
  datePickerContainer: {
    backgroundColor: theme.colors.white,
  },
  dateOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dateOptionText: {
    fontSize: 16,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  cancelOption: {
    borderBottomWidth: 0,
  },
  cancelText: {
    color: theme.colors.danger,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    ...theme.shadows.small,
  },
  resetButton: {
    backgroundColor: theme.colors.ultraLightGray,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    flex: 2,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  resetButtonText: {
    color: theme.colors.darkGray,
    fontSize: 16,
    fontWeight: "500",
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

export default A_Event;
