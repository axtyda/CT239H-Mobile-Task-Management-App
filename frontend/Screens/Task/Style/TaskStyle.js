import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { calendarHeight } from '../Task'

export const styles = StyleSheet.create({
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
    fontSize: 20,
    color: 'white',
    fontFamily: Fonts.BOLD
  },
  taskText: {
    color: 'white',
    fontFamily: Fonts.MEDIUM
  },
  notiImg: {
    width: 25,
    height: 25
  },
  calenderView: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    marginTop: -20
  },
  mainCalenderView: {
    flex: 1,
    padding: 20
  },
  stickyCircle: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    borderRadius: 25
  },
  addImg: {
    width: 60,
    height: 60,
    borderRadius: 25
  },
  taskPillContainer: {
    // overflow: 'hidden',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // alignItems: 'stretch'
  },
  taskContentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    // paddingRight: 10,
    // backgroundColor: 'white',
    // minHeight: 100,
  },
  taskInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'green',
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
  },
  taskDescription: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: Colors.textSecondary || '#555',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#2222',
    minWidth: 200,
    alignItems: 'center',
  },
  subGoalsContainer: {
    marginTop: 5,
    blackgroundColor: 'blue',
  },
  subGoalText: {
    fontSize: 15,
    fontFamily: Fonts.REGULAR,
    color: '#777',
    backgroundColor: 'blue'
  },
  taskTime: {
    fontSize: 14,
    fontFamily: Fonts.BOLD,
    color: "#444",
  },
  taskDate: {
    marginRight: 5,
    fontSize: 13,
    fontFamily: Fonts.BOLD,
    color: '#555' || '#555'
  },
  
  // Custom Calendar Styles
  customCalendar: {
    backgroundColor: 'white',
    // borderRadius: 15,
    // overflow: 'hidden',
    // marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeaderContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: 'center',
  },
  calendarToggle: {
    paddingVertical: 10,
    // height: 100
  },
  weekViewContainer: {
    paddingHorizontal: 5,
    paddingBottom: 15,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    paddingBottom: 10,
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
    color: Colors.textSecondary || '#777',
    width: 40,
    textAlign: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 3,
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
    opacity: 0.4,
  },
  otherMonthDayText: {
    color: Colors.textSecondary || '#aaa',
  },
  selectedDay: {
    backgroundColor: Colors.primary || '#20bf55',
  },
  calendarDayText: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: Colors.textPrimary || '#333',
  },
  selectedDayText: {
    color: 'white',
    fontFamily: Fonts.BOLD,
  },
  taskIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary || '#20bf55',
    position: 'absolute',
    bottom: 6,
  },
  monthViewContainer: {
    paddingHorizontal: 5,
    paddingBottom: 15,
  },
  monthYearText: {
    fontSize: 16,
    fontFamily: Fonts.BOLD,
    color: Colors.textPrimary || '#333',
    textAlign: 'center',
  },
  calendarGrid: {
    marginTop: 3,
    paddingHorizontal: 15,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskListContainer: {
    flex: 1,
    paddingTop: 10,
    borderRadius: 20,
    backgroundColor: '#1111',
    overflow: 'hidden',
  },
  emptyTaskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 30,
  },
  emptyTaskText: {
    fontSize: 16,
    fontFamily: Fonts.MEDIUM,
    color: Colors.textSecondary || '#777',
  },
  calendarContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: 'white',
    // optional shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 10,
    // height: calendarHeight
  },
  downArrowIcon: {
    position: 'absolute',
    right: 15,
    bottom: 5, // or top: 5, whichever you prefer
  },
  scrollContent: {
    paddingBottom: 40, // Space for FAB button
    gap: 8, // Space between items
  },
});