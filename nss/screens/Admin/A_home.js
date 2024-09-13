import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import A_FooterMenu from '../../components/Menus/A_FooterMenu';

const A_Home = () => {
  return (
    <View style={styles.container}>
      <Text>A_Home</Text>
      <A_FooterMenu></A_FooterMenu>
    </View>
  )
}

export default A_Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "space-between",
  },
});