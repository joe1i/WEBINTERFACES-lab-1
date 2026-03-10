import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Feed = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ordering, setOrdering] = useState('-created_at');
  const [hasReaction, setHasReaction] = useState('');
  const [minLikes, setMinLikes] = useState('');
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [viewedPosts, setViewedPosts] = useState(new Set());

  useEffect(() => {
    fetchAnnouncements();
  }, [ordering, hasReaction, minLikes]);

  const fetchAnnouncements = async () => {
    try {
      const params = {};
      if (ordering) params.ordering = ordering;
      if (hasReaction) params.has_reaction = hasReaction;
      if (minLikes) params.min_likes = minLikes;

      const response = await api.get('announcements/', { params });
      const announcementsData = response.data.results ? response.data.results : response.data;
      
      if (Array.isArray(announcementsData)) {
        setAnnouncements(announcementsData);
      } else {
        console.error(response.data);
        setAnnouncements([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleReaction = async (announcementId, reactionType) => {
    try {
      await api.post('reactions/toggle/', {
        announcement: announcementId,
        reaction_type: reactionType
      });
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = async (id) => {
    setExpandedPosts(prev => new Set(prev).add(id));
    if (viewedPosts.has(id)) return;

    try {
      const response = await api.get(`announcements/${id}/`);
      setAnnouncements(prev => prev.map(post => 
        post.id === id ? { ...post, views_count: response.data.views_count } : post
      ));
      
      setViewedPosts(prev => new Set(prev).add(id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#313338]">
        <p className="text-xl font-bold text-[#b5bac1]">Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#313338] pb-10">
      <nav className="bg-[#1e1f22] shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-[#f2f3f5] text-xl font-bold flex items-center gap-2">
            <span>📢</span> Стрічка оголошень
          </h1>
          <div className="flex gap-4">
            <Link to="/info" className="text-[#b5bac1] hover:text-[#f2f3f5] text-sm font-medium transition">Про додаток</Link>
            <Link to="/profile" className="text-[#b5bac1] hover:text-[#f2f3f5] text-sm font-medium transition">Профіль</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-6 px-4">
        {/* Sorting */}
        <div className="bg-[#2b2d31] p-4 rounded-xl shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-center border border-transparent gap-4">
          <p className="text-[#b5bac1] font-medium whitespace-nowrap">
            Оголошення ({announcements.length})
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select 
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="border border-transparent rounded-lg px-3 py-2 text-sm text-[#f2f3f5] focus:ring-[#5865F2] focus:border-[#5865F2] bg-[#1e1f22] cursor-pointer"
            >
              <option value="-created_at">Сортувати: Новіші</option>
              <option value="created_at">Сортувати: Старіші</option>
              <option value="-views_count">Популярні (перегляди)</option>
              <option value="-likes_count">Найбільше 👍</option>
              <option value="-fire_count">Найбільше 🔥</option>
            </select>

            <select 
              value={hasReaction}
              onChange={(e) => setHasReaction(e.target.value)}
              className="border border-transparent rounded-lg px-3 py-2 text-sm text-[#f2f3f5] focus:ring-[#5865F2] focus:border-[#5865F2] bg-[#1e1f22] cursor-pointer"
            >
              <option value="">Усі реакції</option>
              <option value="like">Є реакція 👍</option>
              <option value="heart">Є реакція ❤️</option>
              <option value="fire">Є реакція 🔥</option>
              <option value="sad">Є реакція 😢</option>
            </select>

            <div className="flex items-center gap-2 border border-transparent rounded-lg px-3 py-2 bg-[#1e1f22]">
              <span className="text-sm text-[#b5bac1]">Мін. 👍:</span>
              <input 
                type="number" 
                min="0"
                value={minLikes}
                onChange={(e) => setMinLikes(e.target.value)}
                placeholder="0"
                className="w-12 bg-transparent text-sm text-[#f2f3f5] focus:outline-none placeholder-[#b5bac1]"
              />
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6 max-w-6xl mx-auto">
          {announcements.length === 0 ? (
            <div className="text-center py-10 bg-[#2b2d31] rounded-xl shadow-sm border border-transparent">
              <p className="text-[#b5bac1] text-lg">Оголошень не знайдено. 📭</p>
            </div>
          ) : (
            announcements.map((post) => {
              const isExpanded = expandedPosts.has(post.id);
              const shouldTruncate = post.content && post.content.length > 200;

              return (
                <div key={post.id} className="bg-[#2b2d31] rounded-xl shadow-md overflow-hidden transition-shadow border border-transparent">
                  <div className="p-5 pb-3 flex justify-between items-start border-b border-[#1e1f22]">
                    <div className="flex items-center gap-3">
                      {post.author_avatar ? (
                        <img 
                          src={post.author_avatar} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full object-cover border border-[#1e1f22]" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#1e1f22] rounded-full flex items-center justify-center text-[#f2f3f5] font-bold uppercase">
                          {post.author_name ? post.author_name.charAt(0) : 'К'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-[#f2f3f5]">{post.author_name || 'Користувач'}</h3>
                        <h3 className="text-xs text-[#b5bac1]">@{post.author_username || 'Користувач'}</h3>
                        <p className="text-xs text-[#b5bac1] mt-0.5">
                          {new Date(post.created_at).toLocaleString('uk-UA')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${viewedPosts.has(post.id) ? 'bg-[#5865F2]/20 text-[#f2f3f5]' : 'bg-[#1e1f22] text-[#b5bac1]'}`}>
                      <span>👁️</span> {post.views_count || 0}
                    </div>
                  </div>

                  <div 
                    className={`cursor-pointer group ${!isExpanded ? 'hover:bg-[#313338]/30 transition-colors' : ''}`}
                    onClick={() => {
                      if (!isExpanded) handleView(post.id);
                    }}
                  >
                    {post.title && (
                      <div className="px-5 pt-4">
                        <h2 className={`text-xl font-bold transition-colors ${!isExpanded ? 'group-hover:text-[#00A8FC] text-[#f2f3f5]' : 'text-[#f2f3f5]'}`}>
                          {post.title}
                        </h2>
                      </div>
                    )}

                    {post.image && (
                      <div className="px-5 pt-3">
                        <img 
                          src={post.image} 
                          alt={post.title || "Зображення"} 
                          className="w-full max-h-96 object-cover rounded-lg border border-transparent shadow-sm"
                        />
                      </div>
                    )}

                    <div className="p-5 text-[#dbdee1] leading-relaxed text-base whitespace-pre-line">
                      {isExpanded ? (
                        post.content 
                      ) : (
                        shouldTruncate ? `${post.content.substring(0, 200)}...` : post.content
                      )}
                      
                      {!isExpanded && (
                        <span className="block mt-2 font-medium text-[#00A8FC] hover:underline">
                          {shouldTruncate ? "Показати більше" : "👁️ Переглянуто"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reactions */}
                  <div className="px-5 py-3 bg-[#2b2d31] border-t border-[#1e1f22] flex gap-2">
                    {[
                      { type: 'like', icon: '👍' },
                      { type: 'heart', icon: '❤️' },
                      { type: 'fire', icon: '🔥' },
                      { type: 'sad', icon: '😢' }
                    ].map((btn) => (
                      <button
                        key={btn.type}
                        onClick={() => handleReaction(post.id, btn.type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full transition text-sm font-medium 
                          ${post.user_reaction === btn.type 
                            ? 'bg-[#5865F2]/20 border-[#5865F2] text-[#f2f3f5] shadow-sm' 
                            : 'bg-[#2b2d31] border-transparent text-[#b5bac1] hover:bg-[#3f4147]' 
                          }`}
                      >
                        <span>{btn.icon}</span> {post.reactions_summary?.[btn.type] || 0}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;