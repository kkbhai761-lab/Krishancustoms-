import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { exercises } from '../data/exercises';
import { useUser } from '../context/UserContext';

type TimerPhase = 'warmup' | 'workout' | 'rest' | 'completed';

const TimingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addWorkoutHistory } = useUser();
  
  const exercise = id ? exercises.find((ex) => ex.id === id) : exercises[0];
  
  const [phase, setPhase] = useState<TimerPhase>('warmup');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);

  useEffect(() => {
    if (exercise) {
      setTimeLeft(exercise.warmupTime * 60);
    }
  }, [exercise]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handlePhaseComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    if (!exercise) return;

    if (phase === 'warmup') {
      setPhase('workout');
      setTimeLeft(exercise.workoutTime * 60);
    } else if (phase === 'workout') {
      if (currentSet < exercise.sets) {
        setPhase('rest');
        setTimeLeft(exercise.restTime * 60);
      } else {
        setPhase('completed');
        setIsRunning(false);
        addWorkoutHistory(exercise.id, exercise.warmupTime + exercise.workoutTime * exercise.sets + exercise.restTime * (exercise.sets - 1));
      }
    } else if (phase === 'rest') {
      setCurrentSet((prev) => prev + 1);
      setPhase('workout');
      setTimeLeft(exercise.workoutTime * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (!exercise) return;
    setPhase('warmup');
    setTimeLeft(exercise.warmupTime * 60);
    setIsRunning(false);
    setCurrentSet(1);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'warmup':
        return 'from-yellow-500 to-orange-500';
      case 'workout':
        return 'from-gym-red to-pink-600';
      case 'rest':
        return 'from-gym-blue to-blue-600';
      case 'completed':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-gym-red to-gym-blue';
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case 'warmup':
        return '🔥';
      case 'workout':
        return '💪';
      case 'rest':
        return '😌';
      case 'completed':
        return '🎉';
      default:
        return '⏱️';
    }
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center">
        <p className="text-gray-400">Exercise not found</p>
      </div>
    );
  }

  const totalTime = exercise.warmupTime + exercise.workoutTime * exercise.sets + exercise.restTime * (exercise.sets - 1);

  return (
    <div className="min-h-screen bg-gym-black pb-24 pt-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">{exercise.name}</h1>
        <p className="text-gray-400">Total Duration: {totalTime} minutes</p>
      </motion.div>

      {/* Timer Display */}
      <AnimatePresence mode="wait">
        {phase !== 'completed' ? (
          <motion.div
            key="timer"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="px-6 mb-8"
          >
            <div className={`bg-gradient-to-br ${getPhaseColor()} p-8 rounded-3xl shadow-2xl`}>
              {/* Phase Label */}
              <div className="text-center mb-6">
                <span className="text-6xl mb-4 block">{getPhaseIcon()}</span>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                  {phase === 'warmup' && 'Warm Up'}
                  {phase === 'workout' && `Set ${currentSet} of ${exercise.sets}`}
                  {phase === 'rest' && 'Rest Time'}
                </h2>
              </div>

              {/* Timer Circle */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '754', strokeDashoffset: '754' }}
                    animate={{
                      strokeDashoffset: 754 - (754 * timeLeft) / (phase === 'warmup' ? exercise.warmupTime * 60 : phase === 'workout' ? exercise.workoutTime * 60 : exercise.restTime * 60),
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTimer}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg"
                >
                  {isRunning ? '⏸️' : '▶️'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetTimer}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl shadow-lg"
                >
                  🔄
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-6 mb-8"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl text-center">
              <span className="text-8xl mb-4 block">🎉</span>
              <h2 className="text-3xl font-bold text-white mb-4">Workout Complete!</h2>
              <p className="text-white/90 text-lg mb-6">
                Great job! You've completed all {exercise.sets} sets.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl"
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Breakdown */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Workout Breakdown</h3>
        <div className="space-y-3">
          <div className="bg-gym-dark p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <span className="text-gray-300">Warm-up Time</span>
            </div>
            <span className="text-gym-blue font-bold">{exercise.warmupTime} min</span>
          </div>
          <div className="bg-gym-dark p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💪</span>
              <span className="text-gray-300">Workout Time (per set)</span>
            </div>
            <span className="text-gym-red font-bold">{exercise.workoutTime} min</span>
          </div>
          <div className="bg-gym-dark p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">😌</span>
              <span className="text-gray-300">Rest Time (between sets)</span>
            </div>
            <span className="text-gym-blue font-bold">{exercise.restTime} min</span>
          </div>
          <div className="bg-gradient-to-r from-gym-red to-gym-blue p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <span className="text-white font-semibold">Total Session Time</span>
            </div>
            <span className="text-white font-bold text-xl">{totalTime} min</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TimingPage;
