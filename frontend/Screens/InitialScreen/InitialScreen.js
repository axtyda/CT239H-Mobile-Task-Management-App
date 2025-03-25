import React from 'react'
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native'
import { InitialScreenStyle } from './Style/InitialScreenStyle'
import { WelcomeImg } from '../../theme/Images'

export default function InitialScreen({navigation}) {
  const goToHome = () => {
    navigation.navigate("MainNavigation")
  }
  return (
    <>
      <StatusBar backgroundColor="#20bf55" />
      <View style={InitialScreenStyle.container}>
        <View style={InitialScreenStyle.mainContainer}>
          <View>
            <Image source={WelcomeImg} style={InitialScreenStyle.img} />
            <View>
              <Text style={InitialScreenStyle.text}> A Task manager you cannot trust</Text>
              <Text style={InitialScreenStyle.textSub}> A workspace for 1 single person</Text>
            </View>
          </View>
          <TouchableOpacity style={InitialScreenStyle.btn} onPress={goToHome}> 
            <Text style={InitialScreenStyle.btnText}>Get Started!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}