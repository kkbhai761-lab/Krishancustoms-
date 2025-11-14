import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { exercises } from '../data/exercises';
import { useUser } from '../context/UserContext';

const ExerciseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, addSavedWorkout, removeSavedWorkout } = useUser();
  const [activeTab, setActiveTab] = useState<'instructions' | 'benefits' | 'mistakes'>('instructions');

  const exercise = exercises.find((ex) => ex.id === id);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center">
        <p className="text-gray-400">Exercise not found</p>
      </div>
    );
  }

  const isSaved = user.savedWorkouts.includes(exercise.id);

  const toggleSave = () => {
    if (isSaved) {
      removeSavedWorkout(exercise.id);
    } else {
      addSavedWorkout(exercise.id);
    }
  };

  return (
    <div className="min-h-screen bg-gym-black pb-24">
      {/* Header Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-80 overflow-hidden"
      >
        <img
          src={exercise.image}
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-gym-black/50 to-transparent" />
        
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-12 h-12 bg-gym-dark/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          ←
        </motion.button>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSave}
          className="absolute top-6 right-6 w-12 h-12 bg-gym-dark/80 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl"
        >
          {isSaved ? '❤️' : '🤍'}
        </motion.button>

        {/* Title */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-2"
          >
            {exercise.name}
          </motion.h1>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 -mt-8 mb-6 grid grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-gym-red to-gym-red-dark p-4 rounded-xl text-center">
          <p className="text-3xl font-bold text-white">{exercise.sets}</p>
          <p className="text-sm text-white/80">Sets</p>
        </div>
        <div className="bg-gradient-to-br from-gym-blue to-gym-blue-dark p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{exercise.reps}</p>
          <p className="text-sm text-white/80">Reps</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-xl text-center">
          <p className="text-3xl font-bold text-white">{exercise.restTime}</p>
          <p className="text-sm text-white/80">Min Rest</p>
        </div>
      </motion.div>

      {/* Muscles Targeted */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6 mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-gym-red">💪</span> Muscles Targeted
        </h2>
        <div className="flex flex-wrap gap-3">
          {exercise.muscles.map((muscle, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-gym-dark px-4 py-2 rounded-full border border-gym-blue/30"
            >
              <span className="text-gym-blue font-medium">{muscle}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-6 mb-6"
      >
        <div className="flex gap-2 bg-gym-dark p-2 rounded-xl">
          {(['instructions', 'benefits', 'mistakes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-gym-red to-gym-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'instructions' && '📋 How To'}
              {tab === 'benefits' && '✨ Benefits'}
              {tab === 'mistakes' && '⚠️ Mistakes'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="px-6 mb-6"
      >
        {activeTab === 'instructions' && (
          <div className="space-y-4">
            {exercise.instructions.map((instruction, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 bg-gym-dark p-4 rounded-xl"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gym-red to-gym-blue rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-300 flex-1">{instruction}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-3">
            {exercise.benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-3 items-start bg-gym-dark p-4 rounded-xl"
              >
                <span className="text-2xl">✅</span>
                <p className="text-gray-300 flex-1">{benefit}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="space-y-3">
            {exercise.commonMistakes.map((mistake, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-3 items-start bg-gym-dark p-4 rounded-xl border border-gym-red/30"
              >
                <span className="text-2xl">❌</span>
                <p className="text-gray-300 flex-1">{mistake}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Start Workout Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/timing/${exercise.id}`)}
          className="w-full bg-gradient-to-r from-gym-red to-gym-blue text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-gym-blue/50"
        >
          Start Workout Timer
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ExerciseDetailPage;
