import { useState, useEffect } from 'react';
import Header from './components/Header';
import CodingStats from './components/CodingStats';
import ContributionHistory from './components/ContributionHistory';
import RepositoryInfo from './components/RepositoryInfo';
import ProfileRating from './components/ProfileRating';
import LoadingSkeleton from './components/LoadingSkeleton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { fetchGitHubData } from './lib/github';
import { CodingStatsData, ContributionHistoryData, RepositoryInfoData, GitHubUser, ProfileRatingData } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetTime, setResetTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [userData, setUserData] = useState<{
    user: GitHubUser;
    codingStats: CodingStatsData[];
    contributionHistory: ContributionHistoryData[];
    repositoryInfo: RepositoryInfoData[];
    profileRating: ProfileRatingData;
    isMock?: boolean;
    resetTime?: number | null;
  } | null>(null);

  useEffect(() => {
    if (resetTime) {
      const timer = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = resetTime - now;
        setTimeLeft(remaining > 0 ? remaining : 0);
        if (remaining <= 0) {
          clearInterval(timer);
          setResetTime(null);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resetTime]);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setUserData(null);
    setResetTime(null);
    setTimeLeft(null);

    try {
      const data = await fetchGitHubData(username);
      setUserData(data);
      if (data.isMock && data.resetTime) {
        setResetTime(data.resetTime);
        const now = Math.floor(Date.now() / 1000);
        setTimeLeft(Math.max(0, data.resetTime - now));
      }
    } catch (err: any) {
      if (err.message.startsWith('RATE_LIMIT')) {
        const resetTimestamp = parseInt(err.message.split(':')[1], 10);
        if (!isNaN(resetTimestamp)) {
          setResetTime(resetTimestamp);
          const now = Math.floor(Date.now() / 1000);
          setTimeLeft(Math.max(0, resetTimestamp - now));
        }
        setError('Rate limit exceeded. Using mock data.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vapor-bg text-vapor-text font-vapor flex flex-col items-center">
      <Header onSearch={handleSearch} isLoading={isLoading} />

      <main className="w-full max-w-6xl px-4 pb-12 flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 bg-white border-4 border-red-500 shadow-[8px_8px_0px_#FF0000] p-8 flex flex-col items-center text-center max-w-2xl w-full"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-3xl font-bold text-red-500 uppercase mb-2">Error</h2>
              <p className="text-xl">{error}</p>
              {error.includes('rate limit') && (
                <div className="mt-4 text-center">
                  {timeLeft !== null && timeLeft > 0 ? (
                    <p className="text-lg font-bold text-vapor-pink">
                      Resets in: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
                    </p>
                  ) : (
                    <p className="text-lg font-bold text-vapor-blue">Rate limit should be reset now.</p>
                  )}
                  <p className="mt-2 text-gray-600 text-sm">
                    To increase your rate limit, please add a <code className="bg-gray-100 px-1 rounded">GITHUB_TOKEN</code> to your Environment Variables in the Settings menu.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {userData && !isLoading && !error && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-12"
            >
              {/* Profile Section */}
              {userData.isMock && (
                <div className="bg-white border-2 border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-black shrink-0" />
                    <p className="text-sm text-black">
                      <strong>API Rate Limit Reached.</strong> Showing a simulated, generated profile for ft976 so you can keep using the app unlimited times!
                    </p>
                  </div>
                  {timeLeft !== null && timeLeft > 0 && (
                    <div className="bg-black text-white px-4 py-2 font-bold text-sm whitespace-nowrap border-2 border-black shadow-[4px_4px_0px_#FF6AD5]">
                      RESETS IN: {Math.floor(timeLeft / 60)}M {timeLeft % 60}S
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-8">
                  <img
                    src={userData.user.avatar_url}
                    alt={`${userData.user.login}'s avatar`}
                    className="w-32 h-32 rounded-full border-4 border-vapor-pink shadow-[4px_4px_0px_#94D0FF]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-bold text-vapor-pink uppercase drop-shadow-[2px_2px_0px_#94D0FF]">
                      {userData.user.name || userData.user.login}
                    </h2>
                    <a
                      href={userData.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-vapor-blue hover:text-vapor-pink transition-colors"
                    >
                      @{userData.user.login}
                    </a>
                    <p className="mt-4 text-lg max-w-2xl">{userData.user.bio || 'NO BIO AVAILABLE.'}</p>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-vapor-blue">
                      {userData.user.location && <span>📍 {userData.user.location}</span>}
                      {userData.user.blog && (
                        <a href={userData.user.blog.startsWith('http') ? userData.user.blog : `https://${userData.user.blog}`} target="_blank" rel="noopener noreferrer" className="hover:text-vapor-pink transition-colors">
                          🔗 {userData.user.blog}
                        </a>
                      )}
                    </div>
                    <div className="mt-4 flex justify-center md:justify-start space-x-6 text-lg font-bold">
                      <span>{userData.user.followers} FOLLOWERS</span>
                      <span>{userData.user.following} FOLLOWING</span>
                      <span>{userData.user.public_repos} REPOS</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <ErrorBoundary componentName="Profile Rating">
                    <ProfileRating rating={userData.profileRating} />
                  </ErrorBoundary>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <ErrorBoundary componentName="Coding Stats">
                    <CodingStats stats={userData.codingStats} repositories={userData.repositoryInfo} />
                  </ErrorBoundary>
                </div>
                <div className="lg:col-span-2">
                  <ErrorBoundary componentName="Contribution History">
                    <ContributionHistory history={userData.contributionHistory} />
                  </ErrorBoundary>
                </div>
              </div>

              <ErrorBoundary componentName="Repository Info">
                <RepositoryInfo repositories={userData.repositoryInfo} username={userData.user.login} />
              </ErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && !error && !userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 text-center text-gray-400 text-2xl uppercase tracking-widest"
          >
            ENTER A USERNAME TO BEGIN
          </motion.div>
        )}
      </main>
    </div>
  );
}

