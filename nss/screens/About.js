import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import FooterMenu from "../components/Menus/FooterMenu";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import theme from "../components/theme";

const About = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>About NSS</Text>
          <Text style={styles.subtitle}>National Service Scheme</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            The National Service Scheme (NSS) is an Indian government-sponsored public service program 
            conducted by the Ministry of Youth Affairs and Sports of the Government of India. The scheme 
            was launched in 1969 with the primary objective of developing the personality and character 
            of students through voluntary community service.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>NSS Motto</Text>
          <Text style={styles.motto}>"Not Me But You"</Text>
          <Text style={styles.paragraph}>
            The Motto of NSS "Not Me But You", reflects the essence of democratic living 
            and upholds the need for selfless service. NSS helps the students develop 
            appreciation to other person's point of view and also show consideration 
            towards other living beings.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Activities We Conduct</Text>
          
          <View style={styles.activityItem}>
            <FontAwesome5 name="hands-helping" size={20} color={theme.colors.primary} style={styles.activityIcon} />
            <View>
              <Text style={styles.activityTitle}>Community Service</Text>
              <Text style={styles.activityDescription}>Organizing camps in rural areas and contributing to community development.</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <FontAwesome5 name="heartbeat" size={20} color={theme.colors.primary} style={styles.activityIcon} />
            <View>
              <Text style={styles.activityTitle}>Healthcare</Text>
              <Text style={styles.activityDescription}>Health camps, blood donation drives and awareness campaigns.</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <FontAwesome5 name="tree" size={20} color={theme.colors.primary} style={styles.activityIcon} />
            <View>
              <Text style={styles.activityTitle}>Environment</Text>
              <Text style={styles.activityDescription}>Tree plantation, cleanliness drives and environmental awareness.</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <FontAwesome5 name="book-reader" size={20} color={theme.colors.primary} style={styles.activityIcon} />
            <View>
              <Text style={styles.activityTitle}>Education</Text>
              <Text style={styles.activityDescription}>Teaching underprivileged children and adult education programs.</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:vcet.nss@vit.edu')}
          >
            <FontAwesome5 name="envelope" size={18} color={theme.colors.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>vcet.nss@vit.edu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('tel:+919876543210')}
          >
            <FontAwesome5 name="phone-alt" size={18} color={theme.colors.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>+91 9876543210</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('https://www.vcet.edu.in/nss')}
          >
            <FontAwesome5 name="globe" size={18} color={theme.colors.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>www.vcet.edu.in/nss</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>NSS App v1.0.0</Text>
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <FooterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 12,
    ...theme.shadows.medium,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: 12,
  },
  motto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: 12,
    fontStyle: 'italic',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.darkGray,
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    marginRight: 15,
    marginTop: 3,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: theme.colors.mediumGray,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
    width: 24,
  },
  contactText: {
    fontSize: 15,
    color: theme.colors.darkGray,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: theme.colors.lightGray,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
  },
});

export default About;
