"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput } from "react-native"
import { useIsFocused } from "@react-navigation/native"
import dayjs from "dayjs"
import { styles } from "./Style/HomeStyle"
import TaskService from "../../taskService"
import Icon from "react-native-vector-icons/MaterialIcons"
import { UserProfile } from "../../theme/Images"
import { useTheme } from "../../ThemeContext"

const HomeScreen = ({ navigation }) => {
  // Get theme context
  const { colors, isDarkMode } = useTheme()

  // State management
  const [allTasks, setAllTasks] = useState([])
  const [todayTasks, setTodayTasks] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const isFocused = useIsFocused()
  const searchInputRef = useRef(null)

  // Fetch tasks when screen is focused
  useEffect(() => {
    if (isFocused) fetchTasks()
  }, [isFocused])

  // Get all tasks and filter them
  const fetchTasks = async () => {
    try {
      const allTasksData = await TaskService.getAllTasks()
      setAllTasks(allTasksData)

      const now = dayjs()

      // Filter tasks due today that aren't completed
      const today = allTasksData.filter((task) => dayjs(task.dueDate).isSame(now, "day"))

      // Filter upcoming tasks (not today, not completed)
      const upcoming = allTasksData
        .filter(
          (task) =>
            dayjs(task.dueDate).isAfter(now, "day") &&
            !dayjs(task.dueDate).isSame(now, "day") &&
            task.finishedStatus !== "done",
        )
        .slice(0, 5) // Limit to 5 upcoming tasks

      setTodayTasks(today)
      setUpcomingTasks(upcoming)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle search functionality - with immediate updates
  const handleSearch = (text) => {
    // Always update the input text immediately
    setSearchQuery(text)

    if (text.trim() === "") {
      setSearchResults([])
      return
    }

    // Process search results
    const results = allTasks.filter((task) => task.title.toLowerCase().includes(text.toLowerCase()))

    setSearchResults(results)
  }

  // Toggle search visibility
  const toggleSearch = () => {
    // If we're currently in search mode and closing
    if (searchVisible) {
      // Clear the search first (do this before closing)
      setSearchQuery("")
      setSearchResults([])
    }

    // Then toggle the search visibility
    setSearchVisible(!searchVisible)
  }

  // Clear search without closing
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  // Get the color based on priority level
  const getPriorityColor = (level) => {
    switch (level) {
      case "Red":
        return "#FF4757"
      case "Yellow":
        return "#FFD93D"
      case "Blue":
        return "#2F89FC"
      case "Green":
        return "#2ED573"
      default:
        return "#A4B0BE"
    }
  }

  // Get text color based on priority background (for contrast)
  const getTextColor = (priorityLevel) => {
    switch (priorityLevel) {
      case "Red":
      case "Blue":
        return "#FFFFFF" // White text on dark backgrounds
      case "Yellow":
      case "Green":
        return "#2F3542" // Dark text on light backgrounds
      default:
        return "#2F3542" // Default dark text
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
    mainContent: {
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    sectionTitle: {
      color: colors.card_title,
    },
    progressText: {
      color: colors.progressbartext,
    },
    taskCard: {
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    taskDescription: {
      color: colors.card_description,
    },
    taskTime: {
      color: colors.card_description,
    },
    taskMetaText: {
      color: colors.card_description,
    },
    emptyText: {
      color: colors.text_empty,
      backgroundColor: colors.background,
      shadowColor: colors.shadow,
    },
    fab: {
      backgroundColor: colors.primary,
      shadowColor: colors.shadow,
    },
    searchInputWrapper: {
      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(107, 103, 103, 0.2)",
    },
  }

  // Component for progress header section
  const ProgressHeader = () => {
    // Count tasks that are fully completed (status = done)
    const completedTasks = todayTasks.filter((t) => t.finishedStatus === "done").length
    const total = todayTasks.length

    return (
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Today's Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${total > 0 ? (completedTasks / total) * 100 : 0}%` }]} />
        </View>
        <Text style={[styles.progressText, dynamicStyles.progressText]}>
          {completedTasks} of {total} tasks completed
        </Text>
      </View>
    )
  }

  // Component for individual task cards
  const TaskCard = ({ task }) => {
    const priorityColor = getPriorityColor(task.priorityLevel)
    const textColor = getTextColor(task.priorityLevel)

    return (
      <TouchableOpacity
        style={[styles.taskCard, dynamicStyles.taskCard]}
        onPress={() => navigation.navigate("TaskDetails", { taskId: task.id })}
      >
        <View style={styles.taskContent}>
          <View style={[styles.taskTitleContainer, { backgroundColor: priorityColor }]}>
            <Text style={[styles.taskTitle, { color: textColor }]}>{task.title}</Text>
          </View>

          {task.description && (
            <Text style={[styles.taskDescription, dynamicStyles.taskDescription]} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          <View style={styles.taskMeta}>
            <Icon name="access-time" size={18} color={colors.card_description} />
            <Text style={[styles.taskTime, dynamicStyles.taskTime]}>{dayjs(task.dueDate).format("h:mm A")}</Text>

            {task.subGoals.length > 0 && (
              <View style={styles.metaItem}>
                <Icon name="checklist" size={20} color={colors.card_description} />
                <Text style={[styles.taskMetaText, dynamicStyles.taskMetaText]}>
                  {task.subGoals.filter((sg) => sg.isCompleted).length}/{task.subGoals.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header - Fixed height to avoid layout shifts */}
      <View style={[styles.header, dynamicStyles.header]}>
        {/* More stable header layout with fixed position elements */}
        <View style={styles.headerContent}>
          {/* User profile section - always present but hidden when search is active */}
          {!searchVisible && (
            <View style={styles.profileSection}>
              <Image source={UserProfile} style={styles.userProfileImg} />
              <View style={styles.profileText}>
                <Text style={styles.greeting}>Hello, User!</Text>
                <Text style={styles.subGreeting}>Your tasks today</Text>
              </View>
            </View>
          )}

          {/* Search section - only visible when search is active */}
          {searchVisible && (
            <View style={styles.headerSearchContainer}>
              <View style={[styles.searchInputWrapper, dynamicStyles.searchInputWrapper]}>
                <Icon name="search" size={18} color="rgba(255, 255, 255, 0.7)" />
                <TextInput
                  ref={searchInputRef}
                  style={styles.headerSearchInput}
                  placeholder="Search tasks..."
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus={true}
                />
              </View>

              {/* Clear search button */}
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={styles.clearSearch}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="close" size={18} color="white" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Search toggle button - always visible */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={toggleSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name={searchVisible ? "close" : "search"} size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={[styles.mainContent, dynamicStyles.mainContent]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Search Results */}
          {searchVisible && searchQuery.length > 0 && (
            <View style={styles.searchResultsContainer}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Search Results ({searchResults.length})
              </Text>

              {searchResults.length > 0 ? (
                searchResults.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No matching tasks found</Text>
              )}
            </View>
          )}

          {/* Only show regular content when not searching or when search is empty */}
          {(!searchVisible || searchQuery.length === 0) && (
            <>
              {/* Progress Section */}
              <ProgressHeader />

              {/* Today's Tasks Section */}
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Today's Tasks</Text>

              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
              ) : todayTasks.length > 0 ? (
                todayTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No tasks for today! 🎉</Text>
              )}

              {/* Upcoming Tasks Section */}
              <Text style={[styles.sectionTitle, styles.upcomingTitle, dynamicStyles.sectionTitle]}>Upcoming Next</Text>

              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => {
                  const priorityColor = getPriorityColor(task.priorityLevel)
                  const textColor = getTextColor(task.priorityLevel)

                  return (
                    <TouchableOpacity
                      key={task.id}
                      style={[styles.upcomingCard, dynamicStyles.card]}
                      onPress={() => navigation.navigate("Task", { taskId: task.id })}
                    >
                      <View style={styles.upcomingContent}>
                        <Text style={[styles.upcomingDate, { color: colors.card_description }]}>
                          {dayjs(task.dueDate).format("ddd, MMM D")}
                        </Text>
                        <View style={[styles.upcomingTitleContainer, { backgroundColor: priorityColor }]}>
                          <Text style={[styles.upcomingTaskTitle, { color: textColor }]} numberOfLines={1}>
                            {task.title}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })
              ) : (
                <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No upcoming tasks 📅</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, dynamicStyles.fab]} onPress={() => navigation.navigate("AddTask")}>
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

