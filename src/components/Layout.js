import styled from 'styled-components';
import Navigation from './Navigation';

const MainContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(40, 40, 40, 0.8), #1a1a1a);
    pointer-events: none;
    z-index: 1;
  }
`;

const Content = styled.main`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StarField = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(255, 255, 255, ${props => props.opacity || 0.5});
  box-shadow: 0 0 ${props => props.glow || 2}px ${props => props.glow || 1}px rgba(255, 255, 255, ${props => props.opacity || 0.5});
  animation: twinkle ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  @keyframes twinkle {
    0%, 100% {
      opacity: ${props => props.opacity || 0.5};
    }
    50% {
      opacity: ${props => props.opacity * 0.3 || 0.15};
    }
  }
`;

function Layout({ children }) {
  // 生成更自然的星星数据
  const generateStars = () => {
    return Array.from({ length: 100 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2, // 0.2 到 0.7 之间
      duration: Math.random() * 3 + 4, // 4 到 7 秒之间
      delay: Math.random() * 4, // 0 到 4 秒之间的延迟
      glow: Math.random() * 3 + 1 // 1 到 4 像素之间的发光效果
    }));
  };

  const stars = generateStars();

  return (
    <MainContainer>
      <StarField>
        {stars.map((star, i) => (
          <Star
            key={i}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`
            }}
            opacity={star.opacity}
            duration={star.duration}
            delay={star.delay}
            glow={star.glow}
          />
        ))}
      </StarField>
      <Navigation />
      <Content>{children}</Content>
    </MainContainer>
  );
}

export default Layout; 