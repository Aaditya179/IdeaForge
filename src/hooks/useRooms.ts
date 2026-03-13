"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getRooms } from '../services/rooms';

export function useRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getRooms();
      setRooms(data);
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel('rooms_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, (payload) => {
        console.log("Real-time rooms update received!", payload);
        load();
      })
      .subscribe((status) => {
        console.log("Supabase Realtime Subscription Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rooms, loading };
}
