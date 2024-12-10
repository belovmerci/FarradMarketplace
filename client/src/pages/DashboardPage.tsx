import React from 'react';
import { useApp } from '../contexts/AppContext';
import '../styles/general.css';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useApp();

  if (!isAuthenticated) {
    return <p>Пожалуйста, авторизуйтесь для использования панели пользователя.</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Добро пожаловать, {user.username}!</p>
          <p>Ваш уникальный ID: {user.id}</p>
          <button onClick={logout}>Выход</button>
        </>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </div>
  );
};

export default DashboardPage;
