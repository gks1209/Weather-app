// import React, { useState, useEffect } from 'react';
// import * as Location from "expo-location";
// import { View, Text, Dimensions, ActivityIndicator, StyleSheet, StatusBar, ScrollView } from 'react-native';

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const API_KEY = "f7c2db316ec3566e622a85ccbc04c81c"; //OpenWeather_ApiKey
// //f7c2db316ec3566e622a85ccbc04c81c

// export default function App() {
//   const [city, setCity] = useState("Loading..")
//   const [days, setDays] = useState([]);
//   const [ok, setOk] = useState(true);
//   const getWeather = async() => {

//     //위치 권한 요청
//     const {granted} = await Location.requestForegroundPermissionsAsync();
//       if(!granted){
//         setOk(false);  
//       }

//     //현재 위치 가져오기
//     const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
//     const location = await Location.reverseGeocodeAsync(
//       {latitude, longitude}, 
//       {useGoogleMaps:false}
//     );
//     setCity(location[0].city);

//     //날씨 데이터 요청
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&appid=${API_KEY}`) //https://api.openweathermap.org/data/2.5/weather?q=Incheon&appid=f7c2db316ec3566e622a85ccbc04c81c
//     const json = await response.json(); 

//     console.log(json); //전체 응답 로그 출력

//     if (Array.isArray(json.daily)) { //응답이 배열인지 확인
//       setDays(json.daily);
//     } else {
//       console.error("Error: Expected daily weather data to be an array.");
//       setDays([]); //배열이 아닐 경우 빈 배열로 설정
//     }
//   };
//   useEffect(()=> {
//     getWeather();
//   }, []);
//   return (
//   <View style={ styles.container }>
//     <StatusBar barStyle="dark-content"/>
//     <View style={ styles.city }>
//       <Text style={ styles.cityName }>{city}</Text>
//     </View>
//     <ScrollView 
//       pagingEnabled
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       contentContainerStyle = {styles.weather}
//       >
//         {days && days.length === 0 ? (
//           <View style = {styles.day}>
//             <ActivityIndicator color="white" style = {{marginTop:10}} size = "large" />
//           </View>
//         ) : (
//           days.map((day, index) =>
//             <View key = {index} style={styles.day}>
//               <Text style={styles.temp}>{day.temp.day}</Text>
//               <Text style={styles.description}>{day.weather[0].main}</Text>
//             </View>)
//       )}
//       </ScrollView>
//     </View>
//   );
// }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1, 
//       backgroundColor: "tomato",
//     },
//     city: {
//       flex :1,
//       justifyContent:"center",
//       alignItems:"center",
//     },
//     cityName: {
//       color: "black",
//       fontSize : 68,
//       fontWeight : "500",
//     },
//     weather: {
//     },
//     day: { 
//       width: SCREEN_WIDTH,
//       alignItems: "center",
//     },
//     temp: {
//       marginTop: 50,
//       fontSize: 178,
//     },
//     description: {
//       marginTop: -30,
//       fontSize: 60,
//     }
//   });

import React, { useState, useEffect } from 'react';
import * as Location from "expo-location";
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, StatusBar, ScrollView } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "71bf7276f48b4597a9a4d6d506a17115"; 
export default function App() {
  const [city, setCity] = useState("Loading..");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setOk(false);
        return;
      }
      const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
      setCity(location[0].city);

      // Weatherbit API를 사용하여 7일간의 일일 예보 데이터를 요청합니다.
      const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&days=7&units=M&key=${API_KEY}`);
      const json = await response.json();

      console.log(json); // 응답 전체를 콘솔에 출력하여 확인

      if (Array.isArray(json.data)) {
        setDays(json.data);
      } else {
        console.error("Error: Expected daily weather data to be an array.");
        setDays([]);
      }
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setDays([]);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{day.temp}°C</Text>
              <Text style={styles.description}>{day.weather.description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    marginBottom: 30,
    fontSize: 100,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
});
