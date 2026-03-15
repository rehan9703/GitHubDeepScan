import { motion } from 'motion/react';
import { ContributionHistoryData } from '../types';
import { useState } from 'react';

interface ContributionHistoryProps {
  history: ContributionHistoryData[];
}

export default function ContributionHistory({ history }: ContributionHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort history by date descending
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const getLongestStreak = (history: ContributionHistoryData[]) => {
    if (history.length === 0) return 0;
    
    // Get unique dates
    const dates = Array.from(new Set(history.map(item => new Date(item.date).toISOString().split('T')[0])))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      
    if (dates.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i-1]);
        const currDate = new Date(dates[i]);
        const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            currentStreak++;
        } else if (diffDays > 1) {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
        }
    }
    return Math.max(maxStreak, currentStreak);
  };

  const longestStreak = getLongestStreak(history);
  
  const displayedHistory = showAll ? sortedHistory : sortedHistory.slice(0, 5);

  if (!history || history.length === 0) {
    return (
      <div className="bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6 h-full flex items-center justify-center">
        <p className="text-xl text-gray-500">NO CONTRIBUTION HISTORY FOUND.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-vapor-pink mb-6 uppercase tracking-wider drop-shadow-[2px_2px_0px_#94D0FF]">
        Contribution History
      </h2>
      
      <div className="mb-6 bg-vapor-blue text-white p-4 border-4 border-vapor-text shadow-[4px_4px_0px_#FF6AD5] flex justify-between items-center">
        <span className="text-xl font-bold uppercase">Longest Streak</span>
        <span className="text-3xl font-bold">{longestStreak} DAYS</span>
      </div>
      
      <div className="space-y-4 flex-1">
        {displayedHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dashed border-vapor-blue pb-4 last:border-0"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-lg font-bold text-vapor-text uppercase">
                {item.type}
              </span>
              <span className="text-md text-vapor-pink font-bold">
                {item.repository}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(item.date).toLocaleDateString()} - {item.details}
              </span>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center justify-center bg-vapor-blue text-white px-4 py-2 border-2 border-vapor-text shadow-[2px_2px_0px_#FF6AD5]">
              <span className="font-bold text-xl">{item.commits} COMMITS</span>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedHistory.length > 5 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(!showAll)}
          className="mt-6 w-full py-3 bg-vapor-pink text-white font-bold text-xl uppercase border-4 border-vapor-text shadow-[4px_4px_0px_#94D0FF] hover:bg-white hover:text-vapor-pink hover:border-vapor-pink transition-colors"
        >
          {showAll ? 'SHOW LESS' : 'VIEW MORE'}
        </motion.button>
      )}
    </div>
  );
}
