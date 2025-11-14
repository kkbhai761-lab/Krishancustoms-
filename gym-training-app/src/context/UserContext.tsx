import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  savedWorkouts: string[];
  workoutHistory: Array<{
    date: string;
    exerciseId: string;
    duration: number;
  }>;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  calculateBMI: () => number;
  addSavedWorkout: (exerciseId: string) => void;
  removeSavedWorkout: (exerciseId: string) => void;
  addWorkoutHistory: (exerciseId: string, duration: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>({
    name: 'Fitness Enthusiast',
    age: 25,
    weight: 75,
    height: 175,
    fitnessLevel: 'Intermediate',
    savedWorkouts: [],
    workoutHistory: [],
  });

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const calculateBMI = (): number => {
    const heightInMeters = user.height / 100;
    return parseFloat((user.weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const addSavedWorkout = (exerciseId: string) => {
    setUser((prev) => ({
      ...prev,
      savedWorkouts: [...prev.savedWorkouts, exerciseId],
    }));
  };

  const removeSavedWorkout = (exerciseId: string) => {
    setUser((prev) => ({
      ...prev,
      savedWorkouts: prev.savedWorkouts.filter((id) => id !== exerciseId),
    }));
  };

  const addWorkoutHistory = (exerciseId: string, duration: number) => {
    setUser((prev) => ({
      ...prev,
      workoutHistory: [
        ...prev.workoutHistory,
        {
          date: new Date().toISOString(),
          exerciseId,
          duration,
        },
      ],
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        calculateBMI,
        addSavedWorkout,
        removeSavedWorkout,
        addWorkoutHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
