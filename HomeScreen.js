// HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual key

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- simulate login state
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const services = [
    { id: '1', name: 'Salon for women', image: require('./assets/images/salonwomen.jpg') },
    { id: '2', name: 'Salon Prime for kids & men', image: require('./assets/images/salon_men.jpg') },
    { id: '3', name: 'AC & Appliance Repair', image: require('./assets/images/ac_appliance.jpg') },
    { id: '4', name: 'Cleaning', image: require('./assets/images/cleaning.jpg') },
    { id: '5', name: 'Electrician, Plumber & Carpenter', image: require('./assets/images/plumber.jpg') },
    { id: '6', name: 'Pest Control', image: require('./assets/images/pestcontrol.jpg') },
  ];

  const topCategories = [
    { id: '1', title: 'Ac-appliances', image: require('./assets/images/ac_appliance.jpg') },
    { id: '2', title: 'Technicians', image: require('./assets/images/technician.jpg') },
    { id: '3', title: 'Salon', image: require('./assets/images/salon_men.jpg') },
    { id: '4', title: 'Pest Control', image: require('./assets/images/pestcontrol.jpg') },
  ];

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation('Permission denied');
          setLocationLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
        );

        const address = response.data.results[0]?.formatted_address;
        setLocation(address || 'Unknown Location');
      } catch (error) {
        console.error('Location error:', error.message);
        setLocation('Error fetching location');
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % services.length;
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (flatListRef.current && services.length > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [currentIndex]);

  const handleLoginPress = () => {
    setShowDropdown(false);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image source={require('./assets/images/homecare.jpg')} style={styles.logo} />
            <Text style={styles.appName}>HomeCare</Text>
            <View>
              <TouchableOpacity style={styles.iconButton} onPress={() => setShowDropdown(!showDropdown)}>
                <Text style={styles.icon}>👤</Text>
              </TouchableOpacity>
              {showDropdown && (
                <View style={styles.dropdownMenu}>
                  {isLoggedIn ? (
                    <>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('Profile')}>
                        <Text style={styles.dropdownText}>Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('Bookings')}>
                        <Text style={styles.dropdownText}>My Bookings</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => setIsLoggedIn(false)}>
                        <Text style={styles.dropdownText}>Logout</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity style={styles.dropdownItem} onPress={handleLoginPress}>
                      <Text style={styles.dropdownText}>Login</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
          <Text style={styles.address}>
            {locationLoading ? <ActivityIndicator size="large" color="#007bff" /> : location}
          </Text>
        </View>

        {/* Carousel, Services and Top Categories - unchanged */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Home Services at Your Doorsteps</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllCategories')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={services}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.categoryCard, { width: Dimensions.get('window').width - 40 }]}>
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.name}</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />

        <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Top Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 10, paddingHorizontal: 10 }}
        >
          {topCategories.map((item) => (
            <View key={item.id} style={styles.categoryCard}>
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.title}</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreText}>Explore</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // same as your current styles, unchanged
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 50, height: 50, borderRadius: 25 },
  appName: { fontSize: 24, fontWeight: 'bold', flex: 1, marginLeft: 10 },
  iconButton: { marginHorizontal: 5 },
  icon: { fontSize: 22 },
  address: { marginTop: 10, fontSize: 14, color: '#666' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  viewAll: { fontSize: 14, color: '#007bff' },
  categoryCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  categoryImage: {
    width: 90,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: { textAlign: 'center', marginBottom: 8, fontWeight: '600', fontSize: 13 },
  exploreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  exploreText: { color: 'white', fontSize: 12 },
  dropdownMenu: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    width: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 24 },
  navLabel: { fontSize: 12 },
});
