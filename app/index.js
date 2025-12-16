import { Stack } from "expo-router";
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchLocations, fetchWeatherForecast } from '../api/weather.js';


export default function index() {
  const [showSearch, toggleSearch] = useState(false)
  const [locations, setLocations] = useState([])
  const [weather, setWeather] = useState({})
  const [loading, setLoading] = useState(true)

  const handlelocations = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({ cityName: loc.name, days: '7' 
    }).then(data => {
      setWeather(data);
      setLoading(false);
    })
  }
  const handleSearch = value => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then(data => {
        setLocations(data)
      })
    }
  }

  useEffect(() => {
    fetchMyWeatherData();
  }, []);
 
  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: 'karachi',
      days: '7'
    }).then(data => {
      setWeather(data)
      setLoading(false);
    })
  }

  const handleTextRebounce = useCallback(debounce(handleSearch, 800), [])

  const { current, location } = weather;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 items-center justify-center bg-white">
        <Image blurRadius={40} source={require("../assets/images/3.jpg")}
          className="absolute h-full w-full" />
        {
          loading ? (
            <View className="flex-1 flex-row justify-center items-center">
           <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2"/>
            </View>
           ) : (
            <SafeAreaView className="flex-1 flex">
              <View className="mx-4 relative z-50 ">
                <View className="items-center w-full mt-2">
                  <View className={`flex-row items-center rounded-full px-6 py-2`}
                    style={{
                      backgroundColor: showSearch ? "rgba(255,255,255,0.25)" : 'transparent', borderRadius: 25, overflow: "hidden"
                    }} >
                    {showSearch ? (
                      <TextInput
                        onChangeText={handleTextRebounce}
                        placeholder="Search City"
                        placeholderTextColor="#A89F91"
                        className="flex-1 text-white pl-2"
                      />
                    ) : (
                      <View className="flex-1" />
                    )}

                    <TouchableOpacity
                      onPress={() => toggleSearch(!showSearch)}
                      className="rounded-full p-2"
                      style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                    >
                      <MagnifyingGlassIcon size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {
                  locations.length > 0 && showSearch ? (
                    <View className="absolute w-full bg-gray-300 top-20 rounded-3xl" >
                      {
                        locations.map((loc, index) => {
                          let showborder = index + 1 != locations.length;
                          let borderClass = showborder ? ' border-b-2  border-b-gray-400' : '';
                          return (
                            <TouchableOpacity
                              onPress={() => handlelocations(loc)}
                              key={index}
                              className={"flex-row items-center border-0 p-3 px-4 mb-1" + borderClass}>
                              <MapPinIcon size={20} color="grey" />
                              <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                  ) : null
                }
              </View>
              {/* {forcast section} */}
              <View className="mx-4 flex justify-around flex-1 mb-2">
                {/* {location details} */}
                <Text className="text-white text-center text-3xl font-bold">{location?.name + ","}
                  <Text className="text-lg text-gray-400 font-semibold"> {"" + location?.country}</Text>
                </Text>
                {/* {weather image} */}
                <View className="flex-row justify-center">
                  <Image source={{ uri: 'https:' + current?.condition?.icon }}
                    //source={require('../assets/images/partlycloudy.png')} 
                    className="w-52 h-52" />
                </View>
                <View className="space-y-2">
                  <Text className="text-center fontbold text-white text-7xl ml-5"> {current?.temp_c}&#176;</Text>
                  <Text className="text-center fontbold text-white text-xl ml-5"> {current?.condition?.text}</Text>
                </View>

                {/* {other stats} */}

                <View className="flex-row justify-between mx-4">
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/images/wind.png')} className="w-6 h-6" />
                    <Text className="text-white pl-2 font-semibold text-base"> {current?.wind_kph}kph </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/images/drop.png')} className="w-6 h-6" />
                    <Text className="text-white pl-2 font-semibold text-base"> {current?.humidity}% </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/images/sun.png')} className="w-6 h-6" />
                    <Text className="text-white pl-2 font-semibold text-base"> {weather?.forecast?.forecastday[0]?.astro?.sunrise} </Text>
                  </View>
                </View>
                {/* {forecast section for the next days} */}
                <View className="mb-4 space-y-2">
                  <View className="flex-row items-center mx-5 pb-4">
                    <CalendarDaysIcon size={22} color="white"></CalendarDaysIcon>
                    <Text className="text-white text-base"> Daily Forescast</Text>
                  </View>
                  <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 15 }} showsHorizontalScrollIndicator={false}>

                    {
                      weather?.forecast?.forecastday?.map((items, index) => {
                        let date = new Date(items.date);
                        let options = { weekday: 'long' }
                        let dayName = date.toLocaleDateString('en-US', options)

                        return (
                          <View key={index}
                            className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-3"
                            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                            <Image source={{ uri: 'https:' + items?.day?.conditon?.icon }}
                              //source={require("../assets/images/heavyrain.png")} 
                              className="h-12 w-12"></Image>
                            <Text className="text-white "> {dayName}</Text>
                            <Text className="text-white text-xl font-semibold"> {items.day.avgtemp_c}&#176;</Text>
                          </View>
                        )
                      })
                    }
                  </ScrollView>
                </View>
              </View>
            </SafeAreaView>

            )
        }

      </View>

    </>
  );
}