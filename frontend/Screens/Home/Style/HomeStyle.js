import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  
  // Header styles
  header: {
    height: 100, // Set a fixed height
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2ED573',
    padding: 16,
    paddingTop: 30,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileText: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header search styles 
  headerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  searchInputWrapper: {
    height: 36, // Set a consistent height
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    paddingHorizontal: 12, // Smaller horizontal padding
    flex: 1,
  },
  headerSearchInput: {
    flex: 1,
    color: 'white',
    marginLeft: 8,
    fontSize: 15, // Slightly smaller font
    height: 36, // Match container height
    paddingVertical: 0, // Remove vertical padding
  },
  clearSearch: {
    marginLeft: 8,
  },
  searchResultsContainer: {
    marginBottom: 20,
  },
  
  // Scroll container
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  
  // Card styles (common)
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F3542',
    marginBottom: 16,
  },
  upcomingTitle: {
    marginTop: 24,
  },
  
  // Progress section
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F4F6FA',
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ED573',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#57606F',
    textAlign: 'center',
  },
  
  // Task card
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F3542',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#57606F',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 12,
    color: '#57606F',
    marginLeft: 4,
    marginRight: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskMetaText: {
    fontSize: 12,
    color: '#57606F',
    marginLeft: 4,
  },
  
  // Upcoming task cards
  upcomingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingContent: {
    flex: 1,
    marginRight: 12,
  },
  upcomingDate: {
    fontSize: 12,
    color: '#57606F',
    marginBottom: 4,
  },
  upcomingTaskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F3542',
  },
  upcomingPriority: {
    width: 8,
    height: 40,
    borderRadius: 4,
  },
  
  // Empty states and loaders
  emptyText: {
    fontSize: 16,
    color: '#A4B0BE',
    textAlign: 'center',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  loader: {
    marginVertical: 20,
  },
  
  // Floating action button
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});