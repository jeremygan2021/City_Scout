import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 动画效果
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px #4ECDC4, 0 0 10px #4ECDC4; }
  100% { box-shadow: 0 0 10px #4ECDC4, 0 0 20px #4ECDC4; }
`;

// 添加新的动画效果
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const gradientBg = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// 添加新的动画
const orbitRotate = keyframes`
  from {
    transform: rotate(0deg) translateX(120px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(120px) rotate(-360deg);
  }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`;

const floatPlanet = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
`;

// 在其他动画定义的地方添加 foundPulse 动画
const foundPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ExploreContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #1a1a1a 0%,
    #2a2a2a 50%,
    #1a1a1a 100%
  );
  background-size: 400% 400%;
  animation: ${gradientBg} 15s ease infinite;
  color: #fff;
  padding: 1rem;
  position: relative;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 50% 0,
      rgba(78, 205, 196, 0.1),
      transparent 50%
    );
    pointer-events: none;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #4ECDC4;
  margin-bottom: 1rem;
  position: relative;
  text-shadow: 
    0 0 10px rgba(78, 205, 196, 0.5),
    0 0 20px rgba(78, 205, 196, 0.3),
    0 0 30px rgba(78, 205, 196, 0.2);
  animation: ${glow} 2s ease-in-out infinite alternate;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      #4ECDC4,
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SearchBar = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  
  input {
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 50px;
    border: 2px solid #4ECDC4;
    background: rgba(78, 205, 196, 0.1);
    color: #fff;
    font-size: 1.1rem;
    backdrop-filter: blur(5px);
    
    &:focus {
      outline: none;
      box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
    }
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(78, 205, 196, 0.2);
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? '0' : '-10px'});
  pointer-events: ${props => props.show ? 'all' : 'none'};
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4ECDC4;
    border-radius: 4px;
  }
`;

const SearchResultItem = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(78, 205, 196, 0.1);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }

  .info {
    flex: 1;

    h4 {
      color: #fff;
      margin: 0 0 0.3rem 0;
    }

    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin: 0;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin: 1rem 0;
  }
`;

const FilterTag = styled.button`
  padding: 0.8rem 2rem;
  border-radius: 100px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  background: ${props => props.active ? 
    'linear-gradient(135deg, #4ECDC4, #45B7AF)' : 
    'rgba(30, 30, 30, 0.8)'
  };
  color: ${props => props.active ? '#1a1a1a' : '#4ECDC4'};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(78, 205, 196, 0.2);
    border-color: #4ECDC4;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem 0;
  }
`;

const ItemCard = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  border: 1px solid rgba(78, 205, 196, 0.2);
  backdrop-filter: blur(10px);
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 
      0 10px 20px rgba(78, 205, 196, 0.2),
      0 0 15px rgba(78, 205, 196, 0.3);
    border-color: rgba(78, 205, 196, 0.5);
  }

  &:active {
    transform: translateY(-5px);
    box-shadow: 
      0 5px 10px rgba(78, 205, 196, 0.2),
      0 0 8px rgba(78, 205, 196, 0.3);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  color: #4ECDC4;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ItemDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
  }
`;

const ItemFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(78, 205, 196, 0.2);
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #4ECDC4;
    
    @media (max-width: 768px) {
      font-size: 0.8rem;
      min-width: 45%;
    }
  }
`;

// 修改标题容器
const TitleContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;
  padding: 2rem 0;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, 
      rgba(78, 205, 196, 0.2) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    animation: ${twinkle} 3s ease-in-out infinite;
  }
`;

// 装饰性星球
const Planet = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 
    inset -5px -5px 15px rgba(0,0,0,0.4),
    0 0 20px ${props => props.color}66;
  animation: ${floatPlanet} ${props => props.duration || '8s'} ease-in-out infinite;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    border: 2px solid ${props => props.color}44;
    top: -10%;
    left: -10%;
    animation: ${twinkle} 4s ease-in-out infinite;
  }
`;

// 轨道环
const Orbit = styled.div`
  position: absolute;
  width: 240px;
  height: 240px;
  border: 1px dashed rgba(78, 205, 196, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  &::before {
    content: '🛸';
    position: absolute;
    font-size: 24px;
    animation: ${orbitRotate} 10s linear infinite;
  }
`;

// 修改搜索容器
const SearchContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  z-index: 2;
`;

// 将重复的 SearchBar 重命名为 SearchWrapper
const SearchWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  padding: 0 1rem;
  
  input {
    width: 100%;
    padding: 1.2rem 3rem;
    border-radius: 100px;
    border: 2px solid rgba(78, 205, 196, 0.3);
    background: rgba(30, 30, 30, 0.8);
    color: #fff;
    font-size: 1.2rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    box-sizing: border-box;
    
    &:focus {
      outline: none;
      border-color: #4ECDC4;
      box-shadow: 
        0 0 0 4px rgba(78, 205, 196, 0.1),
        0 0 20px rgba(78, 205, 196, 0.2);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      padding: 0.8rem 2.5rem;
      font-size: 0.9rem;
      width: calc(100% - 2px);
    }
  }

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  &::before {
    content: '🔍';
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    opacity: 0.7;

    @media (max-width: 768px) {
      left: 1rem;
      font-size: 1rem;
    }
  }

  &::after {
    content: '✨';
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    opacity: 0.7;

    @media (max-width: 768px) {
      right: 1rem;
      font-size: 1rem;
    }
  }
`;

const RarityBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: ${props => {
    switch(props.rarity) {
      case 'SSR': return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 'SR': return 'linear-gradient(135deg, #C0C0C0, #A0A0A0)';
      case 'R': return 'linear-gradient(135deg, #CD7F32, #8B4513)';
      default: return 'linear-gradient(135deg, #4ECDC4, #45B7AF)';
    }
  }};
  color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const ClueSection = styled.div`
  padding: 1rem;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 10px;
  margin-top: 1rem;

  @media (max-width: 768px) {
    padding: 0.8rem;
    
    p {
      font-size: 0.85rem;
      line-height: 1.6;
    }
  }
`;

const FoundBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${props => props.isFound ? 
    'linear-gradient(45deg, #22C55E, #16A34A)' : 
    'rgba(255, 0, 0, 0.7)'};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  z-index: 2;
  animation: ${foundPulse} 2s infinite;
`;

// 在文件顶部定义 someKeyframe 动画
const someKeyframe = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

function Explore() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('全部');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 添加调试日志
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        title: '神秘的青铜门把手',
        description: '这是一个雕刻着龙纹的古老门把手，据说曾经属于一位著名的收藏家...',
        image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882',
        location: '知识花园区域',
        rarity: 'SSR',
        clue: '在书架与书架之间，寻找一扇被遗忘的门',
        story: '传说这个门把手曾经是通往一个秘密藏书室的钥匙，只有在月圆之夜才会显现其真正的模样。',
        discoveredBy: '♀探索者小明',
        discoveryDate: '2024-01-15',
        isFound: true,
      },
      {
        id: 2,
        title: '会发光的古老羽毛笔',
        description: '一支散发着微弱荧光的羽毛笔，似乎带着某种魔法般的特质...',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
        location: '创意实验室',
        rarity: 'SR',
        clue: '在最高的那排展示柜上，找寻一个发着微光的盒子',
        story: '据说这支羽毛笔是某位著名作家遗失的宝物，用它写下的文字会在夜晚发出柔和的光芒。',
        discoveredBy: '♂寻宝者阿华',
        discoveryDate: '2024-02-01',
        isFound: false,
      },
    ];

    console.log('设置模拟数据:', mockItems); // 添加日志
    setItems(mockItems);
    setIsLoading(false);
  }, []);

  // 添加数据变化监听
  useEffect(() => {
    console.log('当前items状态:', items);
    console.log('当前筛选条件:', activeFilter);
    console.log('筛选后的数据:', getFilteredItems());
  }, [items, activeFilter]);

  // 修改筛选标签
  const filters = ['全部', '已找到', '未找到', '未解之谜', '稀有收藏', '神秘物件', '寻宝线索'];

  // 搜索功能
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = items.filter(item => 
        (item.title.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())) &&
        (
          activeFilter === '全部' ||
          (activeFilter === '已找到' && item.isFound) ||
          (activeFilter === '未找到' && !item.isFound) ||
          (activeFilter !== '已找到' && activeFilter !== '未找到')
        )
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // 点击搜索结果项
  const handleResultClick = (item) => {
    setSearchTerm(item.title);
    setShowResults(false);
    navigate(`/item/${item.id}`);
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 添加卡片点击处理函数
  const handleCardClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  // 过滤物品
  const getFilteredItems = () => {
    const filtered = items.filter(item => {
      if (activeFilter === '全部') return true;
      if (activeFilter === '已找到') return item.isFound;
      if (activeFilter === '未找到') return !item.isFound;
      return true;
    });
    console.log('过滤结果:', filtered);
    return filtered;
  };

  return (
    <ExploreContainer>
      <TitleContainer>
        <Planet 
          size={60} 
          color="#4ECDC4" 
          style={{ top: '20%', left: '15%' }} 
        />
        <Planet 
          size={40} 
          color="#FFE66D" 
          style={{ top: '30%', right: '20%' }}
          duration="6s"
        />
        <Planet 
          size={30} 
          color="#FF6B6B" 
          style={{ bottom: '20%', left: '25%' }}
          duration="10s"
        />
        <Orbit />
        <Title>探索奇物</Title>
      </TitleContainer>

      <SearchContainer>
        <SearchWrapper className="search-container">
          <input 
            type="text"
            placeholder="搜索你感兴趣的物品..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <SearchResults show={showResults}>
            {searchResults.map(item => (
              <SearchResultItem 
                key={item.id}
                onClick={() => handleResultClick(item)}
              >
                <img src={item.image} alt={item.title} />
                <div className="info">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </SearchResultItem>
            ))}
            {searchResults.length === 0 && searchTerm && (
              <SearchResultItem>
                <div className="info">
                  <h4>未找到相关结果</h4>
                  <p>试试其他关键词吧~ 🚀</p>
                </div>
              </SearchResultItem>
            )}
          </SearchResults>
        </SearchWrapper>

        <FilterContainer>
          {filters.map(filter => (
            <FilterTag 
              key={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </FilterTag>
          ))}
        </FilterContainer>
      </SearchContainer>

      <ItemGrid>
        {isLoading ? (
          <div>加载中...</div>
        ) : getFilteredItems().length > 0 ? (
          getFilteredItems().map((item, index) => (
            <ItemCard 
              key={item.id} 
              delay={index * 0.2}
              onClick={() => handleCardClick(item.id)}
              role="button"
              aria-label={`查看 ${item.title} 的详细信息`}
            >
              <div style={{ position: 'relative' }}>
                <ItemImage src={item.image} alt={item.title} />
                <RarityBadge rarity={item.rarity}>{item.rarity}</RarityBadge>
                <FoundBadge isFound={item.isFound}>
                  {item.isFound ? '已找到' : '未找到'}
                </FoundBadge>
              </div>
              <ItemInfo>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
                
                <ClueSection>
                  <h4>🗺️ 寻宝线索</h4>
                  <p>{item.clue}</p>
                </ClueSection>
                
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: '#4ECDC4', marginBottom: '0.5rem' }}>
                    📜 背后的故事
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    {item.story}
                  </p>
                </div>

                <ItemFooter>
                  <FooterRow>
                    <span>
                      <i>👤</i>
                      {item.discoveredBy}
                    </span>
                    <span>
                      <i>{item.discoveredBy.includes('♀') ? '👩' : '👨'}</i>
                      {item.discoveredBy.includes('♀') ? '女' : '男'}
                    </span>
                  </FooterRow>
                  <FooterRow>
                    <span>
                      <i>📍</i>
                      {item.location}
                    </span>
                    <span>
                      <i>📅</i>
                      {item.discoveryDate}
                    </span>
                  </FooterRow>
                </ItemFooter>
              </ItemInfo>
            </ItemCard>
          ))
        ) : (
          <div>没有找到相关物品</div>
        )}
      </ItemGrid>
    </ExploreContainer>
  );
}

export default Explore; 