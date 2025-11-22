import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';

const USERS_KEY = 'users_list';
const LAST_USER_KEY = 'last_user';

// Cache for active user
let currentUsername: string | null = null;

export const StorageService = {
  getUsers: async (): Promise<string[]> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
      console.error('Failed to get users', e);
      return [];
    }
  },

  getLastUser: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(LAST_USER_KEY);
  },

  setLastUser: async (username: string) => {
    await AsyncStorage.setItem(LAST_USER_KEY, username);
  },

  createUser: async (username: string, pin: string) => {
    const users = await StorageService.getUsers();
    if (users.includes(username)) {
      throw new Error('User already exists');
    }
    
    // Initialize empty data
    await AsyncStorage.setItem(`user-${username}-notes`, JSON.stringify([]));
    await AsyncStorage.setItem(`user-${username}-profile`, JSON.stringify({ username, pin, createdAt: Date.now() }));
    
    // Save to global list
    users.push(username);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return true;
  },

  login: async (username: string, pin: string): Promise<boolean> => {
    try {
      const profileJson = await AsyncStorage.getItem(`user-${username}-profile`);
      if (!profileJson) return false;

      const profile = JSON.parse(profileJson);
      if (profile.pin !== pin) {
        return false;
      }

      currentUsername = username;
      await StorageService.setLastUser(username);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  },

  biometricLogin: async (username: string): Promise<boolean> => {
    try {
      // Verify user exists
      const profileJson = await AsyncStorage.getItem(`user-${username}-profile`);
      if (!profileJson) return false;

      currentUsername = username;
      await StorageService.setLastUser(username);
      return true;
    } catch (error) {
      console.error("Biometric login failed", error);
      return false;
    }
  },

  logout: () => {
    currentUsername = null;
  },

  getNotes: async (): Promise<Note[]> => {
    if (!currentUsername) throw new Error('No user logged in');
    try {
      const notesJson = await AsyncStorage.getItem(`user-${currentUsername}-notes`);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (e) {
      console.error('Failed to get notes', e);
      return [];
    }
  },

  saveNote: async (note: Note) => {
    if (!currentUsername) throw new Error('No user logged in');
    const notes = await StorageService.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    
    if (index >= 0) {
      notes[index] = { ...note, updatedAt: Date.now(), isSynced: false };
    } else {
      notes.push({ ...note, createdAt: Date.now(), updatedAt: Date.now(), isSynced: false });
    }
    
    await AsyncStorage.setItem(`user-${currentUsername}-notes`, JSON.stringify(notes));
  },

  deleteNote: async (noteId: string) => {
    if (!currentUsername) throw new Error('No user logged in');
    const notes = await StorageService.getNotes();
    const newNotes = notes.filter(n => n.id !== noteId);
    await AsyncStorage.setItem(`user-${currentUsername}-notes`, JSON.stringify(newNotes));
  },
  
  getCurrentUser: () => currentUsername,
};
