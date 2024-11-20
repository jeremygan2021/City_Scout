import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const Card = styled.div`
  background: rgba(40, 40, 40, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  margin: 1rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 107, 107, 0.3);
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
      rgba(255, 107, 107, 0.1),
      transparent
    );
    transform: translateX(-100%);
    transition: 0.5s;
  }

  &:hover::before {
    transform: translateX(100%);
  }
`;

const Tag = styled.span`
  background: ${props => props.color || '#FF6B6B'};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
`;

const Distance = styled.span`
  color: #4ECDC4;
  font-size: 0.9rem;
`;

const Title = styled.h3`
  color: #fff;
  margin: 0.5rem 0;
`;

const Info = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

export { Card, Tag, Distance, Title, Info }; 