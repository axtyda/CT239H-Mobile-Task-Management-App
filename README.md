# Task Management Application

A Local-first React-Native task management application.

## Getting Started

### Prerequisites

To run this project, you need to install the following dependencies:

- Node.js v23.x
- Android emulator API 35

### Installation

1. Clone or download the source code from the branch "ready" of this repository:
   - git clone -b ready https://github.com/axtyda/CT239H.git
   - cd frontend

2. Install the required libraries:
   npm install

3. Ensure an Android emulator API 35 is running.

4. Build the application
   npx expo run:android

### Usage

1. **Launch the Program**:
   - Run the nien_luan app
   - Press "Enable Notification".

This opens the permission request message. (Note: this project is currently only work with Android emulator and maybe Android devices)

2. **Press the " + " green icon at the bottom right of Home or Task tab**:

   - Enter required infomation.
   - Set priority
   - Set the date & time.
   - Set notification type and option to repeat notify (optional)
   - Add sub-goals (optional) 
   - Press the Add Task button to save.

3. **View the tasks**:

   - Once added tasks will be show on Home screen and Task screen. 

4. **Further customization**:

   - Head to Profile tab
   - Change name, workplace, email (optional)
   - Change theme, notification settings


## Additional Details

   - **No support for iOS**: Due to the inaccessible to Mac device, the development of iOS platform is impossible. 
   - **Call notification are not working**: Call notification will not work on a emulator environment
   - Full source code and updates are available at: https://github.com/axtyda/CT239H/tree/ready
