import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Info = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await api.get('info/');
        setInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Помилка завантаження інформації про додаток:", error);
        setLoading(false);
      }
    };
    
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#313338]">
        <p className="text-xl font-bold text-[#b5bac1]">Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#313338] py-10 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#2b2d31] rounded-xl shadow-lg overflow-hidden text-center p-10 border border-transparent">
        
        <div className="mx-auto w-32 h-32 bg-[#1e1f22] rounded-full flex items-center justify-center mb-6 shadow-inner">
          <span className="text-6xl" role="img" aria-label="emblem">📢</span>
        </div>

        <h1 className="text-4xl font-extrabold text-[#f2f3f5] mb-4">
          {info?.name || 'Канал Оголошень'}
        </h1>

        <div className="inline-block bg-[#1e1f22] text-[#f2f3f5] text-sm font-semibold px-4 py-1 rounded-full mb-6">
          Версія {info?.version || '1.0.0'}
        </div>

        <p className="text-lg text-[#b5bac1] mb-6 leading-relaxed px-4">
          {info?.description}
        </p>

        {info?.features && info.features.length > 0 && (
          <div className="text-left bg-[#1e1f22] rounded-lg p-6 mb-8 border border-transparent">
            <h3 className="font-bold text-[#f2f3f5] mb-3">Основні можливості:</h3>
            <ul className="list-disc list-inside space-y-2 text-[#dbdee1]">
              {info.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8 text-sm text-[#b5bac1]">
          Автор: <span className="font-semibold text-[#f2f3f5]">{info?.author}</span> | 
          Контакт: <span className="text-[#00A8FC] hover:underline">{info?.contact}</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            to="/profile" 
            className="w-full sm:w-auto px-8 py-3 bg-[#4e5058] text-[#f2f3f5] font-medium rounded-lg hover:bg-[#6d6f78] transition-colors"
          >
            Мій профіль
          </Link>
          <Link 
            to="/feed" 
            className="w-full sm:w-auto px-8 py-3 bg-[#5865F2] text-white font-medium rounded-lg hover:bg-[#4752c4] transition-colors shadow-md hover:shadow-lg"
          >
            Стрічка оголошень
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Info;