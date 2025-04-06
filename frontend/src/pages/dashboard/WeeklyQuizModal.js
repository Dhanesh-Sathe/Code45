import React from 'react';
import { motion } from 'framer-motion';
import { X, HelpCircle } from 'react-feather';

const WeeklyQuizModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <HelpCircle className="mr-2 text-blue-500" />
            Weekly Progress Quiz
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              Complete this quick quiz to help us understand your progress this week.
              Your answers will help us personalize your learning experience.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Sample quiz questions */}
            <div className="space-y-2">
              <label className="block font-medium">
                How many hours did you study this week?
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option>Less than 5 hours</option>
                <option>5-10 hours</option>
                <option>10-15 hours</option>
                <option>More than 15 hours</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">
                Rate your understanding of this week's topics:
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className="w-10 h-10 rounded-full border border-blue-500 flex items-center justify-center hover:bg-blue-50"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">
                What areas do you need more help with?
              </label>
              <textarea
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="Enter your response here..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyQuizModal;