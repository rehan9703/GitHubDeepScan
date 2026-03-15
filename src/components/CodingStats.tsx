import { motion } from 'motion/react';
import { CodingStatsData, RepositoryInfoData } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CodingStatsProps {
  stats: CodingStatsData[];
  repositories: RepositoryInfoData[];
}

export default function CodingStats({ stats, repositories }: CodingStatsProps) {
  const totalStars = repositories.reduce((acc, repo) => acc + repo.stars, 0);
  const totalForks = repositories.reduce((acc, repo) => acc + repo.forks, 0);
  const totalRepos = repositories.length;

  const starRanges = [
    { name: '0-50', min: 0, max: 50 },
    { name: '51-200', min: 51, max: 200 },
    { name: '201-500', min: 201, max: 500 },
    { name: '500+', min: 501, max: Infinity },
  ];

  const starDistribution = starRanges.map(range => ({
    name: range.name,
    count: repositories.filter(repo => repo.stars >= range.min && repo.stars <= range.max).length,
  }));

  return (
    <div className="bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6 h-full">
      <h2 className="text-3xl font-bold text-vapor-pink mb-6 uppercase tracking-wider drop-shadow-[2px_2px_0px_#94D0FF]">
        Coding Stats
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center border-2 border-vapor-pink p-2">
          <div className="text-2xl font-bold text-vapor-text">{totalRepos}</div>
          <div className="text-xs uppercase text-gray-500">Repos</div>
        </div>
        <div className="text-center border-2 border-vapor-blue p-2">
          <div className="text-2xl font-bold text-vapor-text">{totalStars}</div>
          <div className="text-xs uppercase text-gray-500">Stars</div>
        </div>
        <div className="text-center border-2 border-vapor-pink p-2">
          <div className="text-2xl font-bold text-vapor-text">{totalForks}</div>
          <div className="text-xs uppercase text-gray-500">Forks</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-vapor-blue mb-4 uppercase">Star Distribution</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={starDistribution}>
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count">
                {starDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FF6AD5' : '#94D0FF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="space-y-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.language}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-end">
              <span className="text-xl font-bold text-vapor-text uppercase">
                {stat.language}
              </span>
              <div className="text-right">
                <span className="text-lg text-vapor-blue font-bold mr-3">
                  {stat.repoCount} REPOS
                </span>
                <span className="text-xl text-vapor-pink font-bold">
                  {stat.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="w-full h-4 bg-gray-100 border-2 border-vapor-text overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-vapor-blue to-vapor-pink"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
