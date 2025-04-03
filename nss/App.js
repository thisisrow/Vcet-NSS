import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View, ActivityIndicator, StyleSheet } from "react-native";
import RootNavigation from "./navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from "./components/theme";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading, e.g., pre-loading data, checking auth status
    const initApp = async () => {
      try {
        // Any initialization tasks would go here
        await AsyncStorage.getItem("@auth"); // Just checking if auth exists
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.log("App initialization error:", error);
        setLoading(false);
      }
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
