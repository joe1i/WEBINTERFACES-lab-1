import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    birth_date: '',
    password: '',
    password_confirm: ''
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Паролі не співпадають!');
      return;
    }

    try {
      const response = await api.post('auth/register/', formData);
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user
      }));
      navigate('/feed');
    } catch (err) {
      console.error(err);
      setError('Помилка реєстрації. Перевірте введені дані (можливо такий email або username вже існує).');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338] px-4 py-8">
      <div className="max-w-md w-full bg-[#2b2d31] rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#f2f3f5]">Реєстрація</h2>
          <p className="text-[#b5bac1] mt-2">Створіть новий акаунт</p>
        </div>

        {error && (
          <div className="mb-4 text-[#f2f3f5] text-sm text-center bg-[#ed4245]/80 p-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Нікнейм (Username) *</label>
            <input 
              type="text" 
              name="username" 
              required 
              onChange={handleChange} 
              className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Ім'я *</label>
              <input 
                type="text" 
                name="first_name" 
                required 
                onChange={handleChange} 
                className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Прізвище *</label>
              <input 
                type="text" 
                name="last_name" 
                required 
                onChange={handleChange} 
                className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Email *</label>
            <input 
              type="email" 
              name="email" 
              required 
              onChange={handleChange} 
              className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Стать</label>
              <select 
                name="gender" 
                onChange={handleChange} 
                className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow cursor-pointer"
              >
                <option value="">Оберіть</option>
                <option value="M">Чоловіча</option>
                <option value="F">Жіноча</option>
                <option value="O">Інша</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Дата нар.</label>
              <input 
                type="date" 
                name="birth_date" 
                onChange={handleChange} 
                className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow color-scheme-dark" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Пароль *</label>
            <input 
              type="password" 
              name="password" 
              required 
              minLength="8"
              onChange={handleChange} 
              className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#b5bac1] mb-1 uppercase tracking-wide">Підтвердіть пароль *</label>
            <input 
              type="password" 
              name="password_confirm" 
              required 
              minLength="8"
              onChange={handleChange} 
              className="block w-full px-4 py-2 border border-transparent rounded-lg bg-[#1e1f22] text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow" 
            />
          </div>

          <button type="submit" className="w-full mt-6 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
            Зареєструватися
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#b5bac1]">
            Вже є акаунт?{' '}
            <Link to="/login" className="font-medium text-[#00A8FC] hover:underline">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;