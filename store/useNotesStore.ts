import { create } from 'zustand';
import { StorageService } from '../services/StorageService';
import { Note } from '../types';

interface NotesState {
  notes: Note[];
  searchQuery: string;
  sortOrder: 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc';
  refreshNotes: () => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc') => void;
  filteredNotes: () => Note[];
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  searchQuery: '',
  sortOrder: 'date-desc',
  
  refreshNotes: async () => {
    try {
      const notes = await StorageService.getNotes();
      set({ notes });
    } catch (e) {
      set({ notes: [] });
    }
  },

  addNote: async (note) => {
    await StorageService.saveNote(note);
    get().refreshNotes();
  },

  updateNote: async (note) => {
    await StorageService.saveNote(note);
    get().refreshNotes();
  },

  deleteNote: async (id) => {
    await StorageService.deleteNote(id);
    get().refreshNotes();
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortOrder: (order) => set({ sortOrder: order }),

  filteredNotes: () => {
    const { notes, searchQuery, sortOrder } = get();
    let result = [...notes];

    // Filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(lowerQuery) || 
        n.body.toLowerCase().includes(lowerQuery) ||
        n.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'date-desc': return b.updatedAt - a.updatedAt;
        case 'date-asc': return a.updatedAt - b.updatedAt;
        case 'alpha-asc': return a.title.localeCompare(b.title);
        case 'alpha-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    return result;
  }
}));
