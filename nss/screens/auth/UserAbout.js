import React, { useContext, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  ImageBackground
} from "react-native";
import { EventContext } from "../../context/eventContext";
import theme from "../../components/theme";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const UserAbout = ({ navigation }) => {
  const { events, loading, fetchEvents } = useContext(EventContext);
  const [animateButton, setAnimateButton] = useState(false);

  useEffect(() => {
    fetchEvents();
    
    // Add a subtle animation effect to the button
    const interval = setInterval(() => {
      setAnimateButton(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter upcoming events (next 3)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Handle login button press
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Header Section with Logo */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>VCET NSS</Text>
          <Text style={styles.subtitle}>Not Me But You</Text>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* About NSS Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="info-circle" size={20} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>About NSS</Text>
          </View>
          
          <Text style={styles.aboutText}>
            The National Service Scheme (NSS) unit at VCET aims to build a sense
            of social responsibility and community service among students. Through
            various initiatives and events, we encourage students to engage in
            meaningful contributions to society.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>200+</Text>
              <Text style={styles.statLabel}>Volunteers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5000+</Text>
              <Text style={styles.statLabel}>Hours Served</Text>
            </View>
          </View>
        </View>
        
        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-alt" size={20} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
          </View>
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <View style={styles.eventDateBadge}>
                  <Text style={styles.eventDateDay}>
                    {new Date(event.date).getDate()}
                  </Text>
                  <Text style={styles.eventDateMonth}>
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </Text>
                </View>
                
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.eventName}</Text>
                  <Text numberOfLines={2} style={styles.eventDescription}>
                    {event.description}
                  </Text>
                  
                  <View style={styles.eventMeta}>
                    <View style={styles.eventMetaItem}>
                      <FontAwesome5 name="map-marker-alt" size={12} color={theme.colors.mediumGray} />
                      <Text style={styles.eventMetaText}>{event.location || 'VCET Campus'}</Text>
                    </View>
                    <View style={styles.eventMetaItem}>
                      <FontAwesome5 name="clock" size={12} color={theme.colors.mediumGray} />
                      <Text style={styles.eventMetaText}>{event.time || '10:00 AM'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>No upcoming events at the moment.</Text>
              <Text style={styles.checkBackText}>Check back later for updates!</Text>
            </View>
          )}
        </View>
        
        {/* Our Impact Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="hands-helping" size={20} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Our Impact</Text>
          </View>
          
          <Text style={styles.impactText}>
            Through dedicated service and volunteering, NSS VCET has made significant contributions to various social causes including:
          </Text>
          
          <View style={styles.impactItem}>
            <FontAwesome5 name="tree" size={16} color={theme.colors.primary} style={styles.impactIcon} />
            <Text style={styles.impactItemText}>Tree plantation drives for environmental conservation</Text>
          </View>
          
          <View style={styles.impactItem}>
            <FontAwesome5 name="book-reader" size={16} color={theme.colors.primary} style={styles.impactIcon} />
            <Text style={styles.impactItemText}>Educational support for underprivileged children</Text>
          </View>
          
          <View style={styles.impactItem}>
            <FontAwesome5 name="heartbeat" size={16} color={theme.colors.primary} style={styles.impactIcon} />
            <Text style={styles.impactItemText}>Health awareness and blood donation camps</Text>
          </View>
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
      
      <TouchableOpacity 
        style={[
          styles.loginButton,
          animateButton && styles.loginButtonAnimated
        ]} 
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Login to Continue</Text>
        <FontAwesome5 name="arrow-right" size={16} color="#fff" style={styles.loginButtonIcon} />
      </TouchableOpacity>
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
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...theme.shadows.medium,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.darkGray,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.mediumGray,
    marginTop: 5,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: theme.colors.mediumGray,
    fontSize: 16,
  },
  eventCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: theme.colors.ultraLightGray,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventDateBadge: {
    backgroundColor: theme.colors.primary,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  eventDateDay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  eventDateMonth: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: theme.colors.darkGray,
    marginBottom: 10,
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMetaText: {
    fontSize: 12,
    color: theme.colors.mediumGray,
    marginLeft: 5,
  },
  noEventsContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.darkGray,
    marginBottom: 5,
  },
  checkBackText: {
    fontSize: 14,
    color: theme.colors.mediumGray,
  },
  impactText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.darkGray,
    marginBottom: 16,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  impactIcon: {
    width: 25,
    marginRight: 10,
  },
  impactItemText: {
    fontSize: 14,
    flex: 1,
    color: theme.colors.darkGray,
  },
  bottomSpace: {
    height: 100,
  },
  loginButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.primary,
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  loginButtonAnimated: {
    transform: [{ scale: 1.03 }],
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  loginButtonIcon: {
    marginLeft: 5,
  },
});

export default UserAbout;
