import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

// 动画效果
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #FF6B6B, 0 0 20px #FF6B6B; }
  100% { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #FF6B6B, 0 0 40px #FF6B6B; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const rocketFly = keyframes`
  0% {
    transform: translateY(100vh) rotate(-45deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(-45deg);
    opacity: 0;
  }
`;

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
  background: #1a1a1a;
  color: #fff;

  @media (max-width: 480px) {
    padding: 0;
    justify-content: flex-start;
    min-height: 100dvh;
  }
`;

const LightBeam = styled.div`
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #FF6B6B, transparent);
  opacity: 0.5;
  transform-origin: 50% 0;
  animation: ${float} 3s ease-in-out infinite;
  left: ${props => props.left}%;
  transform: rotate(${props => props.rotate}deg);
`;

const Planet = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  z-index: 1;
  box-shadow: 0 0 20px rgba(255,255,255,0.2);

  @media (max-width: 480px) {
    // 调整移动端位置
    ${props => props.isMainPlanet && `
      top: 75%; // 移到底部
      left: 10%; // 靠左
      width: ${props.size * 0.8}px; // 稍微缩小尺寸
      height: ${props.size * 0.8}px;
    `}
    
    // 调整右上角黄色星球
    ${props => props.isTopRight && `
      top: 15%; // 更靠上
      left: 85%; // 更靠右
      width: ${props.size * 1.2}px; // 稍微放大尺寸
      height: ${props.size * 1.2}px;
    `}
  }

  &::after {
    content: '';
    position: absolute;
    width: 110%;
    height: 110%;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2);
    left: -5%;
    top: -5%;
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;



const Subtitle = styled.p`
  font-size: 1.8rem;
  color: #FF6B6B;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Noto Sans SC', sans-serif;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1rem;
    padding: 0 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  position: relative;
  z-index: 2;
  width: 100%;
  justify-content: center;
  padding: 0 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
    margin-top: 1.5rem;
    padding: 0 2rem; // 增加左右边距
    max-width: 100%; // 确保不会超出屏幕
  }
`;

const StyledButton = styled(Link)`
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: center;

  @media (max-width: 480px) {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
    width: 100%;
    max-width: 280px; // 限制最大宽度
  }

  &.primary {
    background: #FF6B6B;
    color: white;
  }

  &.secondary {
    background: transparent;
    border: 2px solid #4ECDC4;
    color: #4ECDC4;
  }
`;

const FunText = styled.span`
  position: absolute;
  font-size: 1rem;
  color: #FFE66D;
  transform: rotate(${props => props.rotate}deg);
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: 2;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    
    // 针对左下方的文字特殊处理
    ${props => props.isBottomLeft && `
      top: 67%; // 移到更下方
      left: 10%; // 靠左对齐
      transform: rotate(-5deg); // 稍微调整角度
    `}
    
    // 隐藏其他文字
    // ${props => !props.isBottomLeft && `
    //   display: none;
    // `}
  }
`;

const Rocket = styled.div`
  position: fixed;
  width: 60px;
  height: 60px;
  right: 10%;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  
  &.flying {
    animation: ${rocketFly} 2s ease-in-out forwards;
  }

  &::before {
    content: '🚀';
    font-size: 40px;
    position: absolute;
    transform: rotate(45deg);
  }

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 100px;
    background: linear-gradient(to bottom, #FF6B6B, transparent);
    transform: translateY(20px) rotate(45deg);
    filter: blur(10px);
    opacity: 0.5;
  }
`;

const ImageFrame = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  margin: 3rem auto;
  opacity: 0.8;
  transform: scale(0.8);

  &.visible {
    animation: ${fadeInScale} 1s ease-out forwards;
  }

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    border: 2px solid #FF6B6B;
    border-radius: 10px;
    background: rgba(40, 40, 40, 0.8);
    backdrop-filter: blur(10px);
    z-index: -1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const ScrollSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
`;

// 添加新的动画关键帧
const flyUpAnimation = keyframes`
  0% {
    transform: translate(var(--startX), 100vh) rotate(var(--rotation));
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--endX), -100vh) rotate(var(--finalRotation));
    opacity: 0;
  }
`;

const FloatingElement = styled.div`
  position: fixed;
  font-size: ${props => props.size || '2rem'};
  z-index: 5;
  pointer-events: none;
  animation: ${flyUpAnimation} var(--duration) ease-out forwards;
  left: 0;
  top: 0;
  transform: translateY(100vh);
`;

const FLOATING_ELEMENTS = [
  '🚀', '✨', '🎸', '🎹', '🎺', '🎭', '🎨', '🎮', 
  '🌟', '🌍', '🌘', '🎯', '🎪', '🎵', '🎼', '🎧'
];

function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

function FloatingElements() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const createNewElement = () => {
      const id = Date.now();
      const element = FLOATING_ELEMENTS[Math.floor(Math.random() * FLOATING_ELEMENTS.length)];
      const startX = getRandomValue(-20, window.innerWidth - 50);
      const endX = startX + getRandomValue(-200, 200);
      const duration = getRandomValue(3, 8);
      const size = getRandomValue(1.5, 3) + 'rem';
      const rotation = getRandomValue(-45, 45);
      const finalRotation = rotation + getRandomValue(-180, 180);

      setElements(prev => [...prev, {
        id,
        element,
        style: {
          '--startX': `${startX}px`,
          '--endX': `${endX}px`,
          '--duration': `${duration}s`,
          '--rotation': `${rotation}deg`,
          '--finalRotation': `${finalRotation}deg`
        },
        size
      }]);

      // 动画结束后移除元素
      setTimeout(() => {
        setElements(prev => prev.filter(e => e.id !== id));
      }, duration * 1000);
    };

    // 初始创建几个元素
    for (let i = 0; i < 5; i++) {
      setTimeout(createNewElement, i * 500);
    }

    // 定期创建新元素
    const interval = setInterval(() => {
      if (Math.random() < 0.7) { // 70%的概率建新元素
        createNewElement();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return elements.map(({ id, element, style, size }) => (
    <FloatingElement key={id} style={style} size={size}>
      {element}
    </FloatingElement>
  ));
}

// 修改流星动画
const meteorFall = keyframes`
  0% {
    transform: translate(-120%, 20%) rotate(15deg);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  90% {
    opacity: 1;
    transform: translate(80%, -10%) rotate(15deg);
  }
  95% {
    opacity: ${props => props.persist ? 1 : 0};
    transform: translate(100%, -15%) rotate(15deg);
  }
  100% {
    transform: translate(120%, -20%) rotate(15deg);
    opacity: ${props => props.persist ? 1 : 0};
  }
`;

// 修改 Meteor 组件样式
const Meteor = styled.div`
  position: absolute;
  width: ${props => props.width || '200px'};
  height: 3px;
  background: linear-gradient(
    270deg,
    transparent,
    ${props => props.color || '#FF6B6B'}
  );
  top: ${props => props.top}%;
  left: 0;
  filter: blur(3px);
  opacity: 0;
  z-index: 1;
  transform-origin: right center;
  animation: ${props => meteorFall} ${props => props.duration || 3}s linear;
  animation-delay: ${props => props.delay || '0s'};
  animation-iteration-count: ${props => props.persist ? 'infinite' : 1};
  animation-fill-mode: ${props => props.persist ? 'none' : 'forwards'};

  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${props => props.color || '#FF6B6B'};
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    filter: blur(4px);
    box-shadow: 
      0 0 20px ${props => props.color || '#FF6B6B'},
      0 0 40px ${props => props.color || '#FF6B6B'}33;
  }

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 100%;
    background: linear-gradient(
      270deg,
      transparent,
      ${props => props.color || '#FF6B6B'}33,
      transparent
    );
    right: 0;
    transform: translateX(25%);
    filter: blur(10px);
  }
`;

// 修改生成流星的函数
const generateMeteors = () => {
  return Array.from({ length: 12 }, () => ({
    color: ['#FF6B6B', '#4ECDC4', '#FFE66D'][Math.floor(Math.random() * 3)],
    top: Math.random() * 60 + 5,
    duration: Math.random() * 6 + 6, // 6-12秒
    delay: Math.random() * 8, // 0-8秒延迟
    width: Math.random() * 100 + 150 + 'px', // 150-250px
    persist: Math.random() < 0.3, // 30%的概率永久存在
  }));
};

// 创建一个新的城市剪影组件
const CityScapeContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35vh;
  background: linear-gradient(to bottom, transparent 0%, rgba(26, 26, 26, 0.8) 40%);
  z-index: 2;
  overflow: hidden;
`;

const Buildings = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to top, #1a1a1a 0%, transparent 50%),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 0px,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px,
      transparent 30px
    );
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60%;
    background: 
      linear-gradient(to bottom, transparent, #1a1a1a),
      repeating-linear-gradient(
        90deg,
        #1a1a1a,
        #1a1a1a 40px,
        #222 40px,
        #222 80px
      );
  }
`;

const BuildingLights = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 1%
  );
  background-size: 40px 40px;
  animation: twinkle 3s infinite alternate;
`;

// 添加新的样式组件
const CitySection = styled(ScrollSection)`
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
  min-height: 150vh;
  display: flex;
  flex-direction: column;
`;

const CityScape = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to bottom, transparent, #1a1a1a),
    url('/city-silhouette.png') repeat-x bottom;
  background-size: contain;
  z-index: 2;
`;

const NeonPlanet = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 30px ${props => props.color}aa,
             inset -10px -10px 20px rgba(0,0,0,0.5);
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: ${props => props.zIndex || 1};
  animation: ${float} ${props => props.duration || 6}s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};

  &::after {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    border: 2px solid ${props => props.color}44;
    left: -10%;
    top: -10%;
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;

// 修改发射动画
const shootUp = keyframes`
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    transform: translateY(-50vh) scale(1.5) rotate(180deg);
    opacity: 0.7;
    filter: brightness(1.5);
  }
  100% {
    transform: translateY(-100vh) scale(0.5) rotate(360deg);
    opacity: 0;
    filter: brightness(2);
  }
`;

// 修改按钮栏样式
const ButtonBar = styled.div`
  position: fixed;
  bottom: ${props => props.isHovered ? '20px' : '-80px'};
  left: 0;
  width: 100%;
  padding: 1rem;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom)); // 增加底部安全区域
  background: ${props => props.isHovered ? 
    'linear-gradient(to top, rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.8) 50%, transparent)' : 
    'transparent'
  };
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  // 添加一个较大的触发区域
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: 80px;
    background: transparent;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom)); // 移动端底部安全区域
    bottom: ${props => props.isHovered ? '10px' : '-60px'};
  }
`;

// 主火箭按钮
const MainRocketButton = styled.button`
  background: transparent;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  padding: 1rem;
  color: rgba(255, 107, 107, ${props => props.isHovered ? '1' : '0.3'});
  transform: translateY(${props => props.isHovered ? '-20px' : '0'});
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    width: ${props => props.isHovered ? '60px' : '0'};
    height: ${props => props.isHovered ? '60px' : '0'};
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(255, 107, 107, 0.2),
      transparent 70%
    );
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::before {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

// 按钮容器
const IconButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
  opacity: ${props => props.isHovered ? '1' : '0'};
  transform: translateY(${props => props.isHovered ? '0' : '20px'});
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;

  @media (max-width: 480px) {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

// 宇宙文字提示
const CosmicText = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  text-align: center;
  letter-spacing: 2px;
  margin-top: 0.5rem;
  opacity: ${props => props.isHovered ? '1' : '0'};
  transform: translateY(${props => props.isHovered ? '0' : '20px'});
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    letter-spacing: 1px;
    margin-top: 0.3rem;
  }
`;

// 修改射击图标样式
const ShootingIcon = styled.div`
  position: fixed;
  font-size: 2rem;
  pointer-events: none;
  z-index: 100;
  animation: ${shootUp} 1.5s ease-out forwards;
  color: ${props => props.color};
  text-shadow: 0 0 10px ${props => props.color};
  filter: blur(0.5px);
  will-change: transform;
`;

// 添加新的动画效果
const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const CardSection = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 4rem 2rem;
  padding-bottom: 120px; // 增加底部内边距
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
  background: #1a1a1a;

  @media (max-width: 480px) {
    padding-bottom: 100px; // 移动端底部内边距
  }
`;

const SimpleStoryCard = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(50px);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.accentColor || '#FF6B6B'};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: translateX(-100%);
    transition: 0.5s;
  }

  &:hover::before {
    transform: translateX(100%);
  }
`;

const SimpleCardImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 0, 0, 0.5)
    );
  }
`;

const SimpleCardTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
`;

const SimpleCardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SimpleCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const CardStats = styled.div`
  display: flex;
  gap: 1rem;
`;

// 修改卡片容器式
const StoryContainer = styled.div`
  position: relative;
  min-height: 80vh;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(26, 26, 26, 0.95) 5%,
    #1a1a1a 20%
  );
  padding: 2rem;
  padding-bottom: 120px; // 增加底部内边距
  z-index: 3;

  @media (max-width: 480px) {
    padding: 1rem 0;
    padding-bottom: 100px; // 移动端底部内边距
    min-height: 100dvh;
  }
`;

const StoryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
  position: relative;
  z-index: 3;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  h2 {
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba(255,107,107,0.5);
  }

  p {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.8);
  }
`;

// 修改卡片网格样式
const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0.6;
  transform: translateY(50px);
  transition: all 0.8s ease-out;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0;
    margin: 0;
  }
`;

// 更新故事数据
const stories = [
  {
    id: 1,
    title: "城市夜光下的小确幸",
    description: "在霓虹闪烁的街角，发现了这家温馨的小店。店主是个可爱的老爷爷，每天都会准备不同的手工甜点。这里不仅有美食，更有温暖人心的故事...",
    image: "https://images.unsplash.com/photo-1519120944692-1a8d8cfc107f",
    user: {
      name: "星光漫步者",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      color: "#FF6B6B"
    },
    time: "2小时前",
    tags: ["美食", "温暖", "城市故事"],
    likes: 128,
    comments: 32,
    shares: 16,
    location: "东城区 星光大道",
    price: "¥68",
    status: "可预订"
  },
  {
    id: 2,
    title: "遗失的时光邮票",
    description: "在古董市场的角落里，一个布满灰尘的相册吸引了我的注意。翻开泛黄的书页，一枚带着岁月痕迹的邮票静静地躺在那里，仿佛在诉说着半个世纪前的故事...",
    image: "https://images.unsplash.com/photo-1583842761824-864c2380d18f",
    user: {
      name: "时光收藏家",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      color: "#4ECDC4"
    },
    time: "5小时前",
    tags: ["收藏", "历史", "记忆"],
    likes: 256,
    comments: 64,
    shares: 48,
    location: "西城区 古玩市场",
    price: "¥1280",
    status: "已售出"
  },
  {
    id: 3,
    title: "街角的复古唱片机",
    description: "在一家小巷深处的古董店里，发现了这台保存完好的老式唱片机...",
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882",
    user: {
      name: "音乐寻觅者",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      color: "#FFE66D"
    },
    time: "1天前",
    tags: ["音乐", "复古", "收藏"],
    likes: 384,
    comments: 96,
    shares: 72,
    location: "南城区 文艺街",
    price: "¥2980",
    status: "可议价"
  },
  // 添加更多故事...
];

// 卡片基础样式
const StoryCard = styled.div`
  background: rgba(30, 30, 30, 0.9);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, 
      rgba(255, 107, 107, 0.1),
      transparent 60%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.accentColor || '#FF6B6B'};
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.3),
      0 0 20px ${props => props.accentColor || '#FF6B6B'}33,
      0 0 40px ${props => props.accentColor || '#FF6B6B'}22;

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    border-radius: 0;
    margin: 0 -1rem;
  }
`;

const CardHeader = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(26, 26, 26, 0.8)
    );
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;

  ${StoryCard}:hover & {
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle,
      ${props => props.accentColor || '#FF6B6B'}22,
      transparent 70%);
    border-radius: 50%;
    top: -75px;
    right: -75px;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  ${StoryCard}:hover &::before {
    opacity: 1;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  position: relative;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${props => props.accentColor || '#FF6B6B'};
  box-shadow: 0 0 10px ${props => props.accentColor || '#FF6B6B'}44;
  transition: all 0.3s ease;

  ${StoryCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 0 15px ${props => props.accentColor || '#FF6B6B'}66;
  }
`;

const UserName = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const PostTime = styled.span`
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 0.2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin: 0.5rem 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
`;

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 1rem 0;
  position: relative;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.8rem 0;
`;

const Tag = styled.span`
  background: ${props => `${props.color}11` || '#FF6B6B11'};
  color: ${props => props.color || '#FF6B6B'};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid ${props => `${props.color}33` || '#FF6B6B33'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => `${props.color}22` || '#FF6B6B22'};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px ${props => `${props.color}22` || '#FF6B6B22'};
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 0.8rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  transition: all 0.3s ease;

  span {
    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${props => props.color || '#FF6B6B'};
    
    span {
      transform: scale(1.2);
    }
  }
`;

// 添加新的动画效果
const titleGlow = keyframes`
  0% {
    text-shadow: 
      0 0 10px rgba(255,107,107,0.5),
      0 0 20px rgba(255,107,107,0.3),
      0 0 30px rgba(255,107,107,0.2);
  }
  50% {
    text-shadow: 
      0 0 20px rgba(255,107,107,0.8),
      0 0 40px rgba(255,107,107,0.5),
      0 0 60px rgba(255,107,107,0.3),
      0 0 80px rgba(255,107,107,0.2);
  }
  100% {
    text-shadow: 
      0 0 10px rgba(255,107,107,0.5),
      0 0 20px rgba(255,107,107,0.3),
      0 0 30px rgba(255,107,107,0.2);
  }
`;

const cosmicFloat = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(2deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
`;

// 创建宇宙装饰元素
const CosmicDecoration = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const CosmicCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at center,
    rgba(255,107,107,0.2) 0%,
    rgba(255,107,107,0.1) 30%,
    transparent 70%
  );
  animation: ${cosmicFloat} 8s ease-in-out infinite;
  opacity: 0.5;
  mix-blend-mode: screen;
`;

// 修改标题容器
const TitleContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  padding: 2rem;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center,
      rgba(255,107,107,0.1) 0%,
      transparent 50%
    );
    animation: ${cosmicFloat} 10s ease-in-out infinite alternate;
    pointer-events: none;
  }
  
  &::before {
    top: -50%;
    left: -50%;
    animation-delay: -5s;
  }
  
  &::after {
    bottom: -50%;
    right: -50%;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    &::before, &::after {
      width: 150%;
      height: 150%;
    }
  }
`;

// 修改标题样式
const AnimatedTitle = styled.h1`
  font-size: 5rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
  padding: 0.5em;
  text-align: center;
  position: relative;
  animation: ${titleGlow} 3s ease-in-out infinite;
  cursor: default;
  transition: all 0.3s ease;
  
  span {
    display: inline-block;
    animation: ${cosmicFloat} 6s ease-in-out infinite;
    animation-delay: calc(var(--char-index) * 0.1s);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle at center,
      rgba(255,107,107,0.2) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
    }

    span {
      animation-play-state: paused;
    }
  }

  @media (max-width: 768px) {
    font-size: 3rem;
    padding: 0.3em;
    
    &:hover {
      transform: none;
    }
  }
`;

// 添加新的动画效果
const floatUpAndGlow = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
    text-shadow: 0 0 5px rgba(255,107,107,0.5);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
    text-shadow: 0 0 20px rgba(255,107,107,0.8);
  }
`;

const rotateGlow = keyframes`
  0% {
    transform: rotate(0deg);
    filter: hue-rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    filter: hue-rotate(360deg);
  }
`;

// 游戏规则部分的样式组件
const GameRulesSection = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 6rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  perspective: 1000px; // 添加3D视角

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

// 修改规则容器样式
const RulesContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  opacity: 0;
  transform: translateY(50px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 2rem;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  // 添加星星背景
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background-image: radial-gradient(2px 2px at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      rgba(255, 255, 255, 0.3),
      transparent 50%);
    background-size: 150px 150px;
    animation: starFloat 60s linear infinite;
    pointer-events: none;
    z-index: -1;
  }
`;

// 修改规则卡片样式
const RuleCard = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transform: translateZ(0) rotate3d(0, 0, 0, 0deg);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  // 悬浮效果
  &:hover {
    transform: translateY(-15px) translateZ(20px) rotate3d(var(--rotateX, 0), var(--rotateY, 0), 0, var(--rotate, 2deg));
    border-color: ${props => props.color || '#FF6B6B'};
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.3),
      0 0 30px ${props => props.color || '#FF6B6B'}33,
      0 0 50px ${props => props.color || '#FF6B6B'}22;
  }

  // 光晕效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      ${props => props.color || '#FF6B6B'}22,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    
    // 移动端禁用3D效果
    transform: none !important;
    
    &:hover {
      transform: translateY(-5px) !important;
    }
  }
`;

const RuleIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;

  ${RuleCard}:hover & {
    transform: translateZ(30px) scale(1.1);
  }

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    animation: pulseGlow 3s ease-in-out infinite;
  }

  &::before {
    width: 100%;
    height: 100%;
    border: 2px solid ${props => props.color || '#FF6B6B'}44;
    animation-delay: -1.5s;
  }

  &::after {
    width: 120%;
    height: 120%;
    border: 1px solid ${props => props.color || '#FF6B6B'}22;
  }
`;

const RuleTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin: 1rem 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const RuleDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1.1rem;
`;

// 添加 IconButton 样式组件
const IconButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  color: ${props => props.color || '#fff'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle,
      ${props => `${props.color}33` || '#ffffff33'},
      transparent 70%
    );
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    
    &::before {
      width: 50px;
      height: 50px;
      background: radial-gradient(circle,
        ${props => `${props.color}4d` || '#ffffff4d'},
        transparent 70%
      );
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    padding: 0.3rem;
  }
`;

// 添加新的动画
const pulseGlow = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
`;

const starFloat = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// 添加触摸设备的特殊处理
const TouchWrapper = styled.div`
  @media (hover: none) {
    -webkit-tap-highlight-color: transparent;
    
    ${StyledButton}, ${IconButton}, ${RuleCard} {
      &:active {
        transform: scale(0.98);
      }
    }
  }
`;

// 可以添加一个提示组件来引导用户
const BottomHint = styled.div`
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom)); // 增加底部安全区域
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  opacity: ${props => props.show ? '1' : '0'};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 9;

  @media (max-width: 480px) {
    display: none;
  }
`;

// 添加页脚动画
const footerFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 页脚容器
const Footer = styled.footer`
  width: 100%;
  background: linear-gradient(to bottom, #1a1a1a, #141414);
  padding: 4rem 2rem 2rem;
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 3;
  animation: ${footerFadeIn} 1s ease-out forwards;

  @media (max-width: 768px) {
    padding: 3rem 1rem 1rem;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  h4 {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: ${props => props.accentColor || '#FF6B6B'};
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 60px;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.color || '#FF6B6B'};
    transform: translateY(-3px);
    box-shadow: 0 5px 15px ${props => props.color || '#FF6B6B'}33;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.8rem;
    
    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        color: #fff;
        transform: translateX(5px);
      }

      &::before {
        content: '→';
        opacity: 0;
        transition: all 0.3s ease;
      }

      &:hover::before {
        opacity: 1;
      }
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;

  a {
    color: #FF6B6B;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }
`;

const BeianLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
  margin-top: 1rem;

  &:hover {
    color: #fff;
  }

  img {
    width: 14px;
    height: 14px;
  }
`;

function Home() {
  const [showRocket, setShowRocket] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [shootingIcons, setShootingIcons] = useState([]);
  const [showStories, setShowStories] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isBarHovered, setIsBarHovered] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // 当滚动到第一屏的80%时触发火箭动画
      if (scrollPosition > windowHeight * 0.8 && !showRocket) {
        setShowRocket(true);
        // 火箭动画结束后置状态，允许再次触发
        setTimeout(() => setShowRocket(false), 2000);
      }

      // 当滚动到第二屏时显示图片
      if (scrollPosition > windowHeight * 1.2 && !showImage) {
        setShowImage(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showRocket, showImage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cardId = entry.target.dataset.id;
            console.log('Card visible:', cardId); // 添加调试日志
            setVisibleCards(prev => new Set([...prev, cardId]));
          }
        });
      },
      {
        threshold: 0.1, // 降低阈值，使检测更敏感
        rootMargin: '50px' // 添加边距，提前触发检测
      }
    );

    // 延迟观察，确保元素已渲染
    setTimeout(() => {
      const cards = document.querySelectorAll('.story-card');
      console.log('Found cards:', cards.length); // 添加调试日志
      cards.forEach(card => observer.observe(card));
    }, 100);

    return () => observer.disconnect();
  }, []);

  // 修改发射处理函数
  const handleShoot = (event, icon, color) => {
    const id = Date.now();
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    
    // 创建单图标
    const newIcon = {
      id,
      icon,
      color,
      startX: startX,
      startY: window.innerHeight - 80,
      delay: 0
    };
    
    setShootingIcons(prev => [...prev, newIcon]);

    // 动画结束后移除图标
    setTimeout(() => {
      setShootingIcons(prev => prev.filter(item => item.id !== id));
    }, 1500);
  };

  // 底部按钮配置
  const buttons = [
    { icon: '▶️', color: '#FF6B6B', label: 'play' },
    { icon: '❤️', color: '#4ECDC4', label: 'like' },
    { icon: '✨', color: '#FFE66D', label: 'star' },
    { icon: '🔄', color: '#FF6B6B', label: 'refresh' },
    { icon: '💖', color: '#4ECDC4', label: 'love' }
  ];

  // 生成流星并保持状态
  const [meteors, setMeteors] = useState(generateMeteors());

  // 定期更新非永久流星
  useEffect(() => {
    const interval = setInterval(() => {
      setMeteors(prev => {
        const newMeteors = [...prev];
        // 随机替换一些非永久流星
        for (let i = 0; i < newMeteors.length; i++) {
          if (!newMeteors[i].persist && Math.random() < 0.2) { // 20%的概率更新
            newMeteors[i] = {
              color: ['#FF6B6B', '#4ECDC4', '#FFE66D'][Math.floor(Math.random() * 3)],
              top: Math.random() * 60 + 5,
              duration: Math.random() * 6 + 6,
              delay: Math.random() * 3, // 较短的延迟以保持连续性
              width: Math.random() * 100 + 150 + 'px',
              persist: Math.random() < 0.3,
            };
          }
        }
        return newMeteors;
      });
    }, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 添加滚动检测
  useEffect(() => {
    const handleScroll = debounce(() => {
      // 获取 CitySection 元素
      const citySection = document.querySelector('.city-section');
      if (citySection) {
        const rect = citySection.getBoundingClientRect();
        // 当 CitySection 进入视口的 75% 时显示标题
        if (rect.top < window.innerHeight * 0.75 && !showStories) {
          setShowStories(true);
        }
      }
    }, 16); // 约60fps

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showStories]);

  // 将标题文字拆分为单个字符
  const titleText = "奇想寻物";
  const titleChars = titleText.split('');

  // 添加规则示检测
  useEffect(() => {
    const handleScroll = () => {
      const rulesSection = document.getElementById('rules-section');
      if (rulesSection) {
        const rect = rulesSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setShowRules(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.setProperty('--rotateX', `${rotateX}deg`);
    card.style.setProperty('--rotateY', `${rotateY}deg`);
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleCardLeave = (card) => {
    card.style.setProperty('--rotateX', '0deg');
    card.style.setProperty('--rotateY', '0deg');
  };

  // 游戏规则数据
  const gameRules = [
    {
      icon: '🎯',
      title: '寻找宝藏',
      description: '在城市中发现独特的物品和故事，每个角落都可能藏着惊喜！',
      color: '#FF6B6B'
    },
    {
      icon: '🤝',
      title: '分享故事',
      description: '用照片和文字记录下你的发现，让更多人了解这些独特的故事~',
      color: '#4ECDC4'
    },
    {
      icon: '🎁',
      title: '获得奖励',
      description: '分享越多，收获越多！解锁独特徽章，获得神秘礼物！',
      color: '#FFE66D'
    },
    {
      icon: '🌟',
      title: '结交好友',
      description: '找到志同道合的探索者，一起组队寻找城市中的秘密！',
      color: '#FF9F9F'
    }
  ];

  // 添加鼠标位置检测
  useEffect(() => {
    const handleMouseMove = (e) => {
      const threshold = 150; // 距离底部多少像素时显示
      const isNearBottom = window.innerHeight - e.clientY <= threshold;
      setIsBarHovered(isNearBottom);
    };

    // 添加触摸检测
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const isNearBottom = window.innerHeight - touch.clientY <= 150;
        setIsBarHovered(isNearBottom);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 添加触摸事件理
  useEffect(() => {
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      
      // 根据滑动距离触发相应动画
      if (diff > 50) { // 向上滑动
        setShowRocket(true);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 5秒后隐藏提示
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchWrapper>
      <HomeContainer>
        {/* 光束效果 */}
        {[...Array(8)].map((_, i) => (
          <LightBeam key={i} left={i * 15} rotate={i * 5 - 20} />
        ))}
        
        {/* 行星装饰 */}
        <Planet 
          size={100} 
          color="#FF6B6B" 
          top={20} 
          left={15} 
          duration={6} 
          isMainPlanet={true} 
        />
        <Planet 
          size={60} 
          color="#4ECDC4" 
          top={70} 
          left={75} 
          duration={8} 
        />
        <Planet 
          size={40} 
          color="#FFE66D" 
          top={30} 
          left={80} 
          duration={5}
          isTopRight={true} // 添加标识
        />
        
        {/* 趣味文案 */}
        <FunText 
          rotate={-15} 
          top={25} 
          left={20} 
          isBottomLeft={true}
        >
          快来寻找你的宝贝吧~
        </FunText>
        <FunText rotate={15} top={65} left={70}>错过就很难遇见啦！</FunText>
        <FunText rotate={-5} top={40} left={85}>和Ta贴贴</FunText>

        <TitleContainer>
          <CosmicDecoration>
            <CosmicCircle style={{
              width: '300px',
              height: '300px',
              top: '-50px',
              left: '-100px',
              animationDelay: '-2s'
            }} />
            <CosmicCircle style={{
              width: '200px',
              height: '200px',
              top: '50px',
              right: '-50px',
              animationDelay: '-4s'
            }} />
          </CosmicDecoration>
          
          <AnimatedTitle>
            {titleChars.map((char, index) => (
              <span
                key={index}
                style={{ '--char-index': index }}
              >
                {char}
              </span>
            ))}
          </AnimatedTitle>
        </TitleContainer>

        <Subtitle>✨ 探索城市中的奇妙物品和故事 ✨</Subtitle>
        
        <ButtonContainer>
          <StyledButton to="/explore" className="primary">
            开始探索
          </StyledButton>
          <StyledButton to="/upload" className="secondary">
            分享故事
          </StyledButton>
        </ButtonContainer>

        {/* 添加浮动元素 */}
        <FloatingElements />
      </HomeContainer>

      {/* 火箭动画 */}
      <Rocket className={showRocket ? 'flying' : ''} />

      {/* 第二屏内容 */}
      <CitySection className="city-section">
        <StoryHeader className={showStories ? 'visible' : ''}>
          <h2>✨ 什么是城市寻宝 ✨</h2>
          <p>每个物品背后都有一个等待被发现的故事</p>
        </StoryHeader>
        {/* 流星效果 */}
        {meteors.map((meteor, index) => (
          <Meteor
            key={`meteor-${index}-${meteor.persist}`}
            color={meteor.color}
            top={meteor.top}
            duration={meteor.duration}
            delay={meteor.delay}
            width={meteor.width}
            persist={meteor.persist}
          />
        ))}

        {/* 霓虹星球 */}
        <NeonPlanet size={100} color="#FF6B6B" top={20} left={15} zIndex={3} />
        <NeonPlanet size={60} color="#4ECDC4" top={40} left={75} delay="1s" zIndex={2} />
        <NeonPlanet size={40} color="#FFE66D" top={60} left={35} delay="2s" zIndex={1} />

        {/* 游戏规则部分 */}
        <GameRulesSection id="rules-section">
          <RulesContainer className={showRules ? 'visible' : ''}>
            {gameRules.map((rule, index) => (
              <RuleCard
                key={index}
                color={rule.color}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onMouseMove={(e) => handleCardMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
              >
                <RuleIcon color={rule.color}>{rule.icon}</RuleIcon>
                <RuleTitle>{rule.title}</RuleTitle>
                <RuleDescription>{rule.description}</RuleDescription>
              </RuleCard>
            ))}
          </RulesContainer>
        </GameRulesSection>

        {/* 城市剪影 */}
        <CityScapeContainer>
          <Buildings />
          <BuildingLights />
        </CityScapeContainer>

        {/* 修改底部按钮栏 */}
        <ButtonBar isHovered={isBarHovered}>
          <MainRocketButton
            onClick={(e) => handleShoot(e, '🚀', '#FF6B6B')}
            aria-label="launch rocket"
            isHovered={isBarHovered}
          >
            🚀
          </MainRocketButton>
          
          <IconButtonContainer isHovered={isBarHovered}>
            {buttons.map((button, index) => (
              <IconButton
                key={index}
                color={button.color}
                onClick={(e) => handleShoot(e, button.icon, button.color)}
                aria-label={button.label}
              >
                {button.icon}
              </IconButton>
            ))}
          </IconButtonContainer>

          <CosmicText isHovered={isBarHovered}>
            ✧ 发射你的奇想 ✧
            <br />
            探索无尽宇宙
          </CosmicText>
        </ButtonBar>

        {/* 渲染发射的图标 */}
        {shootingIcons.map(({id, icon, color, startX, startY, delay}) => (
          <ShootingIcon
            key={id}
            color={color}
            style={{
              left: startX,
              top: startY,
              animationDelay: `${delay}ms`
            }}
          >
            {icon}
          </ShootingIcon>
        ))}
      </CitySection>

      {/* 修改故事展示部分 */}
      <StoryContainer id="story-section">
        <StoryHeader className={showStories ? 'visible' : ''}>
          <h2>✨ 探索奇妙故事 ✨</h2>
          <p>每个物品背后都有一个等待被发现的故事</p>
        </StoryHeader>

        <StoryGrid className={showStories ? 'visible' : ''}>
          {stories.map((story, index) => (
            <StoryCard
              key={story.id}
              style={{
                transitionDelay: `${index * 0.2}s`
              }}
            >
              <CardHeader>
                <CardImage src={story.image} alt={story.title} />
              </CardHeader>
              <CardContent>
                <UserInfo>
                  <Avatar src={story.user.avatar} accentColor={story.user.color} />
                  <div>
                    <UserName>{story.user.name}</UserName>
                    <PostTime>{story.time}</PostTime>
                  </div>
                </UserInfo>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>{story.description}</CardDescription>
                <TagContainer>
                  {story.tags.map((tag, i) => (
                    <Tag key={i} color={story.user.color}>{tag}</Tag>
                  ))}
                </TagContainer>
                <CardFooter>
                  <Stats>
                    <StatItem color={story.user.color}>
                      <span>❤️</span> {story.likes}
                    </StatItem>
                    <StatItem color={story.user.color}>
                      <span>💭</span> {story.comments}
                    </StatItem>
                    <StatItem color={story.user.color}>
                      <span>🔄</span> {story.shares}
                    </StatItem>
                  </Stats>
                  <Tag color={story.user.color}>{story.status}</Tag>
                </CardFooter>
              </CardContent>
            </StoryCard>
          ))}
        </StoryGrid>
      </StoryContainer>
      
      <BottomHint show={showHint && !isBarHovered}>
        将鼠标移至底部可发射奇想 ✨
      </BottomHint>
      
      {/* 添加页脚 */}
      <Footer>
        <FooterContent>
          <FooterSection accentColor="#FF6B6B">
            <h4>关于我们</h4>
            <p>奇想寻物是一个让城市探索变得有趣的社区，在这里，每个角落都藏着等待被发现的故事。</p>
            <SocialLinks>
              <SocialIcon href="#" color="#1DA1F2" aria-label="Twitter">𝕏</SocialIcon>
              <SocialIcon href="#" color="#1877F2" aria-label="Facebook">f</SocialIcon>
              <SocialIcon href="#" color="#E4405F" aria-label="Instagram">📸</SocialIcon>
              <SocialIcon href="#" color="#07C160" aria-label="WeChat">💬</SocialIcon>
            </SocialLinks>
          </FooterSection>

          <FooterSection accentColor="#4ECDC4">
            <h4>快速链接</h4>
            <FooterLinks>
              <li><a href="/about">关于我们</a></li>
              <li><a href="/help">帮助中心</a></li>
              <li><a href="/terms">用户协议</a></li>
              <li><a href="/privacy">隐私政策</a></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection accentColor="#FFE66D">
            <h4>联系我们</h4>
            <FooterLinks>
              <li><a href="mailto:contact@example.com">📧 contact@example.com</a></li>
              <li><a href="tel:+86123456789">📞 +86 123-4567-89</a></li>
              <li><a href="#">📍 北京市朝阳区xxx街xxx号</a></li>
            </FooterLinks>
          </FooterSection>
        </FooterContent>

        <Copyright>
          <p>© 2024 奇想寻物. All rights reserved.</p>
          <BeianLink href="http://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
            <img src="/beian-icon.png" alt="备案图标" />
            京ICP备xxxxxxxx号-1
          </BeianLink>
        </Copyright>
      </Footer>
    </TouchWrapper>
  );
}

export default Home; 