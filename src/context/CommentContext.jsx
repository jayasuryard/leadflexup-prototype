import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

const CommentContext = createContext();
const STORAGE_KEY = 'leadflexup_comments';

export const useComments = () => useContext(CommentContext);

// Load comments from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
};

// Save comments to localStorage
const saveToStorage = (comments) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch (e) { console.error('Storage save error:', e); }
};

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState(loadFromStorage);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [supabaseOk, setSupabaseOk] = useState(true);

  // Try to fetch from Supabase on mount, merge with local
  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('prototype_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase unavailable, using localStorage only:', error.message);
        setSupabaseOk(false);
      } else if (data && data.length > 0) {
        // Merge Supabase data with local
        const grouped = {};
        data.forEach(c => {
          if (!grouped[c.component_id]) grouped[c.component_id] = [];
          grouped[c.component_id].push(c);
        });
        setComments(prev => {
          const merged = { ...prev, ...grouped };
          saveToStorage(merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using localStorage:', err.message);
      setSupabaseOk(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // Save to localStorage whenever comments change
  useEffect(() => { saveToStorage(comments); }, [comments]);

  // Add a comment
  const addComment = async (componentId, text) => {
    const newComment = {
      id: crypto.randomUUID(),
      component_id: componentId,
      comment: text,
      status: 'pending',
      page: window.location.pathname,
      created_at: new Date().toISOString(),
    };

    // Always save locally first
    setComments(prev => ({
      ...prev,
      [componentId]: [newComment, ...(prev[componentId] || [])],
    }));

    // Try to sync to Supabase in background
    if (supabaseOk) {
      try {
        const { error } = await supabase
          .from('prototype_comments')
          .insert([{
            component_id: componentId,
            comment: text,
            status: 'pending',
            page: window.location.pathname,
          }]);
        if (error) {
          console.warn('Supabase sync failed:', error.message);
          setSupabaseOk(false);
        }
      } catch (err) {
        console.warn('Supabase sync error:', err.message);
        setSupabaseOk(false);
      }
    }

    return true;
  };

  // Check if component has comments
  const hasComments = (componentId) => {
    return (comments[componentId] || []).length > 0;
  };

  // Get comments for a component
  const getComments = (componentId) => {
    return comments[componentId] || [];
  };

  // Get all comments flat
  const getAllComments = () => {
    return Object.entries(comments).flatMap(([id, cmts]) =>
      cmts.map(c => ({ ...c, component_id: id }))
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  return (
    <CommentContext.Provider value={{ comments, loading, addComment, hasComments, getComments, getAllComments, showPanel, setShowPanel, fetchComments }}>
      {children}
    </CommentContext.Provider>
  );
};
