import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme'; // Adjust import paths as needed

export const styles = StyleSheet.create({
  /** Root container */
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  /** Header bar */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backArrow: {
    width: 10,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: Fonts.BOLD,
    marginLeft: 20, // Adjust for spacing
  },

  /** Wrapper for each input block */
  inputWrapper: {
    marginHorizontal: 20,
    marginTop: 15,
    // color: 'black',
  },
  label: {
    fontSize: 13,
    color: 'black',
    fontFamily: Fonts.BOLD,
  },

  /** Text inputs */
  textInput: {
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
  },

  /** Picker styling */
  pickerContainer: {
    backgroundColor: "#D3D3D3",
    paddingHorizontal: 10,
    paddingVertical: 5, 
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  picker: {
    height: 60,
    width: '100%',
  },

  /** Date picker row */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  calendarIcon: {
    width: 25,
    height: 25,
  },

  /** Sub-goal row display */
  subGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  subGoalText: {
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
  },
  removeSubGoalText: {
    fontSize: 14,
    color: 'red',
    fontFamily: Fonts.BOLD,
  },

  /** Row for adding a new sub-goal */
  subGoalInputRow: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addSubGoalBtn: {
    backgroundColor: Colors.primary,
    marginLeft: 10,
    padding: 10,
    borderRadius: 8,
  },
  addSubGoalBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: Fonts.BOLD,
  },

  /** Create Task button */
  createBtn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    marginHorizontal: 20,
  },
  createBtnText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: Fonts.MEDIUM,
    fontSize: 16,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  priorityPickerContainer: {
    flex: 1,
    backgroundColor: "#D3D3D3",
    // paddingVertical: 5,
    borderRadius: 5,
  },
  priorityPicker: {
    height: 60,
    width: '100%',
    paddingVertical: 5,
  },
  priorityColorBox: {
    width: 60,
    height: 60,
    marginLeft: 10,
    borderRadius: 8,
  },
  
});
