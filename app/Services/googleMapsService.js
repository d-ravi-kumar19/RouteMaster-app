import Constants from 'expo-constants';

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY || "your_default_api_key";


export const getDirections = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}&traffic_model=best_guess&departure_time=now`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            return data.routes; // This returns an array of route objects
        } else {
            console.error('Error fetching directions:', data.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching directions:', error);
        return null;
    }
};

export const getGeocode = async (locationName) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('Location not found');
        }

        return data.results[0].geometry.location; // Return the location object
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Error fetching location');
    }
};
