import styled from 'styled-components';

const Building = styled.div`
  position: absolute;
  bottom: 0;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: #1a1a1a;
  left: ${props => props.left}px;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.1) 0%,
      rgba(255,255,255,0) 20%
    );
  }

  .windows {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(${props => props.windows || 3}, 1fr);
    grid-template-rows: repeat(${props => props.floors || 5}, 1fr);
    gap: 5px;
    padding: 5px;

    .window {
      background: rgba(255, 255, 255, 0.2);
      animation: ${cityGlow} ${props => 2 + Math.random() * 4}s ease-in-out infinite;
    }
  }
`;

function CityScape() {
  const buildings = [
    { width: 60, height: 200, left: 0, windows: 2, floors: 8 },
    { width: 80, height: 300, left: 70, windows: 3, floors: 12 },
    { width: 100, height: 250, left: 160, windows: 4, floors: 10 },
    // ... 添加更多建筑
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {buildings.map((building, index) => (
        <Building key={index} {...building}>
          <div className="windows">
            {Array.from({ length: building.windows * building.floors }).map((_, i) => (
              <div key={i} className="window" />
            ))}
          </div>
        </Building>
      ))}
    </div>
  );
}

export default CityScape; 