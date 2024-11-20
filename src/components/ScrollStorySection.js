import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Section = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StoryCard = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  opacity: 0;
  transform: translateY(50px);
  
  &.visible {
    animation: ${fadeInUp} 0.8s ease-out forwards;
    animation-delay: ${props => props.delay || '0s'};
  }
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
`;

const StoryImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  opacity: 0;
  
  &.visible {
    animation: ${scaleIn} 1s ease-out forwards;
    animation-delay: ${props => props.delay || '0s'};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const StoryContent = styled.div`
  padding: 2rem;
  background: rgba(40, 40, 40, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #FF6B6B;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const StoryTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${props => props.color || '#FF6B6B'};
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

function ScrollStorySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    const elements = sectionRef.current.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stories = [
    {
      id: 1,
      title: "城市角落的小确幸",
      description: "在繁忙的街道转角，发现了这家温馨的小店。店主是个可爱的老爷爷，每天都会准备不同的手工甜点...",
      image: "https://images.unsplash.com/photo-1234",
      tags: ["美食", "温暖", "日常"],
      color: "#FF6B6B"
    },
    {
      id: 2,
      title: "遗失的时光邮票",
      description: "在古董市场淘到一本老相册，里面夹着一张50年代的邮票，上面的邮戳依然清晰可见...",
      image: "https://images.unsplash.com/photo-5678",
      tags: ["收藏", "历史", "故事"],
      color: "#4ECDC4"
    },
    // 可以添加更多故事...
  ];

  return (
    <Section ref={sectionRef}>
      {stories.map((story, index) => (
        <StoryCard 
          key={story.id} 
          className="animate-on-scroll"
          delay={`${index * 0.2}s`}
        >
          <StoryGrid>
            <StoryImage 
              className="animate-on-scroll"
              delay={`${index * 0.2 + 0.3}s`}
            >
              <img src={story.image} alt={story.title} />
            </StoryImage>
            <StoryContent>
              <h2>{story.title}</h2>
              {story.tags.map((tag, i) => (
                <StoryTag 
                  key={i}
                  color={story.color}
                >
                  {tag}
                </StoryTag>
              ))}
              <p>{story.description}</p>
            </StoryContent>
          </StoryGrid>
        </StoryCard>
      ))}
    </Section>
  );
}

export default ScrollStorySection; 