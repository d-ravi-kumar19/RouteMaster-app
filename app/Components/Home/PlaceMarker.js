import { View } from 'react-native';
import React from 'react';
import { Marker } from 'react-native-maps';
import CustomMarker from './CustomMarker'; // Make sure to import your CustomMarker

export default function PlaceMarker({ item }) {
  return (
    <Marker 
      title={item.name} 
      coordinate={{
        latitude: item.geometry.location.lat,
        longitude: item.geometry.location.lng,
      }}
    >
      <CustomMarker rotation={0} /> {/* You can pass the rotation if needed */}
    </Marker>
  );
}
