import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import CustomMarker from "./CustomMarker";
import { getDirections } from "../../Services/googleMapsService"; // Import the directions service

export default function GoogleMapView({ searchedLocation }) {
  const [mapRegion, setMapRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [route, setRoute] = useState(null); // State for the route
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selected location

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0421,
      });
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (searchedLocation) {
      setMapRegion({
        ...searchedLocation,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0421,
      });
    }
  }, [searchedLocation]);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleGetDirections = async () => {
    if (currentLocation && selectedLocation) {
      const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
      const destination = `${selectedLocation.latitude},${selectedLocation.longitude}`;

      const directions = await getDirections(origin, destination);
      if (directions && directions.length > 0) {
        const points = decodePolyline(directions[0].overview_polyline.points);
        setRoute(points);
      } else {
        Alert.alert("Error", "Could not fetch directions.");
      }
    } else {
      Alert.alert("Error", "Please set both origin and destination.");
    }
  };

  const decodePolyline = (polyline) => {
    const points = [];
    let index = 0,
      len = polyline.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result >> 1) ^ -(result & 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result >> 1) ^ -(result & 1);
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <View style={{ flex: 1 }}>
        {mapRegion && (
          <MapView
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height * 0.72,
            }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
            onPress={handleMapPress} // Handle map press to select location
          >
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Current Location"
                anchor={{ x: 0.5, y: 0.5 }} // Adjusts anchor point to the bottom center of the marker
              >
                <CustomMarker rotation={heading} size={50} />
              </Marker>
            )}

            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Selected Location"
                pinColor="green" // Customize marker color
              />
            )}

            {searchedLocation && (
              <Marker coordinate={searchedLocation} title="Searched Location" />
            )}
            {route && (
              <Polyline
                coordinates={route}
                strokeWidth={4}
                strokeColor="blue"
              />
            )}
          </MapView>
        )}
      </View>
      <TouchableOpacity
        style={[styles.directionButton, { bottom: 80 }]}
        onPress={handleGetDirections}
      >
        <Text style={styles.buttonText}>Directions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  directionButton: {
    position: "absolute",
    bottom: 40,
    right: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
