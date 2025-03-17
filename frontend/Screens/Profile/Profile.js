import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { notificationImg, UserProfile } from '../../theme/Images';
import { styles } from './Style/ProfileStyle';

export default function Profile() {
  // Fields
  const [name, setName] = useState('Quach Khoa Hien');
  const [company, setCompany] = useState('CTU');
  const [email, setEmail] = useState('email@mail.com');

  // Focus states to highlight input on tap
  const [nameFocused, setNameFocused] = useState(false);
  const [companyFocused, setCompanyFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  // Toggles
  const [enable1, setEnable1] = useState(true);
  const [enable2, setEnable2] = useState(true);
  const [enable3, setEnable3] = useState(true);
  const [enable4, setEnable4] = useState(true);

  return (
    <View style={styles.inboxContiner}>
      {/* Top Header with Profile & Notification */}
      <View style={styles.inboxView}>
        <View style={styles.profileView}>
          <Image source={UserProfile} style={styles.userProfileImg} />
          <View style={styles.details}>
            <Text style={styles.mesText}>Profile Details</Text>
            <Text style={styles.tasksText}>Quach Khoa Hien</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image source={notificationImg} style={styles.notiImg} />
        </TouchableOpacity>
      </View>

      {/* Main Container for Inputs & Toggles */}
      <View style={styles.mainProfileContainer}>
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          style={[styles.input, nameFocused && styles.inputFocused]}
        />

        {/* Company/School */}
        <Text style={styles.label}>Company/School</Text>
        <TextInput
          value={company}
          onChangeText={setCompany}
          onFocus={() => setCompanyFocused(true)}
          onBlur={() => setCompanyFocused(false)}
          style={[styles.input, companyFocused && styles.inputFocused]}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={[styles.input, emailFocused && styles.inputFocused]}
          keyboardType="email-address"
        />

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Enable</Text>
          <Switch value={enable1} onValueChange={setEnable1} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Enable</Text>
          <Switch value={enable2} onValueChange={setEnable2} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Enable</Text>
          <Switch value={enable3} onValueChange={setEnable3} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Enable</Text>
          <Switch value={enable4} onValueChange={setEnable4} />
        </View>
      </View>
    </View>
  );
}
