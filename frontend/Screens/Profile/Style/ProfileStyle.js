import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';

export const styles = StyleSheet.create({
  // Existing styles remain the same...
  inboxContiner: {
    flex: 1,
  },
  inboxView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileView: {
    flexDirection: 'row',
  },
  details: {
    paddingLeft: 15,
  },
  userProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notiImg: {
    width: 25,
    height: 25,
  },
  tasksText: {
    color: 'white',
    fontFamily: Fonts.MEDIUM,
  },
  mesText: {
    fontSize: 20,
    fontFamily: Fonts.BOLD,
    color: 'white',
  },
  mainProfileContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 20,
  },

  // New label and input styles
  label: {
    fontFamily: Fonts.MEDIUM,
    color: '#333',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 5,
  },
  inputFocused: {
    backgroundColor: '#ffffff',
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
});
