import { motion } from 'motion/react';
import { ProfileRatingData } from '../types';
import { Activity, Info } from 'lucide-react';

interface ProfileRatingProps {
  rating: ProfileRatingData;
}

export default function ProfileRating({ rating }: ProfileRatingProps) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-center space-x-2 text-vapor-blue mb-4">
        <Activity className="w-5 h-5" />
        <h3 className="text-xl font-bold uppercase tracking-widest">Profile Rating</h3>
      </div>
      
      <div className="flex flex-col items-center justify-center text-center mb-6 border-b-2 border-dashed border-vapor-blue pb-6">
        <motion.div 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className={`text-6xl md:text-8xl font-bold my-2 ${rating.colorClass}`}
        >
          {rating.tier}
        </motion.div>
        
        <div className="text-2xl font-bold text-vapor-text uppercase tracking-widest mb-1">
          {rating.title}
        </div>
        
        <div className="text-gray-500 font-bold">
          OVERALL SCORE: {rating.score}/100
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <h4 className="font-bold text-vapor-pink uppercase tracking-wider mb-2">Metrics Breakdown</h4>
        {rating.metrics.map((metric, index) => (
          <div key={metric.name} className="relative group">
            <div className="flex justify-between text-sm font-bold uppercase mb-1">
              <span className="flex items-center space-x-1">
                <span>{metric.name}</span>
                <Info className="w-3 h-3 text-gray-400 cursor-help" />
              </span>
              <span className="text-vapor-blue">{metric.score}/100</span>
            </div>
            <div className="h-3 w-full bg-gray-200 border-2 border-vapor-text">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.score}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full bg-vapor-pink"
              />
            </div>
            
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-vapor-text text-white text-xs p-2 z-10 w-full shadow-[4px_4px_0px_#94D0FF]">
              {metric.description}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
