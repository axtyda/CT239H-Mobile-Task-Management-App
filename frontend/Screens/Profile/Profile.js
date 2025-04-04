"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, TextInput, Switch, Alert } from "react-native"
import { notificationImg, UserProfile } from "../../theme/Images"
import { styles } from "./Style/ProfileStyle"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "../../ThemeContext"

// User data storage key
const USER_DATA_KEY = "@user_data"

export default function Profile() {
  // Get theme context
  const { isDarkMode, toggleTheme, colors } = useTheme()

  // Fields
  const [name, setName] = useState("Quach Khoa Hien")
  const [company, setCompany] = useState("CTU")
  const [email, setEmail] = useState("email@mail.com")

  // Focus states to highlight input on tap
  const [nameFocused, setNameFocused] = useState(false)
  const [companyFocused, setCompanyFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

  // Other toggles
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableSounds, setEnableSounds] = useState(true)
  const [enableVibration, setEnableVibration] = useState(true)

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem(USER_DATA_KEY)
        if (userData) {
          const parsedData = JSON.parse(userData)
          setName(parsedData.name || "Quach Khoa Hien")
          setCompany(parsedData.company || "CTU")
          setEmail(parsedData.email || "email@mail.com")
          setEnableNotifications(parsedData.enableNotifications !== undefined ? parsedData.enableNotifications : true)
          setEnableSounds(parsedData.enableSounds !== undefined ? parsedData.enableSounds : true)
          setEnableVibration(parsedData.enableVibration !== undefined ? parsedData.enableVibration : true)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    loadUserData()
  }, [])

  // Save user data when it changes
  const saveUserData = async () => {
    try {
      const userData = {
        name,
        company,
        email,
        enableNotifications,
        enableSounds,
        enableVibration,
      }
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
      Alert.alert("Success", "Profile information saved successfully!")
    } catch (error) {
      console.error("Error saving user data:", error)
      Alert.alert("Error", "Failed to save profile information.")
    }
  }

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
    },
    input: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      color: colors.text_alt,
    },
    inputFocused: {
      backgroundColor: isDarkMode ? colors.card : "#ffffff",
      borderColor: colors.primary,
    },
    label: {
      color: colors.text_alt,
    },
  }

  return (
    <View style={[styles.inboxContiner, dynamicStyles.container]}>
      {/* Top Header with Profile & Notification */}
      <View style={[styles.inboxView, dynamicStyles.header]}>
        <View style={styles.profileView}>
          <Image source={UserProfile} style={styles.userProfileImg} />
          <View style={styles.details}>
            <Text style={styles.tasksText}>Profile Details</Text>
            <Text style={styles.mesText}>{name}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image source={notificationImg} style={[styles.notiImg, { tintColor: colors.text }]} />
        </TouchableOpacity>
      </View>

      {/* Main Container for Inputs & Toggles */}
      <View style={[styles.mainProfileContainer, dynamicStyles.container]}>
        {/* Name */}
        <Text style={[styles.label, dynamicStyles.label]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          style={[styles.input, dynamicStyles.input, nameFocused && dynamicStyles.inputFocused]}
        />

        {/* Company/School */}
        <Text style={[styles.label, dynamicStyles.label]}>Company/School</Text>
        <TextInput
          value={company}
          onChangeText={setCompany}
          onFocus={() => setCompanyFocused(true)}
          onBlur={() => setCompanyFocused(false)}
          style={[styles.input, dynamicStyles.input, companyFocused && dynamicStyles.inputFocused]}
        />

        {/* Email */}
        <Text style={[styles.label, dynamicStyles.label]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={[styles.input, dynamicStyles.input, emailFocused && dynamicStyles.inputFocused]}
          keyboardType="email-address"
        />

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <Text style={[styles.label, dynamicStyles.label]}>Dark mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#D3D3D3", true: "#2ED573" }}
            thumbColor={"#FFFFFF"}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.label, dynamicStyles.label]}>Enable Notifications</Text>
          <Switch
            value={enableNotifications}
            onValueChange={setEnableNotifications}
            trackColor={{ false: "#D3D3D3", true: "#2ED573" }}
            thumbColor={"#FFFFFF"}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.label, dynamicStyles.label]}>Enable Sounds</Text>
          <Switch
            value={enableSounds}
            onValueChange={setEnableSounds}
            trackColor={{ false: "#D3D3D3", true: "#2ED573" }}
            thumbColor={"#FFFFFF"}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.label, dynamicStyles.label]}>Enable Vibration</Text>
          <Switch
            value={enableVibration}
            onValueChange={setEnableVibration}
            trackColor={{ false: "#D3D3D3", true: "#2ED573" }}
            thumbColor={"#FFFFFF"}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={saveUserData}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

