import { View, Text, StyleSheet, TextInput} from "react-native";
import React from "react";

const A_Event = () => {
  return (
    <View style={styles.container}>
      <Text>Create Events</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "space-between",
  },
});

export default A_Event;