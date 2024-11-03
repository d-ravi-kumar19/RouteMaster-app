import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About This Project</Text>
      <Text style={styles.description}>
        This project is a mobile application designed to help users find and navigate to locations with ease. 
        Built using React Native, it offers real-time location tracking and interactive map features.
      </Text>

      <Text style={styles.subTitle}>Team Members:</Text>
      <Text style={styles.teamMember}>• Ravi Kumar</Text>
      <Text style={styles.teamMember}>• Yogesh</Text>
      <Text style={styles.teamMember}>• Sankeerthan</Text>
      <Text style={styles.teamMember}>from AIML, OU</Text>

      <Text style={styles.note}>
        Thank you for using our app! We hope you find it useful and enjoyable.
      </Text>

      <Text style={styles.contactTitle}>For Any Queries:</Text>
      <Text 
        style={styles.contactEmail} 
        onPress={() => Linking.openURL('mailto:dravikumar4614@gmail.com')}
      >
        dravikumar4614@gmail.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  teamMember: {
    fontSize: 16,
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
    marginTop: 20,
    color: '#555',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  contactEmail: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});
