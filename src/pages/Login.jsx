import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('auth/login/', {
        email: email,
        password: password
      });

      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user
      }));

      navigate('/feed');
      
    } catch (err) {
      setError('Помилка входу. Перевірте email та пароль.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338] px-4">
      <div className="max-w-md w-full bg-[#2b2d31] rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-[#1e1f22] rounded-full flex items-center justify-center mb-5 shadow-inner">
            <span className="text-4xl" role="img" aria-label="emblem">📢</span>
          </div>
          
          <h2 className="text-3xl font-bold text-[#f2f3f5]">Канал Оголошень</h2>
          <p className="text-[#b5bac1] mt-2">Увійдіть до свого акаунту</p>
        </div>

        {error && (
          <div className="mb-4 text-[#f2f3f5] text-sm text-center bg-[#ed4245]/80 p-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#b5bac1] mb-2 uppercase tracking-wide">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#b5bac1] mb-2 uppercase tracking-wide">
              Пароль
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
            />
          </div>

          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
            Увійти
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#b5bac1]">
            Немає акаунту? <Link to="/register" className="font-medium text-[#00A8FC] hover:underline">Зареєструватися</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;