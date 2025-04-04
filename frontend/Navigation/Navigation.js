"use client"

import { Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../Screens/Home/Home"
import Task from "../Screens/Task/Task"
import Profile from "../Screens/Profile/Profile"
import { HomeImg, TaskImg, ProfileImg } from "../theme/Images"
import { useTheme } from "../ThemeContext"

const Tab = createBottomTabNavigator()

const CustomTabIcon = ({ source, focused }) => {
  const { colors } = useTheme()
  return (
    <Image
      source={source}
      style={{
        width: 24,
        height: 24,
        tintColor: focused ? colors.tab_bar_active : colors.tab_bar_unactive,
      }}
    />
  )
}

export default function Navigation() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tab_bar_active,
        tabBarInactiveTintColor: colors.tab_bar_unactive,
        tabBarStyle: {
          paddingBottom: 10,
          height: 60,
          backgroundColor: colors.tab_bar_background,
          borderColor: colors.tab_bar_background,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => <CustomTabIcon source={HomeImg} focused={focused} />,
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Task"
        component={Task}
        options={{
          tabBarIcon: ({ focused }) => <CustomTabIcon source={TaskImg} focused={focused} />,
          tabBarLabel: "Task",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => <CustomTabIcon source={ProfileImg} focused={focused} />,
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  )
}

