import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import GoogleMapView from "../Components/Home/GoogleMapView";
import SearchBar from "../Components/Search/SearchBar";
import Header from "../Components/Home/Header";
import { getGeocode } from "../Services/googleMapsService";

export default function Home() {
  const [searchedLocation, setSearchedLocation] = useState(null);

  const handleSearch = async (locationName) => {
    try {
      const location = await getGeocode(locationName);
      setSearchedLocation({
        latitude: location.lat,
        longitude: location.lng,
      });
    } catch (error) {
      alert("Error fetching location: " + error.message);
      console.error("Fetch error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header/>
      <SearchBar onSearch={handleSearch} />
      <GoogleMapView searchedLocation={searchedLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});
