import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  // Header styling
  taskView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center'
    
  },
  profileView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userProfile: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  details: {
    paddingLeft: 15
  },
  mesText: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    fontFamily: Fonts.BOLD
  },
  taskText: {
    color: Colors.text,
    fontWeight: '500',
    fontFamily: Fonts.MEDIUM
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  
  // Main content container
  mainContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    backgroundColor: Colors.background,
    paddingTop: 5,
    marginTop: -22,
    overflow: 'visible' // Keep this as visible
  },
  contentContainer: {
    overflow: 'visible' // Changed from default to explicitly visible
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    fontFamily: Fonts.MEDIUM,
  },
  
  // Calendar styling
  calendarContainer: {
    borderRadius: 15,
    overflow: 'visible',
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 2,
    backgroundColor: Colors.card,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  monthNavButton: {
    padding: 10,
  },
  monthYearText: {
    fontSize: 19,
    fontWeight:'700',
    color: Colors.card_title,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  weekViewContainer: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    overflow: 'visible'
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    paddingBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.card_description,
    width: 40,
    textAlign: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 3,
    overflow: 'visible'
  },
  calendarDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthDayText: {
    color: Colors.text_alt,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
  },
  calendarDayText: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: Colors.text_alt,
  },
  selectedDayText: {
    color: Colors.text_alt,
    fontWeight: '800',
    fontFamily: Fonts.BOLD,
  },
  taskIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4757',
    alignSelf: 'center',
    marginTop: 2,
  },
  monthViewContainer: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    overflow: 'visible'
  },
  calendarGrid: {
    marginTop: 3,
    paddingHorizontal: 15,
    overflow: 'visible'
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    overflow: 'visible'
  },
  
  // Task section styling
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.BOLD,
    color: Colors.card_title,
    marginBottom: 15,
  },
  emptyTaskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTaskText: {
    marginTop: 100,
    fontSize: 18,
    fontFamily: Fonts.MEDIUM,
    color: Colors.text_empty,
  },
  
  // Task card styling (similar to Home.js)
  taskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16, // Increased from 12 to create more space for shadows
    marginHorizontal: 4, // Added horizontal margin to ensure shadow visibility
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Keep elevation
    zIndex: 1, // Keep zIndex
  },
  priorityIndicator: {
    width: 6,
    height: '100%',
  },
  taskContent: {
    flex: 1,
    padding: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: '#57606F',
    marginBottom: 8,
  },
  subGoalsContainer: {
    marginVertical: 8,
  },
  subGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxTick: {
    width: 14,
    height: 14,
    backgroundColor: '#4CAF50',
  },
  subGoalText: {
    fontSize: 17,
    fontFamily: Fonts.REGULAR,
    color: Colors.text_alt,
    flex: 1,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  taskMetaText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.card_description,
    marginLeft: 5,
  },
  
  // FAB styling
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2ED573',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  taskTitleContainer: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 19,
    marginBottom: 5,
    alignSelf: 'flex-start', // Only take as much width as needed
  },
  // Add to TaskStyle.js
headerSearchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  marginRight: 10,
},
searchInputWrapper: {
  height: 36,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 18,
  paddingHorizontal: 12,
  flex: 1,
},
headerSearchInput: {
  flex: 1,
  color: 'white',
  marginLeft: 8,
  fontSize: 15,
  height: 36,
  paddingVertical: 0,
},
clearSearch: {
  marginLeft: 8,
},
searchResultsContainer: {
  marginBottom: 20,
},
});