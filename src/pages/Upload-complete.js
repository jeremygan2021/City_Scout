import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload-complete.css';




function Upload() {
  const navigate = useNavigate();
  
  return (
    <div className="upload-complete-container">
      <div className="upload-complete-card">
        <div className="success-icon">✓</div>
        <h1>感谢您的发布</h1>
        <p>您的物品已经成功发布，感谢您的支持！</p>
        <button 
          className="return-button"
          onClick={() => navigate('/')}
        >
          返回首页
        </button>
      </div>
    </div>
  );
}

export default Upload; 