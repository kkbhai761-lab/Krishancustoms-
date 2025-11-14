import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { exercises } from '../data/exercises';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, updateUser, calculateBMI } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    age: user.age,
    weight: user.weight,
    height: user.height,
    fitnessLevel: user.fitnessLevel,
  });

  const bmi = calculateBMI();

  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  const bmiCategory = getBMICategory(bmi);

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const savedExercises = exercises.filter((ex) => user.savedWorkouts.includes(ex.id));
  const totalWorkouts = user.workoutHistory.length;
  const totalMinutes = user.workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);

  return (
    <div className="min-h-screen bg-gym-black pb-24 pt-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-white">My </span>
          <span className="text-gym-red">Profile</span>
        </h1>
        <p className="text-gray-400">Track your fitness journey</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-6"
      >
        <div className="bg-gradient-to-br from-gym-red to-gym-blue p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-white/80">{user.fitnessLevel} Level</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(!isEditing)}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl"
            >
              {isEditing ? '✖️' : '✏️'}
            </motion.button>
          </div>

          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl placeholder-white/50"
                placeholder="Name"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) })}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl placeholder-white/50"
                  placeholder="Age"
                />
                <input
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: parseFloat(e.target.value) })}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl placeholder-white/50"
                  placeholder="Weight (kg)"
                />
              </div>
              <input
                type="number"
                value={editForm.height}
                onChange={(e) => setEditForm({ ...editForm, height: parseFloat(e.target.value) })}
                className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl placeholder-white/50"
                placeholder="Height (cm)"
              />
              <select
                value={editForm.fitnessLevel}
                onChange={(e) => setEditForm({ ...editForm, fitnessLevel: e.target.value as any })}
                className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl"
              >
                <option value="Beginner" className="bg-gym-dark">Beginner</option>
                <option value="Intermediate" className="bg-gym-dark">Intermediate</option>
                <option value="Advanced" className="bg-gym-dark">Advanced</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full bg-white text-gym-red font-bold py-3 rounded-xl"
              >
                Save Changes
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{user.age}</p>
                <p className="text-white/70 text-sm">Years</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{user.weight}</p>
                <p className="text-white/70 text-sm">kg</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{user.height}</p>
                <p className="text-white/70 text-sm">cm</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* BMI Card */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-6"
      >
        <div className="bg-gym-dark p-6 rounded-2xl border border-gym-blue/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Body Mass Index</h3>
            <span className="text-3xl">📊</span>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-5xl font-bold text-gym-blue">{bmi}</p>
              <p className={`text-lg font-semibold ${bmiCategory.color}`}>{bmiCategory.label}</p>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gym-black rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15</span>
                <span>25</span>
                <span>35</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 mb-6 grid grid-cols-2 gap-4"
      >
        <div className="bg-gym-dark p-5 rounded-2xl text-center border border-gym-red/30">
          <p className="text-4xl font-bold text-gym-red">{totalWorkouts}</p>
          <p className="text-gray-400 text-sm mt-1">Total Workouts</p>
        </div>
        <div className="bg-gym-dark p-5 rounded-2xl text-center border border-gym-blue/30">
          <p className="text-4xl font-bold text-gym-blue">{totalMinutes}</p>
          <p className="text-gray-400 text-sm mt-1">Minutes Trained</p>
        </div>
      </motion.div>

      {/* Saved Workouts */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6"
      >
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>❤️</span> Saved Workouts
        </h3>
        {savedExercises.length > 0 ? (
          <div className="space-y-3">
            {savedExercises.map((exercise, idx) => (
              <motion.div
                key={exercise.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/exercise/${exercise.id}`)}
                className="bg-gym-dark p-4 rounded-xl flex items-center gap-4 cursor-pointer"
              >
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{exercise.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {exercise.sets} sets • {exercise.reps} reps
                  </p>
                </div>
                <span className="text-gym-blue text-xl">→</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gym-dark p-8 rounded-xl text-center">
            <p className="text-gray-400 mb-4">No saved workouts yet</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-gym-red to-gym-blue text-white font-semibold px-6 py-3 rounded-xl"
            >
              Browse Exercises
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
