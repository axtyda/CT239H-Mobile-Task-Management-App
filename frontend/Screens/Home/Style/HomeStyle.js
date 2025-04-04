import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor:Colors.primary,
  },
  
  // Header styles - modified for stability
  header: {
    height: 100, // Fixed height to prevent layout shifts
    backgroundColor: Colors.primary,
    paddingTop: 30,
    paddingBottom: 40,
  },
  
  // New headerContent style for better layout control
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: '100%', // Fill the header height
  },
  
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Take most of the space
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
    fontSize: 21,
    fontWeight: 'bold',
    fontFamily: Fonts.BOLD,
    color: 'white',
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Always maintain spacing
  },
  
  // Header search styles 
  headerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Take up the same space as profileSection
  },
  searchInputWrapper: {
    height: 36, // Fixed height
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 103, 103, 0.2)',
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
    padding: 4, // Larger tap target
  },
  searchResultsContainer: {
    marginBottom: 20,
  },
  
  // Main content container - the white overlay
  mainContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor:Colors.background,
    paddingVertical: 8,
    marginTop: -12,
  },
  
  // Scroll container
  scrollContainer: {
    padding: 20,
    paddingTop: 25,
    paddingBottom: 100,
  },
  
  // Card styles (common)
  card: {
    backgroundColor:Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor:Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color:Colors.card_title,
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
    color:Colors.progressbartext,
    textAlign: 'center',
  },
  
  // Task card
  taskCard: {
    backgroundColor:Colors.card,
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 13,
    alignItems: 'center',
    shadowColor:Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // New style for title containers with priority color
  taskTitleContainer: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 19,
    marginBottom: 5,
    alignSelf: 'flex-start', // Only take as much width as needed
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 14,
    color:Colors.card_description,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 14,
    fontWeight: '600',
    color:Colors.card_description,
    marginLeft: 4,
    marginRight: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskMetaText: {
    fontSize: 14,
    fontWeight: '600',
    color:Colors.card_description,
    marginLeft: 4,
  },
  
  // Upcoming task cards
  upcomingCard: {
    backgroundColor:Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor:Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingDate: {
    fontSize: 12,
    color:Colors.card_description,
    marginBottom: 4,
  },
  // New styled container for upcoming task titles with priority color
  upcomingTitleContainer: {
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start', // Only take as much width as needed
  },
  upcomingTaskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Empty states and loaders
  emptyText: {
    fontSize: 16,
    color: Colors.text_empty,
    textAlign: 'center',
    marginVertical: 20,
    backgroundColor:Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
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
    backgroundColor:Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor:Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});