import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';

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
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 8,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center'
  },
  taskContentContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  taskInfoContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: Colors.textPrimary || '#000'
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: Colors.textSecondary || '#555'
  },
  subGoalsContainer: {
    marginTop: 5,
  },
  subGoalText: {
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: '#777'
  },
  taskTime: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: Colors.textPrimary || '#000'
  },
  taskDate: {
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: Colors.textSecondary || '#555'
  },
});
