import { StyleSheet } from "react-native"
import { Colors, Fonts } from "../../../theme"

export const styles = StyleSheet.create({
  inboxContiner: {
    flex: 1,
  },
  inboxView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  profileView: {
    flexDirection: "row",
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
  mesText: {
    color: Colors.text,
    // fontWeight: 900,
  },
  tasksText: {
    fontSize: 21,
    fontWeight: 800,
    color: Colors.text,
  },
  mainProfileContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -22,
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 20,
  },

  // New label and input styles
  label: {
    fontFamily: Fonts.MEDIUM,
    color: Colors.text_alt,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    marginTop: 5,
  },
  inputFocused: {
    backgroundColor: "#ffffff",
    borderColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: "#2F3542",
    flex: 1,
  },
  // Add save button styles
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontFamily: Fonts.MEDIUM,
    fontSize: 16,
  },
})

