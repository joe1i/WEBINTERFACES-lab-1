import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/profile/');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Помилка завантаження профілю:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login');
  };

  const startEditingBio = () => {
    setBioText(user?.bio || '');
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    try {
      const response = await api.patch('auth/profile/', { bio: bioText });
      setUser(response.data);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Помилка збереження біо:", error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.patch('auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Помилка завантаження аватара:", error);
      alert("Не вдалося завантажити фото. Перевірте формат.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338]">
      <p className="text-xl font-bold text-[#b5bac1]">Завантаження профілю...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#313338] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-[#2b2d31] rounded-xl shadow-lg overflow-hidden border border-transparent">
        
        <div className="bg-[#1e1f22] px-6 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#f2f3f5]">Мій Профіль</h2>
          <div className="flex gap-3">
            <Link to="/feed" className="text-[#b5bac1] hover:text-[#f2f3f5] font-medium text-sm border border-[#4e5058] hover:bg-[#4e5058] rounded px-3 py-1 transition-colors">
              Стрічка
            </Link>
            <button 
              onClick={handleLogout}
              className="text-[#b5bac1] hover:text-[#ed4245] font-medium text-sm border border-[#4e5058] hover:border-[#ed4245] hover:bg-[#ed4245]/10 rounded px-3 py-1 transition-colors"
            >
              Вийти
            </button>
          </div>
        </div>
        
        <div className="p-6 sm:p-10">
          <div className="flex items-center mb-8">
            <div 
              className="relative w-24 h-24 bg-[#1e1f22] rounded-full flex items-center justify-center text-[#f2f3f5] text-4xl font-bold shadow-sm uppercase cursor-pointer overflow-hidden group border-2 border-transparent hover:border-[#5865F2] transition-all"
              onClick={() => fileInputRef.current.click()}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.username ? user.username.charAt(0) : user?.email.charAt(0)
              )}
              
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                <span className="text-xs font-normal text-white">Змінити</span>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              className="hidden" 
            />

            <div className="ml-6">
              <h3 className="text-2xl font-bold text-[#f2f3f5]">{user?.username || 'Користувач'}</h3>
            </div>
          </div>

          <div className="border border-[#1e1f22] rounded-lg overflow-hidden">
            <dl>
              <div className="bg-[#1e1f22] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-[#313338]">
                <dt className="text-sm font-medium text-[#b5bac1]">Повне ім'я</dt>
                <dd className="mt-1 text-sm font-semibold text-[#dbdee1] sm:mt-0 sm:col-span-2">
                  {user?.first_name || user?.last_name ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() : 'Не вказано'}
                </dd>
              </div>
              <div className="bg-[#2b2d31] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-[#1e1f22]">
                <dt className="text-sm font-medium text-[#b5bac1]">Email</dt>
                <dd className="mt-1 text-sm font-semibold text-[#dbdee1] sm:mt-0 sm:col-span-2">{user?.email}</dd>
              </div>
              <div className="bg-[#1e1f22] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-[#313338]">
                <dt className="text-sm font-medium text-[#b5bac1]">Стать</dt>
                <dd className="mt-1 text-sm font-semibold text-[#dbdee1] sm:mt-0 sm:col-span-2">
                  {user?.gender === 'M' ? 'Чоловіча' : user?.gender === 'F' ? 'Жіноча' : user?.gender === 'O' ? 'Інша' : 'Не вказано'}
                </dd>
              </div>
              <div className="bg-[#2b2d31] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[#b5bac1]">Дата народження</dt>
                <dd className="mt-1 text-sm font-semibold text-[#dbdee1] sm:mt-0 sm:col-span-2">{user?.birth_date || 'Не вказано'}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 p-4 bg-[#1e1f22] rounded-lg border border-transparent">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-[#f2f3f5]">Про себе:</h4>
              {!isEditingBio && (
                <button 
                  onClick={startEditingBio} 
                  className="text-xs font-medium text-[#b5bac1] hover:text-[#f2f3f5] transition-colors"
                >
                  ✎ Редагувати
                </button>
              )}
            </div>

            {isEditingBio ? (
              <div className="mt-2">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  placeholder="Розкажіть трохи про себе..."
                  rows="3"
                  className="w-full bg-[#2b2d31] text-[#dbdee1] p-3 rounded-md border border-transparent focus:outline-none focus:ring-1 focus:ring-[#5865F2] resize-none"
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button 
                    onClick={() => setIsEditingBio(false)} 
                    className="text-sm text-[#b5bac1] hover:text-[#f2f3f5] transition-colors"
                  >
                    Скасувати
                  </button>
                  <button 
                    onClick={handleSaveBio} 
                    className="text-sm bg-[#5865F2] text-white px-4 py-1.5 rounded hover:bg-[#4752c4] transition-colors"
                  >
                    Зберегти
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[#dbdee1] italic">
                {user?.bio ? user.bio : <span className="text-[#b5bac1] not-italic text-sm">Інформація відсутня.</span>}
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;