import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl, Modal, Pressable } from 'react-native';
import { useNotesStore } from '../../store/useNotesStore';
import NoteCard from '../../components/NoteCard';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { filteredNotes, refreshNotes, searchQuery, setSearchQuery, sortOrder, setSortOrder } = useNotesStore();
  const notes = filteredNotes();
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    refreshNotes();
  }, []);

  const leftColumn = notes.filter((_, i) => i % 2 === 0);
  const rightColumn = notes.filter((_, i) => i % 2 !== 0);

  const sortOptions = [
    { label: 'Last Updated (Newest)', value: 'date-desc' },
    { label: 'Last Updated (Oldest)', value: 'date-asc' },
    { label: 'Title (A-Z)', value: 'alpha-asc' },
    { label: 'Title (Z-A)', value: 'alpha-desc' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="px-4 py-2 flex-row items-center">
        <View className="flex-1 flex-row items-center bg-white p-3 rounded-xl border border-primary-100 mr-3 shadow-sm">
          <Search size={20} color="#6366f1" />
          <TextInput 
            className="flex-1 ml-2 text-slate-800"
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <TouchableOpacity 
          className="bg-white p-3 rounded-xl border border-primary-100 shadow-sm"
          onPress={() => setShowSortOptions(true)}
        >
          <SlidersHorizontal size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={false} onRefresh={refreshNotes} tintColor="#6366f1" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row">
          <View className="flex-1 mr-2">
            {leftColumn.map((note, index) => (
              <NoteCard key={note.id} note={note} index={index} />
            ))}
          </View>
          <View className="flex-1 ml-2">
            {rightColumn.map((note, index) => (
              <NoteCard key={note.id} note={note} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary-600 w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-primary-300"
        onPress={() => router.push('/note/new')}
        activeOpacity={0.9}
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>

      <Modal
        visible={showSortOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortOptions(false)}
      >
        <Pressable 
          className="flex-1 bg-slate-900/50 justify-center items-center p-4"
          onPress={() => setShowSortOptions(false)}
        >
          <View className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-slate-900">Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortOptions(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`p-4 rounded-xl mb-2 ${sortOrder === option.value ? 'bg-primary-50 border border-primary-100' : 'bg-slate-50'}`}
                onPress={() => {
                  setSortOrder(option.value as any);
                  setShowSortOptions(false);
                }}
              >
                <Text className={`text-base ${sortOrder === option.value ? 'font-bold text-primary-700' : 'text-slate-600'}`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
