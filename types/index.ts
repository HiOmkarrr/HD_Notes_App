export interface Note {
  id: string;
  title: string;
  body: string;
  imageUri?: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isSynced: boolean;
}

export interface User {
  username: string;
  pinHash: string; // In a real app, use a proper hash. For this demo, we might simulate it.
  isBiometricEnabled: boolean;
  linkedFirebaseUid?: string;
}

export interface UserData {
  notes: Note[];
}
