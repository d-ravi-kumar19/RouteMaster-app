import { View, TextInput, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";

// Adjust the path to your logo image
const logo = require('./../../../assets/images/logo.png'); // Update this path accordingly

export default function Header() {
  return (
    <View style={styles.container}>
      <Image 
        source={logo}
        style={styles.logo}
      />
       <Image source={require('./../../../assets/images/appname.png')} 
            style={styles.appname}
        /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  logo: {
    width: 50, // Adjust the size as needed
    height: 50,
  },
  appname: {
    width:200,
    height: 50,
  },
});
