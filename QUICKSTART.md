# SafeNote (HD_Notes_App) - Quick Start Guide

SafeNote is a secure, biometric-protected notes application built with React Native, Expo, and NativeWind.

## 🚀 Project Overview

- **Framework**: Expo SDK 54 (Managed Workflow)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Navigation**: Expo Router
- **Storage**: AsyncStorage + Expo FileSystem
- **Authentication**: Local Biometric Authentication (Fingerprint/FaceID)

## 🛠️ Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- [Expo Go](https://expo.dev/client) app on your mobile device (for development)
- [EAS CLI](https://github.com/expo/eas-cli) (`npm install -g eas-cli`) for building APKs

## 📦 Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder.
2.  **Install dependencies**:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the App

### Development Mode (Expo Go)
To start the development server and run the app on your phone via Expo Go:

```bash
npx expo start
```
Scan the QR code with your Android (Expo Go app) or iOS (Camera app) device.

### Building an APK (Android)
To build a standalone APK for Android devices:

1.  **Configure EAS**:
    Ensure you are logged in to your Expo account:
    ```bash
    eas login
    ```

2.  **Run the Build Command**:
    ```bash
    eas build -p android --profile preview
    ```
    This will generate an APK file that you can install directly on your Android device.

3.  **Install the APK**:
    Once the build is complete, download the `.apk` file and install it using ADB:
    ```bash
    adb install path/to/your/app.apk
    ```

## 📱 Key Features

-   **Biometric Login**: Secure access using your device's fingerprint or face recognition.
-   **Rich Notes**: Create notes with titles, bodies, and images (Camera or Gallery).
-   **Search & Sort**: Filter notes by text and sort by date or title.
-   **Persistent Storage**: Notes are saved locally on the device.

## 🎨 Customization

-   **Colors**: The color palette is defined in `tailwind.config.js`.
-   **Assets**: Replace icons and splash screens in the `assets/` folder.

## 🤝 Troubleshooting

-   **Dependency Conflicts**: If you encounter peer dependency issues (especially with React versions), try running `npm install --legacy-peer-deps` or ensure `package.json` versions align with Expo SDK requirements.
-   **Biometrics**: Biometric features require a physical device and may not work fully in emulators without specific configuration.
