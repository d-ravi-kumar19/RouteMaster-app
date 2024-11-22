import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { getDirections } from "../../Services/googleMapsService"; // Import the directions service
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DeviceMotion } from "expo-sensors"; // To get the device's heading (orientation)

export default function GoogleMapView({ searchedLocation }) {
  const [mapRegion, setMapRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState(null); // State for the route
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selected location
  const [loading, setLoading] = useState(true); // State for loading status
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility for directions input
  const [origin, setOrigin] = useState(""); // State for origin location
  const [destination, setDestination] = useState(""); // State for destination location
  const [heading, setHeading] = useState(0); // State for the device's heading

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
      setLoading(false); // Stop loading when location is fetched
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

  useEffect(() => {
    // Subscribe to the device's motion data to get the heading
    const subscription = DeviceMotion.addListener(({ heading }) => {
      if (heading && heading.trueHeading !== undefined) {
        setHeading(heading.trueHeading);
      }
    });

    return () => subscription.remove();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleGetDirections = async () => {
    if (origin && destination) {
      const directions = await getDirections(origin, destination);
      if (directions && directions.length > 0) {
        const points = decodePolyline(directions[0].overview_polyline.points);
        setRoute(points);
        setModalVisible(false); // Close modal after getting directions
        // Center map on origin
        const originLatLng = directions[0].legs[0].start_location;
        setMapRegion({
          ...mapRegion,
          latitude: originLatLng.lat,
          longitude: originLatLng.lng,
        });
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
      <View style={[styles.mapContainer]}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          mapRegion && (
            <MapView
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height * 0.72,
              }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              region={mapRegion}
              onPress={handleMapPress}
            >
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Selected Location"
                  pinColor="red"
                />
              )}

              {searchedLocation && (
                <Marker coordinate={searchedLocation} title="Searched Location" />
              )}

              {/* Custom Marker at Origin with Rotation */}
              {route && currentLocation && (
                <Marker
                  coordinate={currentLocation}
                  title="Origin"
                  anchor={{ x: 0.5, y: 0.5 }}
                  rotation={heading} // Rotate the marker according to the device heading
                >
                  <MaterialCommunityIcons
                    name="location-pin"
                    size={40}
                    color="blue"
                  />
                </Marker>
              )}

              {route && (
                <Polyline
                  coordinates={route}
                  strokeWidth={4}
                  strokeColor="blue"
                />
              )}
            </MapView>
          )
        )}
      </View>

      {/* Directions Button */}
      <TouchableOpacity
        style={[styles.directionButton, { bottom: 80 }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Get Directions</Text>
      </TouchableOpacity>

      {/* Directions Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter Origin and Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Origin"
            value={origin}
            onChangeText={setOrigin}
          />
          <TextInput
            style={styles.input}
            placeholder="Destination"
            value={destination}
            onChangeText={setDestination}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleGetDirections}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "solid",
  },
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
  modalView: {
    marginTop: "30%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
