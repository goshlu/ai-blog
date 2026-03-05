'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, FileText, BookOpen, Loader2 } from 'lucide-react';

interface SearchResult {
  posts: Array<{ id: string; slug: string; title: string; date: string; excerpt: string }>;
  notes: Array<{ id: string; title: string; date: string }>;
}

export function SearchBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'notes'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 搜索请求
  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${activeTab}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query, activeTab]);

  // 获取所有结果用于键盘导航
  const getAllResults = useCallback(() => {
    if (!results) return [];
    if (activeTab === 'notes') return results.notes.map(n => ({ ...n, type: 'note' as const }));
    if (activeTab === 'posts') return results.posts.map(p => ({ ...p, type: 'post' as const }));
    return [
      ...results.posts.map(p => ({ ...p, type: 'post' as const })),
      ...results.notes.map(n => ({ ...n, type: 'note' as const }))
    ];
  }, [results, activeTab]);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allResults = getAllResults();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && allResults.length > 0) {
      const item = allResults[selectedIndex];
      if (item.type === 'post') {
        window.location.href = `/posts/${item.slug}`;
      } else {
        window.location.href = `/notes/${item.id}`;
      }
    }
  };

  const totalResults = results ? results.posts.length + results.notes.length : 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">搜索</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          role="dialog"
          aria-modal="true"
        >
          {/* 遮罩层 - 更纯净的模糊效果 */}
          <div 
            className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-md animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* 搜索弹窗 - 极致悬浮感 */}
          <div 
            ref={modalRef}
            className="relative w-full max-w-xl bg-white/100 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_1px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.04),0_24px_64px_rgba(0,0,0,0.12)] dark:shadow-[0_0_1px_rgba(255,255,255,0.1),0_24px_64px_rgba(0,0,0,0.5)] border border-white/40 dark:border-zinc-800/50 overflow-hidden animate-scale-in"
            onKeyDown={handleKeyDown}
          >
            {/* 顶部：搜索输入与控制 */}
            <div className="flex items-center gap-4 px-8 pt-8 pb-4">
              <div className="relative flex-1 flex items-center gap-4">
                <Search className="w-6 h-6 text-pink-500 shrink-0 opacity-80" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索文章和手记..."
                  className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400/60 text-xl font-light tracking-tight"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin shrink-0" />
                ) : query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all hover:scale-110 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 中间：筛选器 */}
            <div className="flex items-center gap-2 px-8 pb-6 overflow-x-auto no-scrollbar">
              {(['all', 'posts', 'notes'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-1.5 text-xs rounded-full transition-all duration-300 whitespace-nowrap ${
                      isSelected
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium shadow-lg shadow-zinc-900/10 dark:shadow-white/5 scale-105'
                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {tab === 'all' ? '全部内容' : tab === 'posts' ? '精选文稿' : '琐碎手记'}
                  </button>
                );
              })}
            </div>

            {/* 底部：结果展示区 */}
            <div className="max-h-[55vh] overflow-y-auto px-4 pb-8 custom-scrollbar scroll-smooth">
              {query && totalResults === 0 && !loading && (
                <div className="py-16 text-center animate-fade-in">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-pink-100 dark:bg-pink-900/20 rounded-3xl rotate-12 animate-pulse" />
                    <div className="absolute inset-0 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-pink-100 dark:border-pink-900/30">
                      <Search className="w-8 h-8 text-pink-400" />
                    </div>
                  </div>
                  <p className="text-zinc-900 dark:text-zinc-100 font-medium">没能找到相关内容</p>
                  <p className="text-sm text-zinc-400 mt-1 font-light px-10">
                    换个关键词试试？或者在导航栏看看其他分类。
                  </p>
                </div>
              )}

              {results && totalResults > 0 && (
                <div className="space-y-8 pt-2">
                  {activeTab !== 'notes' && results.posts.length > 0 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-3 px-4 mb-3">
                        <div className="w-1 h-3 bg-pink-500 rounded-full" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Posts</span>
                      </div>
                      <div className="space-y-2">
                        {results.posts.map((post, idx) => {
                          const isSelected = activeTab === 'all' ? selectedIndex === idx : selectedIndex === idx;
                          return (
                            <Link
                              key={post.id}
                              href={`/posts/${post.slug}`}
                              onClick={() => setIsOpen(false)}
                              className={`group relative flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-white dark:bg-zinc-800 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-none ring-1 ring-zinc-200/50 dark:ring-zinc-700/50 translate-x-1' 
                                  : 'hover:bg-white/40 dark:hover:bg-zinc-800/40 hover:translate-x-1'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20 rotate-3' 
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:scale-110'
                              }`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-1">
                                  {post.title}
                                </div>
                                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate font-light leading-relaxed">
                                  {post.excerpt || post.date}
                                </div>
                              </div>
                              <div className={`shrink-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-zinc-400">⏎</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab !== 'posts' && results.notes.length > 0 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-3 px-4 mb-3">
                        <div className="w-1 h-3 bg-purple-500 rounded-full" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Notes</span>
                      </div>
                      <div className="space-y-2">
                        {results.notes.map((note, idx) => {
                          const offset = activeTab === 'all' ? results.posts.length : 0;
                          const isSelected = activeTab === 'all' ? selectedIndex === offset + idx : selectedIndex === idx;
                          return (
                            <Link
                              key={note.id}
                              href={`/notes/${note.id}`}
                              onClick={() => setIsOpen(false)}
                              className={`group relative flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-white dark:bg-zinc-800 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-none ring-1 ring-zinc-200/50 dark:ring-zinc-700/50 translate-x-1' 
                                  : 'hover:bg-white/40 dark:hover:bg-zinc-800/40 hover:translate-x-1'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20 -rotate-3' 
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:scale-110'
                              }`}>
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-1">
                                  {note.title}
                                </div>
                                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                                  {note.date}
                                </div>
                              </div>
                              <div className={`shrink-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-zinc-400">⏎</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!query && (
                <div className="py-24 text-center animate-fade-in">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-500/5 dark:to-purple-500/5 blur-2xl rounded-full" />
                    <div className="relative w-full h-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white dark:border-zinc-700/50 shadow-inner overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
                      <Search className="w-10 h-10 text-pink-400/80" />
                    </div>
                  </div>
                  <p className="text-zinc-900 dark:text-zinc-100 font-medium">寻找灵感或特定的记忆</p>
                  <p className="text-sm text-zinc-400 mt-1 font-light">
                    输入标题、内容或日期，我们为你精准定位。
                  </p>
                  
                  <div className="mt-12 flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <kbd className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm text-xs font-bold text-zinc-400">↑↓</kbd>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-300">导航</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <kbd className="w-12 h-8 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm text-[10px] font-bold text-zinc-400">ENTER</kbd>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-300">打开</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <kbd className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm text-[10px] font-bold text-zinc-400">ESC</kbd>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-300">关闭</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
