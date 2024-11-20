import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: rgba(30, 30, 30, 0.9);
  padding: 1rem 2rem;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 3;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavItem = styled.li`
  a {
    color: ${props => props.active ? '#FF6B6B' : '#fff'};
    text-decoration: none;
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    position: relative;
    padding: 0.5rem 0;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #FF6B6B;
      transform: scaleX(${props => props.active ? 1 : 0});
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: #FF6B6B;
      &::after {
        transform: scaleX(1);
      }
    }
  }
`;

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/explore', label: '探索' },
    { path: '/upload', label: '上传' },
    { path: '/about', label: '关于我们' },
    { path: '/login', label: '登录' },
  ];

  return (
    <Nav>
      <NavList>
        {navItems.map(item => (
          <NavItem key={item.path} active={location.pathname === item.path}>
            <Link to={item.path}>{item.label}</Link>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}

export default Navigation; 