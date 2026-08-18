import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../constants";

export function useLocalStorageTasks(initialValue) {
  const [tasks, setTasks] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  return [tasks, setTasks];
}