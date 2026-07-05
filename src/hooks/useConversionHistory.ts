import { useState, useEffect, useCallback } from 'react';
import type { MediaType } from '../types/media';

export interface HistoryRecord {
  id: string;
  fileName: string;
  outputName: string;
  mediaType: MediaType;
  originalSize: number;
  convertedSize: number;
  timestamp: number;
}

export interface ConversionStats {
  totalFiles: number;
  totalOriginalSize: number;
  totalConvertedSize: number;
  totalSaved: number;
  totalSavedPercent: number;
}

export function useConversionHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('media-converter-history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load conversion history', e);
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveHistory = (newHistory: HistoryRecord[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('media-converter-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save conversion history', e);
    }
  };

  const addRecord = useCallback((
    fileName: string,
    outputName: string,
    mediaType: MediaType,
    originalSize: number,
    convertedSize: number
  ) => {
    const newRecord: HistoryRecord = {
      id: Math.random().toString(36).substring(2, 9) + '-' + Date.now(),
      fileName,
      outputName,
      mediaType,
      originalSize,
      convertedSize,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Keep max 100 records to prevent bloating localStorage
      const updated = [newRecord, ...prev].slice(0, 100);
      try {
        localStorage.setItem('media-converter-history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save conversion history', e);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, []);

  const removeRecord = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('media-converter-history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save conversion history', e);
      }
      return updated;
    });
  }, []);

  // Compute statistics
  const stats: ConversionStats = history.reduce(
    (acc, curr) => {
      acc.totalFiles += 1;
      acc.totalOriginalSize += curr.originalSize;
      acc.totalConvertedSize += curr.convertedSize;
      return acc;
    },
    { totalFiles: 0, totalOriginalSize: 0, totalConvertedSize: 0, totalSaved: 0, totalSavedPercent: 0 }
  );

  stats.totalSaved = stats.totalOriginalSize - stats.totalConvertedSize;
  stats.totalSavedPercent =
    stats.totalOriginalSize > 0
      ? Math.round((stats.totalSaved / stats.totalOriginalSize) * 100)
      : 0;

  return {
    history,
    stats,
    addRecord,
    clearHistory,
    removeRecord,
  };
}
