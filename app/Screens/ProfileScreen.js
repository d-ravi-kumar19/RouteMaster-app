import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function Profile() {
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/150", // Replace with a valid image URL
    recentlyVisited: ["Location X", "Location Y", "Location Z"],
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await fetch('http://15.207.16.52:8000/api/v1/get-directions');
        const data = await response.json();
        setDirections(data); // Set the fetched directions data
      } catch (error) {
        console.error('Error fetching directions:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchDirections();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recently Visited Locations</Text>
        {user.recentlyVisited.map((location, index) => (
          <TouchableOpacity key={index} style={styles.recentItem}>
            <Text style={styles.recentText}>{location}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Directions Section */}
      <View style={styles.directionsContainer}>
        <Text style={styles.sectionTitle}>Directions</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : directions ? (
          <View>
            <Text style={styles.directionText}>Raw API Response:</Text>
            <Text style={styles.rawResponse}>{JSON.stringify(directions, null, 2)}</Text>
          </View>
        ) : (
          <Text>No directions available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  recentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentText: {
    fontSize: 16,
  },
  directionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    marginTop: 20,
  },
  directionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rawResponse: {
    fontSize: 14,
    fontFamily: 'Courier New',
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
