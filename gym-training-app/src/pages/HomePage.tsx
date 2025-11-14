import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { exerciseCategories, exercises } from '../data/exercises';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredExercises =
    selectedCategory === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gym-black pb-24 pt-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-white">GYM</span>
          <span className="text-gym-red">FIT</span>
          <span className="text-gym-blue">PRO</span>
        </h1>
        <p className="text-gray-400">Choose your workout and start training</p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-6"
      >
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-gym-red to-gym-blue text-white'
                : 'bg-gym-dark text-gray-400 hover:text-white'
            }`}
          >
            All Exercises
          </motion.button>
          {exerciseCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-gym-red to-gym-blue text-white'
                  : 'bg-gym-dark text-gray-400 hover:text-white'
              }`}
            >
              {category.icon} {category.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Exercise Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredExercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/exercise/${exercise.id}`)}
            className="bg-gym-dark rounded-2xl overflow-hidden cursor-pointer group relative"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-transparent to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-3 right-3 bg-gym-red/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                {exerciseCategories.find((c) => c.id === exercise.category)?.icon}{' '}
                {exerciseCategories.find((c) => c.id === exercise.category)?.name}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gym-blue transition-colors">
                {exercise.name}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <span className="text-gym-red">●</span> {exercise.sets} Sets
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gym-blue">●</span> {exercise.reps} Reps
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {exercise.muscles.slice(0, 2).map((muscle, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gym-black px-3 py-1 rounded-full text-gym-blue border border-gym-blue/30"
                  >
                    {muscle}
                  </span>
                ))}
                {exercise.muscles.length > 2 && (
                  <span className="text-xs bg-gym-black px-3 py-1 rounded-full text-gray-400">
                    +{exercise.muscles.length - 2} more
                  </span>
                )}
              </div>

              {/* View Details Button */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {exercise.warmupTime + exercise.workoutTime} min total
                </span>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-gym-blue font-semibold text-sm flex items-center gap-2"
                >
                  View Details
                  <span>→</span>
                </motion.button>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-gym-red/10 to-gym-blue/10" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-400 text-lg">No exercises found in this category</p>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
