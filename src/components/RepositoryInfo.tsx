import { motion, AnimatePresence } from 'motion/react';
import { RepositoryInfoData, CommitData } from '../types';
import { useState } from 'react';
import { Star, GitFork, ExternalLink, ChevronDown, ChevronUp, FileText, GitCommit, Copy, Check } from 'lucide-react';
import { fetchRepoReadme, fetchRepoCommits } from '../lib/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, atomDark, dracula, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const themes = {
  vscDarkPlus,
  atomDark,
  dracula,
  tomorrow,
};

const CodeBlock = ({ language, value, theme }: { language: string; value: string; theme: keyof typeof themes }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-1 bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-white"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </button>
      <SyntaxHighlighter language={language} style={themes[theme]}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

function RepoDescription({ description, isExpandedRepo }: { description: string | null; isExpandedRepo: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = description || 'NO DESCRIPTION PROVIDED.';
  const isLong = text.length > 100;

  // If the whole repo card is expanded, we might want to show full description anyway,
  // but let's stick to the local read more toggle for the description itself.
  
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600">
        {isExpanded || isExpandedRepo ? text : (isLong ? `${text.substring(0, 100).trim()}...` : text)}
      </p>
      {isLong && !isExpandedRepo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-xs text-vapor-pink hover:text-vapor-blue font-bold mt-1 uppercase transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

interface RepositoryInfoProps {
  repositories: RepositoryInfoData[];
  username: string;
}

export default function RepositoryInfo({ repositories, username }: RepositoryInfoProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [readmes, setReadmes] = useState<Record<number, { content: string; loading: boolean }>>({});
  const [commits, setCommits] = useState<Record<number, { data: CommitData[]; loading: boolean }>>({});
  const [theme, setTheme] = useState<keyof typeof themes>('vscDarkPlus');

  const handleExpand = async (repo: RepositoryInfoData) => {
    const isExpanding = expandedId !== repo.id;
    setExpandedId(isExpanding ? repo.id : null);

    if (isExpanding) {
      if (!readmes[repo.id]) {
        setReadmes((prev) => ({ ...prev, [repo.id]: { content: '', loading: true } }));
        try {
          const content = await fetchRepoReadme(username, repo.repository_name);
          setReadmes((prev) => ({ ...prev, [repo.id]: { content, loading: false } }));
        } catch (error) {
          setReadmes((prev) => ({
            ...prev,
            [repo.id]: { content: 'FAILED TO LOAD README.', loading: false },
          }));
        }
      }

      if (!commits[repo.id]) {
        setCommits((prev) => ({ ...prev, [repo.id]: { data: [], loading: true } }));
        try {
          const recentCommits = await fetchRepoCommits(username, repo.repository_name);
          setCommits((prev) => ({ ...prev, [repo.id]: { data: recentCommits, loading: false } }));
        } catch (error) {
          setCommits((prev) => ({
            ...prev,
            [repo.id]: { data: [], loading: false },
          }));
        }
      }
    }
  };

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6 h-full flex items-center justify-center">
        <p className="text-xl text-gray-500">NO REPOSITORIES FOUND.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-vapor-blue shadow-[8px_8px_0px_#FF6AD5] p-6 h-full">
      <h2 className="text-3xl font-bold text-vapor-pink mb-6 uppercase tracking-wider drop-shadow-[2px_2px_0px_#94D0FF]">
        Repository Info
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {repositories.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className={`border-4 border-vapor-pink p-4 flex flex-col justify-between bg-white shadow-[4px_4px_0px_#94D0FF] hover:shadow-[6px_6px_0px_#94D0FF] transition-all cursor-pointer ${
              expandedId === repo.id ? 'md:col-span-2' : ''
            }`}
            onClick={() => handleExpand(repo)}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-vapor-text uppercase truncate pr-2" title={repo.repository_name}>
                  {repo.repository_name}
                </h3>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vapor-blue hover:text-vapor-pink transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              
              <RepoDescription description={repo.description} isExpandedRepo={expandedId === repo.id} />
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-dashed border-vapor-blue">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1 text-vapor-pink">
                  <Star className="w-4 h-4" />
                  <span className="font-bold">{repo.stars}</span>
                </div>
                <div className="flex items-center space-x-1 text-vapor-blue">
                  <GitFork className="w-4 h-4" />
                  <span className="font-bold">{repo.forks}</span>
                </div>
              </div>
              <div className="text-sm font-bold uppercase text-vapor-text">
                {repo.language || 'UNKNOWN'}
              </div>
            </div>

            <div className="flex justify-center mt-2 text-gray-400">
              {expandedId === repo.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>

            <AnimatePresence>
              {expandedId === repo.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-2 border-t-2 border-vapor-pink text-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <p><strong>Last Active:</strong> {new Date(repo.last_active).toLocaleDateString()}</p>
                      <a
                        href={`${repo.url}/commits`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-vapor-pink hover:underline font-bold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        VIEW ALL COMMITS
                      </a>
                    </div>

                    {/* Recent Commits Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="mt-4 border-2 border-vapor-blue p-4 bg-gray-50"
                    >
                      <div className="flex items-center space-x-2 mb-4 text-vapor-blue border-b-2 border-dashed border-vapor-blue pb-2">
                        <GitCommit className="w-5 h-5" />
                        <h4 className="font-bold text-lg uppercase">Recent Commits</h4>
                      </div>
                      
                      {commits[repo.id]?.loading ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vapor-pink"></div>
                        </div>
                      ) : commits[repo.id]?.data.length > 0 ? (
                        <ul className="space-y-3">
                          {commits[repo.id].data.map((commit) => (
                            <li key={commit.sha} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-2 last:border-0">
                              <span className="font-bold text-vapor-text truncate max-w-md" title={commit.message}>
                                {commit.message}
                              </span>
                              <div className="flex flex-col items-end mt-1 sm:mt-0">
                                <div className="flex flex-col items-end space-y-0.5">
                                  <span className="text-vapor-blue text-xs font-bold" title="Author">
                                    Author: {commit.author}
                                  </span>
                                  {commit.contributor && (
                                    <span className="text-vapor-pink text-xs font-bold" title="Contributor">
                                      Contributor: {commit.contributor}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-gray-500 text-xs">
                                    {new Date(commit.date).toLocaleDateString()}
                                  </span>
                                  <a 
                                    href={commit.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-vapor-pink hover:text-vapor-blue font-mono text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {commit.sha.substring(0, 7)}
                                  </a>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">NO RECENT COMMITS FOUND.</p>
                      )}
                    </motion.div>
                    
                    {/* README Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="mt-6 border-2 border-vapor-blue p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-4 text-vapor-blue border-b-2 border-dashed border-vapor-blue pb-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5" />
                          <h4 className="font-bold text-lg uppercase">README.md</h4>
                        </div>
                        <select 
                          value={theme} 
                          onChange={(e) => setTheme(e.target.value as keyof typeof themes)}
                          className="text-xs border border-vapor-blue bg-white p-1 uppercase font-bold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {Object.keys(themes).map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      
                      {readmes[repo.id]?.loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vapor-pink"></div>
                        </div>
                      ) : (
                        <div className="prose prose-vapor max-w-none prose-sm sm:prose-base overflow-x-auto">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                              img: ({node, ...props}) => {
                                let src = props.src;
                                if (src) {
                                  if (src.startsWith('http')) {
                                    if (src.includes('github.com') && src.includes('/blob/')) {
                                      src = src.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                                    }
                                  } else if (!src.startsWith('data:')) {
                                    const cleanSrc = src.replace(/^(\.\/|\/)+/, '');
                                    src = `https://raw.githubusercontent.com/${username}/${repo.repository_name}/${repo.default_branch || 'main'}/${cleanSrc}`;
                                  }
                                }
                                return <img {...props} src={src} loading="lazy" />;
                              },
                              code: ({className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                  <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} theme={theme} />
                                ) : (
                                  <code className={className} {...props}>{children}</code>
                                );
                              },
                              a: ({node, ...props}) => {
                                let href = props.href;
                                if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')) {
                                  const cleanHref = href.replace(/^(\.\/|\/)+/, '');
                                  href = `https://github.com/${username}/${repo.repository_name}/blob/${repo.default_branch || 'main'}/${cleanHref}`;
                                }
                                return <a {...props} href={href} target="_blank" rel="noopener noreferrer" />;
                              }
                            }}
                          >
                            {readmes[repo.id]?.content || 'NO README FOUND.'}
                          </ReactMarkdown>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
