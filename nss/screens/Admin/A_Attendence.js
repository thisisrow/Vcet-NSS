import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
const A_Attendence = () => {
  return (
    <View style={styles.container}>
      <Text>A_Attendence</Text>
      <A_FooterMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "space-between",
  },
});

export default A_Attendence