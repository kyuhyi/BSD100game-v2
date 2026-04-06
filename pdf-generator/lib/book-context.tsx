'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Book, CoverConfig, Chapter, AuthorProfile, Visualization, DEFAULT_COLOR_SCHEMES } from './types';

const STORAGE_KEY = 'pdf-ebook-generator-book';

function createDefaultBook(): Book {
  return {
    id: crypto.randomUUID(),
    title: '',
    subtitle: '',
    cover: {
      templateId: 'modern',
      colorScheme: DEFAULT_COLOR_SCHEMES.ocean,
      fontFamily: 'Pretendard',
    },
    chapters: [],
    author: {
      name: '',
      bio: '',
      credentials: [],
      socialLinks: [],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

type BookAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_SUBTITLE'; payload: string }
  | { type: 'SET_COVER'; payload: Partial<CoverConfig> }
  | { type: 'ADD_CHAPTER'; payload: Chapter }
  | { type: 'UPDATE_CHAPTER'; payload: { id: string; updates: Partial<Chapter> } }
  | { type: 'REMOVE_CHAPTER'; payload: string }
  | { type: 'REORDER_CHAPTERS'; payload: Chapter[] }
  | { type: 'ADD_VISUALIZATION'; payload: { chapterId: string; viz: Visualization } }
  | { type: 'REMOVE_VISUALIZATION'; payload: { chapterId: string; vizId: string } }
  | { type: 'SET_AUTHOR'; payload: Partial<AuthorProfile> }
  | { type: 'LOAD_BOOK'; payload: Book }
  | { type: 'RESET_BOOK' };

function bookReducer(state: Book, action: BookAction): Book {
  const updated = { ...state, updatedAt: Date.now() };

  switch (action.type) {
    case 'SET_TITLE':
      return { ...updated, title: action.payload };
    case 'SET_SUBTITLE':
      return { ...updated, subtitle: action.payload };
    case 'SET_COVER':
      return { ...updated, cover: { ...updated.cover, ...action.payload } };
    case 'ADD_CHAPTER':
      return { ...updated, chapters: [...updated.chapters, action.payload] };
    case 'UPDATE_CHAPTER':
      return {
        ...updated,
        chapters: updated.chapters.map((ch) =>
          ch.id === action.payload.id ? { ...ch, ...action.payload.updates } : ch
        ),
      };
    case 'REMOVE_CHAPTER':
      return {
        ...updated,
        chapters: updated.chapters.filter((ch) => ch.id !== action.payload),
      };
    case 'REORDER_CHAPTERS':
      return { ...updated, chapters: action.payload };
    case 'ADD_VISUALIZATION':
      return {
        ...updated,
        chapters: updated.chapters.map((ch) =>
          ch.id === action.payload.chapterId
            ? { ...ch, visualizations: [...ch.visualizations, action.payload.viz] }
            : ch
        ),
      };
    case 'REMOVE_VISUALIZATION':
      return {
        ...updated,
        chapters: updated.chapters.map((ch) =>
          ch.id === action.payload.chapterId
            ? { ...ch, visualizations: ch.visualizations.filter((v) => v.id !== action.payload.vizId) }
            : ch
        ),
      };
    case 'SET_AUTHOR':
      return { ...updated, author: { ...updated.author, ...action.payload } };
    case 'LOAD_BOOK':
      return action.payload;
    case 'RESET_BOOK':
      return createDefaultBook();
    default:
      return state;
  }
}

interface BookContextValue {
  book: Book;
  dispatch: React.Dispatch<BookAction>;
}

const BookContext = createContext<BookContextValue | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [book, dispatch] = useReducer(bookReducer, null, () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved) as Book;
        } catch {}
      }
    }
    return createDefaultBook();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
    }, 500);
    return () => clearTimeout(timer);
  }, [book]);

  return (
    <BookContext.Provider value={{ book, dispatch }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBook must be used within BookProvider');
  return ctx;
}
