# SafeNote: Offline-First Multi-User Notes App

A production-grade React Native application built with Expo, TypeScript, and NativeWind.

## Core Philosophy
SafeNote is designed to be **Offline-First**. It supports multiple users on a single device with strict data isolation using encrypted local storage (MMKV). Cloud features are optional enhancements.

## 📥 Download APK

You can download the latest build of the app directly from Expo:
[**Download SafeNote APK**](https://expo.dev/accounts/hiomkarrr/projects/HD_Notes_App/builds/eeafb747-48dc-42d0-9c66-917b9556f669)

## Tech Stack
- **Framework:** React Native (Expo SDK 50+)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** Expo Router
- **State Management:** Zustand
- **Storage:** React Native MMKV (Encrypted)
- **Animations:** Moti + Reanimated 3

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the App:**
   ```bash
   npx expo start
   ```
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go (Note: MMKV might require a Development Build for full functionality, but works in recent Expo Go versions with some limitations. For best results, create a development build).

3. **Development Build (Recommended for MMKV):**
   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

## Features
- **Multi-User Auth:** Create multiple accounts on one device. Each user's data is encrypted with their PIN.
- **Masonry Layout:** Beautiful staggered grid for notes.
- **Rich Media:** Attach images to notes.
- **Search & Sort:** Real-time filtering and sorting.
- **Biometrics:** Ready for FaceID/TouchID integration.

## Known Issues / Notes
- **Firebase:** Firebase configuration is mocked in the settings. To enable real Firebase sync, add your `google-services.json` / `GoogleService-Info.plist` and configure `firebaseConfig` in a `.env` file.
- **MMKV in Expo Go:** While `react-native-mmkv` is highly optimized, it uses JSI. If you encounter crashes in Expo Go, please use a Development Build (`npx expo run:android`).
- **Voice Dictation:** Uses the native keyboard microphone for offline privacy.

## Folder Structure
- `app/`: Expo Router screens.
- `components/`: Reusable UI components.
- `services/`: Core logic (Storage, Auth).
- `store/`: Zustand state management.
- `types/`: TypeScript definitions.
