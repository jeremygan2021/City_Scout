import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const DetailContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  color: #fff;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0;
    overflow-x: hidden;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('/assets/grid.svg') repeat;
    opacity: 0.1;
    pointer-events: none;
  }
`;

const InfoContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0;
    margin: 0;
    width: 100%;
  }
`;

const InfoCard = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(94, 234, 212, 0.2);
  }
`;

const PrintableContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 24px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(94, 234, 212, 0.2);
  box-shadow: 0 0 40px rgba(94, 234, 212, 0.1);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 16px;
    margin: 0;
    width: 100%;
    max-width: none;
    
    &::before {
      display: none;
    }
    
    border: 1px solid rgba(94, 234, 212, 0.2);
    
    h1 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    
    h2 {
      font-size: 1.4rem;
      margin: 1rem 0;
    }
  }
`;

const ItemHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .header-content {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
  }

  h1 {
    color: #5EEAD4;
    font-size: 2.8rem;
    margin: 0;
    text-shadow: 0 0 20px rgba(94, 234, 212, 0.3);
    font-weight: 700;
    width: 100%;
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
  
  .header-badges {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    
    @media (max-width: 768px) {
      gap: 0.5rem;
    }
  }
`;

const RarityBadge = styled.div`
  background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    padding: 0.3rem 1rem;
    font-size: 0.9rem;
  }
`;

const FoundBadge = styled.div`
  background: linear-gradient(45deg, #22C55E, #16A34A);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideInRight 0.5s ease-out;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    padding: 0.3rem 1rem;
    font-size: 0.9rem;
  }
  
  &::before {
    content: '✓';
    font-size: 1.2rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const ItemImage = styled.div`
  position: relative;
  margin-bottom: 2rem;
  
  .carousel-container {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    border-radius: 16px;
    border: 2px solid rgba(94, 234, 212, 0.3);
    
    @media (max-width: 768px) {
      height: 250px;
    }
  }

  .carousel-track {
    display: flex;
    transition: transform 0.5s ease;
    height: 100%;
  }

  .carousel-slide {
    flex: 0 0 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.7);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #5EEAD4;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background: rgba(15, 23, 42, 0.9);
    transform: translateY(-50%) scale(1.1);
  }
  
  &.prev {
    left: 1rem;
  }
  
  &.next {
    right: 1rem;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
`;

const CarouselDot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#5EEAD4' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const ItemSection = styled.section`
  margin-bottom: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  
  &.visible {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  &.map-section {
    .map-container {
      position: relative;
      padding: 20px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 16px;
      margin-top: 20px;
      opacity: 0;
      
      &.visible {
        animation: mapReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 16px;
        padding: 2px;
        background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: glowPulse 2s infinite;
      }
    }
  }
  
  &.story-section {
    p {
      position: relative;
      padding-left: 20px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(180deg, #5EEAD4, transparent);
        transform: scaleY(0);
        transform-origin: top;
        transition: transform 0.6s ease;
      }
      
      &.visible::before {
        transform: scaleY(1);
      }
    }
  }
`;

const PrintButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
  color: #0F172A;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(94, 234, 212, 0.4);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
  
  @media print {
    display: none;
  }
`;

// 添加全局动画
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(94, 234, 212, 0.2); }
    50% { box-shadow: 0 0 40px rgba(94, 234, 212, 0.4); }
  }
  
  @keyframes mapReveal {
    0% { transform: scale(0.95); opacity: 0; }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

// 添加新的组件用于地图标记动画
const LocationMarker = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #5EEAD4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: all 0.3s ease;
  opacity: ${props => props.isScratched ? 1 : 0};
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    animation: ripple 2s infinite;
  }
  
  @keyframes ripple {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
  }
`;

// 添加新的样式组件
const ScratchCardContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const ScratchArea = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  min-height: 150px;
`;

const ScratchHint = styled.div`
  color: #5EEAD4;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 
    0 0 10px rgba(94, 234, 212, 0.5),
    0 0 20px rgba(94, 234, 212, 0.3),
    0 0 30px rgba(94, 234, 212, 0.2);
  opacity: ${props => props.isScratched ? 0 : 1};
  transition: opacity 0.3s ease;
  animation: pulse 2s infinite;
  text-align: center;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const LocationCard = styled(InfoCard)`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8));
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/assets/grid.svg') repeat;
    opacity: 0.1;
    pointer-events: none;
  }
`;

const LocationIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    filter: blur(8px);
    opacity: 0.4;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.2); opacity: 0.2; }
    100% { transform: scale(1); opacity: 0.4; }
  }
`;

const LocationInfo = styled.div`
  flex: 1;
  
  h3 {
    color: #5EEAD4;
    font-size: 1.2rem;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: #94A3B8;
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .location-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(94, 234, 212, 0.1);
    border-radius: 20px;
    color: #5EEAD4;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    border: 1px solid rgba(94, 234, 212, 0.2);
  }
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #94A3B8;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  color: #5EEAD4;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ScratchContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 30px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  color: #5EEAD4;
  font-size: 1.3rem;
  text-align: center;
  letter-spacing: 1px;
  line-height: 1.6;
  font-weight: 500;
  
  p {
    margin: 0;
    text-shadow: 0 0 15px rgba(94, 234, 212, 0.5);
  }
`;

const ScratchCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  touch-action: none;
`;

// 添加新的样式组件
const SecretSection = styled.div`
  margin-top: 2rem;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 24px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 25px;
    padding: 2px;
    background: linear-gradient(45deg, #FF0080, #7928CA);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: borderGlow 3s infinite;
  }

  @keyframes borderGlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 16px;
  }
`;

const VerificationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
`;

const SecretTitle = styled.h3`
  color: #FF0080;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 15px rgba(255, 0, 128, 0.5);
  
  span {
    display: inline-block;
    animation: floatText 2s ease-in-out infinite;
  }
`;

const PasswordInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;

  input {
    width: 100%;
    padding: 1rem 1.5rem;
    background: rgba(15, 23, 42, 0.6);
    border: 2px solid rgba(255, 0, 128, 0.3);
    border-radius: 12px;
    color: #fff;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #FF0080;
      box-shadow: 0 0 20px rgba(255, 0, 128, 0.2);
    }
  }

  &::after {
    content: '🔒';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    pointer-events: none;
  }
`;

const VerifyButton = styled.button`
  padding: 1rem 3rem;
  background: linear-gradient(45deg, #FF0080, #7928CA);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    animation: shimmer 3s infinite;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 0, 128, 0.3);
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #FF0080;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0;
  transform: translateY(-10px);
  animation: fadeInUp 0.3s forwards;

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 将 UnlockedContent 的定义移到使用之前
const UnlockedContent = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 24px;
  animation: revealContent 1s ease-out;
  
  @keyframes revealContent {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 16px;
  }
`;

const HiderAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  border: 2px solid rgba(94, 234, 212, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 20px rgba(94, 234, 212, 0.2);
  }
`;

const HiderCard = styled(InfoCard)`
  display: flex;
  gap: 1rem;
  align-items: center;
  grid-column: 1 / -1;
  padding: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/assets/grid.svg') repeat;
    opacity: 0.05;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
    
    ${HiderAvatar} {
      margin: 0 auto 1rem;
    }
  }
`;

const HiderInfo = styled.div`
  flex: 1;
`;

const HiderName = styled.div`
  font-size: 1.2rem;
  color: #5EEAD4;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .gender-icon {
    color: #0EA5E9;
    font-size: 1rem;
  }
`;

const HiderSignature = styled.div`
  color: #94A3B8;
  font-style: italic;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  
  &::before {
    content: '"';
    color: #5EEAD4;
  }
  
  &::after {
    content: '"';
    color: #5EEAD4;
  }
`;

const HiderStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #94A3B8;
  font-size: 0.9rem;
  
  .icon {
    color: #5EEAD4;
  }
`;

// 添加发现者信息样式组件
const FinderCard = styled(InfoCard)`
  display: flex;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(94, 234, 212, 0.3);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FinderAvatar = styled(HiderAvatar)`
  border-color: rgba(94, 234, 212, 0.5);
  
  &::after {
    box-shadow: inset 0 0 20px rgba(94, 234, 212, 0.3);
  }
`;

const FinderInfo = styled(HiderInfo)`
  .finder-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
    padding: 0.2rem 0.8rem;
    border-radius: 12px;
    color: #0F172A;
    font-size: 0.8rem;
    font-weight: 600;
    margin-left: 0.5rem;
  }
`;

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    // 获取物品数据时，如果已找到则自动设置验证状态为true
    const fetchItemData = async () => {
      try {
        const mockItem = {
          id: parseInt(id),
          title: '神秘的青铜门把手',
          description: '这是一个雕刻着龙纹的古老门把，据说曾经属于一位著名的收藏家...',
          image: ['https://images.unsplash.com/photo-1461360228754-6e81c478b882',
          'https://images.unsplash.com/photo-1461360228754-6e81c478b882',
          'https://images.unsplash.com/photo-1461360228754-6e81c478b882'],
          location: '知识花园区域',
          rarity: 'SSR',
          clue: '在书架与书架之间，寻找一扇被遗忘的门',
          story: '传说这个门把手曾经是通往一个秘密藏书室的钥匙，只有在月圆之夜才会显现其真正的模样。',
          hider: {
            name: "探索者小明",
            gender: "male",
            avatar: "https://via.placeholder.com/64",
            signature: "在知识的海洋中探索未知的奥秘",
            hiddenCount: 42,
            find: 156,
            tags: ["E人", "话痨", "快乐小狗"],
            status: "寻找志同道合的伙伴，一起探索未知的奥秘",
            isSingle : "不透露"
          },
          hideDate: '2024-01-15',
          additionalInfo: '这个门把手上的龙纹在特定角度下会泛出青色的光芒...',
          discoveryStory: '那是一个月圆之夜，我在理古籍时意外发现了这个门把手...',
          encrypted: true,
          password: "dragon888",
          secretContent: {
            title: "远古图书馆的秘密",
            additionalInfo: `
              在这个青铜门把手的背面，隐藏着一串古老的符文。经过专家鉴，这些符文来自于失落的东方古文明。
              根据符文记载，这扇门通往一个被称为"万卷阁"的神秘图书馆，据说里面收藏着许多失传的古代典籍。
              
              🔍 重要发现：
              1. 门把手上的龙纹在满月之夜会发出微弱的蓝光
              2. 符中提到了"子时"、"五行相生"等关键词
              3. 在把手底部发现了一个小机关装置
            `,
            discoveryStory: `
              那是一个特别的夜晚，图书馆已经关门，我正在整最后一批古籍。突然间，月光透过窗户照在这个门把手上，
              原本普通的龙纹开始泛出奇异的青光。我注意到龙的眼睛位置有一个小凹槽，放入一枚古币大小的圆形物体后，
              门把手底部竟然弹出了一个暗格，里面藏着一张残破的羊皮纸，上面记载着这个神秘图书馆的线...
              
              🗝️ 后续调查显示：
              - 这个门把手可能是古代某个秘密结社的信物
              - 类似的门把手在全球仅发现过3个
              - 其中蕴含的机关技术远超当时的工艺水平
            `,
            secretLocations: [
              "主图书馆东翼三楼的第七个书架",
              "古籍阅览室的暗格",
              "图书馆后花园的石亭"
            ],
            nextClue: "寻找刻有'五行'符号的石砖，那里藏着下一个线索..."
          },
          isFound: true, // 添加是否已找到的状态
          // finder: {
          //   name: "探索者小红",
          //   avatar: "https://via.placeholder.com/64",
          //   signature: "热爱探索未知的世界",
          //   foundDate: "2024-03-20",
          //   totalFound: 23
          // }
        };
        setItem(mockItem);
        setIsFound(mockItem.isFound);
        if (mockItem.isFound) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error('获取物品数据失败:', error);
      }
    };

    fetchItemData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  // 修改：将观察者逻辑移动到这个 useEffect 中，并添加 item 依赖
  useEffect(() => {
    if (!item) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    // 同时观察 ItemSection 和 map-container
    document.querySelectorAll('.item-section, .map-container').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [item]); // 添加 item 作为依赖

  // 初始化刮刮卡
  const initScratchCard = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // 填充初始遮罩
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 添加一些花纹使其看起来更有趣
      ctx.strokeStyle = '#2DD4BF';
      for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
          ctx.beginPath();
          ctx.arc(i, j, 1, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // 处理刮擦效果
  const handleScratch = useCallback((e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // 获取鼠标/触摸位置
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // 检查已刮开的面积
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }
    
    const totalPixels = pixels.length / 4;
    if (transparentPixels / totalPixels > 0.5) {
      setIsScratched(true);
      canvas.style.display = 'none';
    }
  }, [isDrawing]);

  useEffect(() => {
    if (item) {
      const cleanup = initScratchCard();
      return cleanup;
    }
  }, [item, initScratchCard]);

  // 修改：更新鼠标移动处理函数
  const handleMouseMove = useCallback((e) => {
    if (!isScratched) return;
    
    const scratchArea = e.currentTarget;
    const rect = scratchArea.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePos({ x, y });
  }, [isScratched]);

  const handlePasswordVerification = async (e) => {
    e.preventDefault();
    if (password === item.password) {
      try {
        // 先设置验证成功状态，确保隐藏信息能显示
        setIsVerified(true);
        
        // 发送找到信息到后端
        const response = await fetch(`/api/items/${id}/found`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            foundAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          setIsFound(true);
          setError("");
        } else {
          // 即使后端更新失败，也保持验证成功状态
          setError("状态更新失败，但您仍可以查看隐藏信息");
        }
      } catch (error) {
        console.error('发送找到信息失败:', error);
        // 即使API调用失败也保持验证成功状态
        setError("状态更新失败，但您仍可以查看隐藏信息");
      }
    } else {
      setError("密码不正确，请重试");
      setIsVerified(false);
    }
  };

  // 处理轮播逻辑
  const nextSlide = useCallback(() => {
    if (!item) return;
    setCurrentSlide(current => 
      current === item.image.length - 1 ? 0 : current + 1
    );
  }, [item]);

  const prevSlide = () => {
    if (!item) return;
    setCurrentSlide(current => 
      current === 0 ? item.image.length - 1 : current - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying || !item) return;
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, item]);

  // 鼠标悬停时暂停自动轮播
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <DetailContainer>
      <GlobalStyle />
      <PrintableContent>
        <ItemHeader>
          <div className="header-content">
            <h1>{item.title}</h1>
            {isFound && <FoundBadge>已找到</FoundBadge>}
          </div>
          <div className="header-badges">
            <RarityBadge>{item.rarity}</RarityBadge>
          </div>
        </ItemHeader>

        <ItemImage>
          <div 
            className="carousel-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {item.image.map((src, index) => (
                <div key={index} className="carousel-slide">
                  <img src={src} alt={`${item.title} - ${index + 1}`} />
                </div>
              ))}
            </div>
            
            <CarouselButton className="prev" onClick={prevSlide}>
              ←
            </CarouselButton>
            <CarouselButton className="next" onClick={nextSlide}>
              →
            </CarouselButton>
            
            <CarouselDots>
              {item.image.map((_, index) => (
                <CarouselDot
                  key={index}
                  active={currentSlide === index}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </CarouselDots>
          </div>
        </ItemImage>

        <ItemSection className="item-section">
          <h2>📜 物品描述</h2>
          <p>{item.description}</p>
        </ItemSection>

        <ItemSection className="item-section map-section">
          <h2>🗺️ 寻宝线索</h2>
          <ScratchCardContainer>
            <ScratchHint isScratched={isScratched}>
              ✨ 刮开查看线索 ✨
            </ScratchHint>
            
            <ScratchArea onMouseMove={handleMouseMove}>
              <ScratchContent>
                <p>{item.clue}</p>
                <LocationMarker 
                  isScratched={isScratched}
                  style={{ 
                    left: `${mousePos.x}%`, 
                    top: `${mousePos.y}%`,
                    display: isScratched ? 'block' : 'none'
                  }} 
                />
              </ScratchContent>
              <ScratchCanvas
                ref={canvasRef}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseMove={handleScratch}
                onMouseLeave={() => setIsDrawing(false)}
                onTouchStart={() => setIsDrawing(true)}
                onTouchEnd={() => setIsDrawing(false)}
                onTouchMove={handleScratch}
              />
            </ScratchArea>
          </ScratchCardContainer>
        </ItemSection>

        <ItemSection className="item-section story-section">
          <h2>📖 背后的故事</h2>
          <p>{item.secretContent.title}</p>
        </ItemSection>

        <ItemSection className="item-section">
          <h2>🔍 发现过程</h2>
          <p>{item.secretContent.discoveryStory}</p>
        </ItemSection>

        <ItemSection className="item-section">
          <h2>ℹ️ 额外信息</h2>
          <p>{item.secretContent.additionalInfo}</p>
        </ItemSection>

        <ItemSection className="item-section">
          <h2>📍 基本信息</h2>
          <InfoContainer>
            <HiderCard>
              <HiderAvatar>
                <img src={item.hider.avatar || 'https://via.placeholder.com/64'} alt="隐藏者头像" />
              </HiderAvatar>
              <HiderInfo>
                <HiderName>
                  {item.hider.name}
                  <span className="gender-icon">♂</span>
                </HiderName>
                <HiderSignature>
                  {item.hider.signature || "探索未知的奥秘，分享发现的快乐"}
                </HiderSignature>
                <HiderStats>
                  <StatItem>
                    <span className="icon">🎯</span>
                    已隐藏 {item.hider.hiddenCount || 0} 件
                  </StatItem>
                  <StatItem>
                    <span className="icon">⭐</span>
                    找到 {item.hider.find || 0} 件
                  </StatItem>
                  <StatItem>
                    <span className="icon">💔</span>
                    {item.hideDate}
                  </StatItem>
                </HiderStats>
              </HiderInfo>
            </HiderCard>
            
            <LocationCard>
              <LocationIcon>📍</LocationIcon>
              <LocationInfo>
                <h3>
                  探索地点
                  <span className="location-tag">重要线索</span>
                </h3>
                <p>{item.location}</p>
                <p className="location-tag">知识花园区</p>
              </LocationInfo>
            </LocationCard>
            
            <InfoCard>
              <InfoLabel>隐藏者交友期待❤️</InfoLabel>
              <InfoValue>
                <span role="img" aria-label="explorer"></span> {item.hider.status}
              </InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoLabel>隐藏者的标签🏷️</InfoLabel>
              <InfoValue>
                {item.hider.tags.map((tag, index) => (
                  <span key={index} style={{ marginRight: '0.5rem' }}>{tag}</span>
                ))}
              </InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>隐藏时间🗓️</InfoLabel>
              <InfoValue>
                {item.hideDate}
              </InfoValue>
            </InfoCard>

          </InfoContainer>
        </ItemSection>
      </PrintableContent>

      <PrintButton onClick={handlePrint}>
        🖨️ 打印页面
      </PrintButton>

      {item?.encrypted && !isVerified && !isFound && (
        <SecretSection>
          <SecretTitle>
            {Array.from('神秘内容验证').map((char, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
            ))}
          </SecretTitle>
          <VerificationForm onSubmit={handlePasswordVerification}>
            <PasswordInput>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入通行密码..."
                autoComplete="off"
              />
            </PasswordInput>
            <VerifyButton type="submit">
              解锁内容
            </VerifyButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </VerificationForm>
        </SecretSection>
      )}

      {(isVerified || isFound) && item?.secretContent && (
        <UnlockedContent>
          <SecretTitle style={{ color: '#5EEAD4' }}>
            {Array.from('解密成功').map((char, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
            ))}
          </SecretTitle>
          <p style={{color: '#5EEAD4', fontStyle: 'italic', fontSize: '1.5rem', textAlign: 'center'}}>
            【宝贝已找到】
          </p>
          
          <ItemSection className="item-section">
            <h3>🔓 隐藏信息</h3>
            <p>{item.secretContent.additionalInfo}</p>
          </ItemSection>
          
          <ItemSection className="item-section">
            <h3>📖 完整发现记录</h3>
            <p>{item.secretContent.discoveryStory}</p>
          </ItemSection>
          
          <ItemSection className="item-section">
            <h3>📍 关键地点</h3>
            <ul>
              {item.secretContent.secretLocations.map((location, index) => (
                <li key={index} style={{color: '#94A3B8', marginBottom: '0.5rem'}}>
                  {location}
                </li>
              ))}
            </ul>
          </ItemSection>
          
          <ItemSection className="item-section">
          {item.finder ? (
                      <>
                        <h3>🏆宝藏发现者</h3>
                      </>
                    ) : (
                      <h3>🕹️ 没有发现者出现</h3>
                    )}

            <FinderCard>
              <FinderAvatar>
                <img 
                  src={item.finder?.avatar || 'https://via.placeholder.com/64'} 
                  alt="发现者头像" 
                />
              </FinderAvatar>
              <FinderInfo>
                <HiderName>
                  {item.finder?.name || "暂无发现者"}
                  <span className="finder-badge">
                    {item.finder ? (
                      <>
                        <span>✨</span>
                        首位发现者
                      </>
                    ) : (
                      "没有发现者出现"
                    )}
                  </span>
                </HiderName>
                <HiderSignature>
                  {item.finder?.signature || "暂无发现者"}
                </HiderSignature>
                <HiderStats>
                  <StatItem>
                    <span className="icon">🎯</span>
                    发现时间: {item.finder?.foundDate || "待发现"}
                  </StatItem>
                  <StatItem>
                    <span className="icon">⭐</span>
                    已找到 {item.finder?.totalFound || 0} 件宝藏
                  </StatItem>
                </HiderStats>
              </FinderInfo>
            </FinderCard>
          </ItemSection>
        </UnlockedContent>
      )}
    </DetailContainer>
  );
}

export default ItemDetail; 