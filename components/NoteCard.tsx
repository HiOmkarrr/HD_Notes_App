import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Note } from '../types';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { MotiView } from 'moti';

interface NoteCardProps {
  note: Note;
  index: number;
}

export default function NoteCard({ note, index }: NoteCardProps) {
  return (
    <Link href={`/note/${note.id}`} asChild>
      <TouchableOpacity activeOpacity={0.9}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100, type: 'timing' }}
          className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-zinc-100"
        >
          <Text className="text-lg font-bold text-zinc-800 mb-2" numberOfLines={2}>
            {note.title || 'Untitled'}
          </Text>
          <Text className="text-zinc-500 text-sm mb-3" numberOfLines={4}>
            {note.body}
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-zinc-400">
              {format(note.updatedAt, 'MMM d')}
            </Text>
            {note.tags.length > 0 && (
              <View className="bg-zinc-100 px-2 py-1 rounded-md">
                <Text className="text-xs text-zinc-600">#{note.tags[0]}</Text>
              </View>
            )}
          </View>
        </MotiView>
      </TouchableOpacity>
    </Link>
  );
}
