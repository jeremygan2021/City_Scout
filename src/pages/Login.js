import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const sparkle = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const floatingShip = keyframes`
  0% { transform: translate(-100vw, 20vh) rotate(10deg); }
  100% { transform: translate(200vw, 10vh) rotate(-10deg); }
`;

const meteorShower = keyframes`
  0% { transform: translate(100%, -100%) rotate(45deg); opacity: 1; }
  100% { transform: translate(-100%, 100%) rotate(45deg); opacity: 0; }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a2e 0%, #16213e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: url('/images/stars-bg.png') repeat;
    animation: slowMove 40s linear infinite;
    opacity: 0.5;
  }
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: ${sparkle} ${props => props.duration || '2s'} infinite;
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(255, 107, 107, 0.1);
  position: relative;
  z-index: 2;
  
  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 50px rgba(255, 107, 107, 0.2);
  }
`;

const Title = styled.h1`
  color: #FF6B6B;
  font-family: '手写体', cursive;
  text-align: center;
  margin-bottom: 2rem;
`;

const Mascot = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  animation: ${float} 3s ease-in-out infinite;
  img {
    width: 100%;
    height: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
    }
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: #FF6B6B;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5252;
  }
`;

const LinkText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: #FF6B6B;
    text-decoration: none;
    margin-left: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SpaceShip = styled.div`
  position: absolute;
  width: 150px;
  height: 80px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
  animation: ${floatingShip} ${props => props.duration || '15s'} linear infinite;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Meteor = styled.div`
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, #ffffff, transparent);
  animation: ${meteorShower} ${props => props.duration || '2s'} linear infinite;
`;

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // 生成随机星星
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 2}s`
      };
      stars.push(<Star key={i} style={style} />);
    }
    return stars;
  };

  // 生成流星
  const generateMeteors = () => {
    const meteors = [];
    for (let i = 0; i < 10; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 5}s`
      };
      meteors.push(<Meteor key={`meteor-${i}`} style={style} />);
    }
    return meteors;
  };

  // 生成飞船
  const generateSpaceShips = () => {
    return (
      <>
        <SpaceShip duration="15s">
          <img src="/images/spaceship1.png" alt="宇宙飞船" />
        </SpaceShip>
        <SpaceShip duration="20s" style={{ top: '70%' }}>
          <img src="/images/spaceship2.png" alt="海盗船" />
        </SpaceShip>
      </>
    );
  };

  return (
    <Container>
      {generateStars()}
      {generateMeteors()}
      {generateSpaceShips()}
      <LoginCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        <Title>登录你的寻宝飞船</Title>
        <Mascot>
          <img src="/images/cute-planet-mascot.png" alt="可爱的星球吉祥物" />
        </Mascot>
        <Input 
          type="text"
          placeholder="输入你的星际身份"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <Input 
          type="password"
          placeholder="输入你的秘密口令"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          开启星际之旅
        </Button>
        <LinkText>
          还没有账号？<a href="/register">立即注册</a>
        </LinkText>
        <LinkText>
          <a href="/forgot-password">忘记密码</a>
        </LinkText>
      </LoginCard>
    </Container>
  );
}

export default Login; 