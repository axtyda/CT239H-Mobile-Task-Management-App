import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';

export const styles = StyleSheet.create({
  // Overall container
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // so the top area is green
  },

  // Green header at the top
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileText: {
    marginLeft: 10,
  },
  profileTitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: Fonts.BOLD,
  },
  profileName: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Fonts.MEDIUM,
  },
  notiImg: {
    width: 25,
    height: 25,
  },

  // White container for the rest of the screen
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10, // slightly overlap the green header
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // Today Completion
  todayCompletionCard: {
    backgroundColor: '#c8facc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  todayCompletionTitle: {
    fontSize: 16,
    color: '#000',
    fontFamily: Fonts.BOLD,
    marginBottom: 10,
  },
  progressBarContainer: {
    position: 'relative',
    marginTop: 5,
  },
  progressBarOuter: {
    width: '100%',
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  percentLabel: {
    position: 'absolute',
    right: 0,
    top: -18,
    fontSize: 14,
    fontFamily: Fonts.BOLD,
    color: '#000',
  },

  // Upcoming Tasks
  upComings: {
    marginBottom: 20,
  },
  upcoingText: {
    fontSize: 18,
    color: 'black',
    fontFamily: Fonts.BOLD,
    marginBottom: 10,
  },

  /**
   * MINIMAL CHANGES for Upcoming Task Layout
   */
  upcomingTaskContainer: {
    // REMOVED flexDirection: 'row'
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    width: 180,
  },
  // New row style for top row (Task Name left + Circle right)
  upcomingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  // Emptied out so they don't affect layout
  upcomingCircleCategory: {},
  upcomingTextContainer: {},

  categoryCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  taskName: {
    fontSize: 14,
    fontFamily: Fonts.BOLD,
    marginBottom: 5,
  },
  taskDetails: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
  },
  statusBarContainer: {
    height: 4,
    backgroundColor: '#ccc',
    marginTop: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  statusBar: {
    height: '100%',
  },

  // All Tasks
  taskListView: {
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
    marginVertical: 5,
  },
  filterText: {
    color: 'black',
    fontFamily: Fonts.MEDIUM,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  activeFilterText: {
    color: '#fff',
    fontFamily: Fonts.MEDIUM,
  },

  // Individual Task Cards in All Task
  allTaskContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  leftColorBar: {
    width: 17,
    backgroundColor: 'red', // replaced dynamically
  },
  allTaskContent: {
    flex: 1,
    padding: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, // small spacing below the row
  },
  taskStatus: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM, // or 'bold' if you prefer
  },
  filterScrollView: {
    marginBottom: 10, // Adds space below the filter row
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // remove flexWrap: 'wrap'
    // remove justifyContent: 'space-around'
    // you can add spacing if you want, e.g., paddingHorizontal: 5
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
    marginRight: 10, // add space between buttons
  },
  filterText: {
    color: 'black',
    fontFamily: Fonts.MEDIUM,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  activeFilterText: {
    color: '#fff',
    fontFamily: Fonts.MEDIUM,
  },
});
