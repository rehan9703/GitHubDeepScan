import { motion } from 'motion/react';
import { Search, Github } from 'lucide-react';
import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export default function Header({ onSearch, isLoading }: HeaderProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <header className="w-full py-8 px-4 flex flex-col items-center justify-center space-y-6">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center space-x-3"
      >
        <a 
          href="https://github.com/rehan9703/GitHubDeepScan" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center space-x-3"
        >
          <Github className="w-12 h-12 text-vapor-pink drop-shadow-[2px_2px_0px_#94D0FF] group-hover:scale-110 transition-transform" />
          <h1 className="text-5xl md:text-6xl font-bold tracking-widest text-vapor-pink drop-shadow-[3px_3px_0px_#94D0FF] uppercase">
            GitHubScope
          </h1>
        </a>
      </motion.div>

      <a 
        href="https://github.com/rehan9703/GitHubDeepScan" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-vapor-blue hover:text-vapor-pink transition-colors font-bold uppercase tracking-widest text-sm bg-white/10 px-4 py-1 border border-vapor-blue shadow-[2px_2px_0px_#FF6AD5] active:translate-x-0.5 active:translate-y-0.5"
      >
        <Github className="w-4 h-4" />
        <span>View Source Code</span>
      </a>

      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onSubmit={handleSubmit}
        className="w-full max-w-md relative"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ENTER GITHUB USERNAME..."
            className="w-full bg-white border-4 border-vapor-blue text-vapor-text text-xl py-3 pl-4 pr-12 focus:outline-none focus:border-vapor-pink transition-colors shadow-[4px_4px_0px_#FF6AD5]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="absolute right-2 p-2 text-vapor-blue hover:text-vapor-pink transition-colors disabled:opacity-50"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </motion.form>
    </header>
  );
}
