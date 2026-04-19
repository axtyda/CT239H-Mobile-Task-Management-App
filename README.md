# Mobile-Task-Management-App

Cross-platform mobile task manager built with **Expo** and **React Native**. It provides a dashboard for daily work, filters by task status, priority-style grouping, a calendar agenda for scheduled items, and flows to add tasks with date selection.

## Features

- **Onboarding** — Welcome screen before entering the main app.
- **Home** — Task summary, horizontal “today” strip, and a filterable list (e.g. pending, in progress, done) with priority-style categories.
- **Tasks (calendar)** — Day-based agenda view for scheduled tasks.
- **Add task** — Form with task fields and native date/time picking for start and end dates.
- **Navigation** — Stack navigator for onboarding and modal flows; bottom tabs for Home, Tasks, Inbox, and Profile.

## Tech stack


| Area            | Technology                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Framework       | [Expo](https://expo.dev/) SDK 52                                                                                         |
| UI              | [React](https://react.dev/) 18, [React Native](https://reactnative.dev/) 0.76                                            |
| Navigation      | [React Navigation](https://reactnavigation.org/) (stack + bottom tabs)                                                   |
| Calendar        | [react-native-calendars](https://github.com/wix/react-native-calendars) (Agenda)                                         |
| Dates           | [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker)                  |
| JS engine       | Hermes (configured in `app.json`)                                                                                        |
| Native workflow | [expo-dev-client](https://docs.expo.dev/develop/development-builds/introduction/) (development build, not Expo Go alone) |
| Local database  | [Realm](https://realm.io/) ([Realm React Native](https://www.mongodb.com/docs/realm/sdk/react-native/))                  |


## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or compatible package manager
- For **iOS**: Xcode and CocoaPods (macOS only)
- For **Android**: Android Studio with SDK and emulator or a physical device with USB debugging

This app relies on **native modules** and **expo-dev-client**. You must **compile and install a development build** on a simulator/emulator or device before you can run it. Opening the project with only `npm start` / Expo Go is **not** the supported workflow.

## Getting started

1. **Install dependencies**
  ```bash
   npm install
  ```
2. **Build and run the native app** (creates/updates `android` / `ios` as needed and installs the dev client)
  **Android**
   **iOS (macOS only)**
   The first run can take several minutes while Gradle / Xcode compile native code.
3. **Day-to-day development** — With a dev build already installed, start Metro and connect the dev client:
  ```bash
   npm start
  ```
   The `start` script runs `expo start --dev-client` (not plain Expo Go). Open the installed dev-client app on the device or simulator; it will load the bundle from Metro.
   Do **not** rely on `npm start` before step 2 — there is nothing to connect to until the native app has been built and installed at least once.

### Other commands

```bash
npm run web       # Expo web (optional; not the primary mobile target)
```

## Project structure

```
├── App.js                 # Root navigation container & stack screens
├── Navigation/
│   └── Navigation.js      # Bottom tab navigator
├── Screens/
│   ├── InitialScreen/     # Welcome / get started
│   ├── Home/              # Dashboard & task lists
│   ├── Task/              # Calendar agenda & add-task entry
│   ├── Login/             # Placeholder
│   ├── Registration/      # Placeholder
│   ├── Inbox/             # Placeholder
│   └── Profile/
├── theme/                 # Shared colors, fonts, images
└── assets/                # Icons & splash
```

## Data & persistence

The app uses **Realm** as a **local, embedded database** on the device. Task and calendar-related data are modeled and persisted in Realm so lists and schedules survive app restarts and work **without a remote server** for core storage. Realm fits this stack because it maps naturally to React Native objects, supports queries and migrations, and keeps offline-first behavior straightforward.

There is **no separate cloud backend** required for basic persistence; any future sync or REST API would sit alongside Realm rather than replace local storage for day-to-day use.

## Requirements context

Developed as a **foundation thesis / introductory capstone** project (CT239H — *Niên luận cơ sở*).

## License

This repository is **private** and intended for academic and portfolio use.