import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Image, Alert, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useNotesStore } from '../../store/useNotesStore';
import { Note } from '../../types';
import { Save, Trash2, Image as ImageIcon, Mic, ArrowLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { copyAsync, documentDirectory, cacheDirectory } from 'expo-file-system/legacy';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const isNew = id === 'new';
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!isNew && typeof id === 'string') {
      const note = notes.find(n => n.id === id);
      if (note) {
        setTitle(note.title);
        setBody(note.body);
        setImageUri(note.imageUri);
        setTags(note.tags);
      }
    }
  }, [id, notes]);

  const handleSave = () => {
    if (!title.trim() && !body.trim()) {
      router.back();
      return;
    }

    const noteData: Note = {
      id: isNew ? uuidv4() : (id as string),
      title,
      body,
      imageUri,
      tags,
      createdAt: isNew ? Date.now() : (notes.find(n => n.id === id)?.createdAt || Date.now()),
      updatedAt: Date.now(),
      isSynced: false,
    };

    if (isNew) {
      addNote(noteData);
    } else {
      updateNote(noteData);
    }
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          if (!isNew && typeof id === 'string') {
            deleteNote(id);
          }
          router.back();
        }
      }
    ]);
  };

  const saveImage = async (uri: string) => {
    const fileName = uri.split('/').pop() || `image-${Date.now()}.jpg`;
    const directory = documentDirectory || cacheDirectory;
    
    if (!directory) {
      console.warn('documentDirectory is not available, using original URI');
      setImageUri(uri);
      return;
    }

    const newPath = directory + fileName;
    
    try {
      await copyAsync({
        from: uri,
        to: newPath
      });
      setImageUri(newPath);
    } catch (e) {
      console.error("Error saving image", e);
      setImageUri(uri); // Fallback
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      await saveImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      await saveImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <View className="flex-row space-x-2">
          {!isNew && (
            <TouchableOpacity onPress={handleDelete} className="p-2 mr-2">
              <Trash2 size={24} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSave} className="p-2 bg-primary-600 rounded-full shadow-md shadow-primary-200">
            <Save size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4">
          <TextInput
            className="text-3xl font-bold text-slate-900 mb-4"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#cbd5e1"
            multiline
          />
          
          {imageUri && (
            <View className="mb-4 rounded-xl overflow-hidden shadow-sm">
              <Image source={{ uri: imageUri }} className="w-full h-64 bg-slate-100" resizeMode="cover" />
              <TouchableOpacity 
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                onPress={() => setImageUri(undefined)}
              >
                <Trash2 size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            className="text-lg text-slate-600 leading-relaxed min-h-[200px]"
            placeholder="Start typing..."
            value={body}
            onChangeText={setBody}
            placeholderTextColor="#cbd5e1"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Toolbar */}
        <View className="px-4 py-3 border-t border-slate-100 flex-row items-center bg-white">
          <TouchableOpacity onPress={pickImage} className="p-2 mr-4">
            <ImageIcon size={24} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} className="p-2 mr-4">
            <Camera size={24} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2" onPress={() => Alert.alert('Voice Note', 'Use the microphone on your keyboard to dictate.')}>
            <Mic size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
