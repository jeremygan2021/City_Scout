import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px #5EEAD4, 0 0 10px #5EEAD4; }
  100% { box-shadow: 0 0 10px #5EEAD4, 0 0 20px #5EEAD4; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const UploadContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  
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
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, 
      rgba(94, 234, 212, 0.1) 0%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

const UploadContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(94, 234, 212, 0.2);
  box-shadow: 0 0 40px rgba(94, 234, 212, 0.1);
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0.5rem;
    padding: 1rem;
    border-radius: 16px;
    width: calc(100% - 1rem);
    
    h1 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    
    h2 {
      font-size: 1.4rem;
      margin: 1rem 0;
    }
    
    .item-section {
      margin-bottom: 1.5rem;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 25px;
    padding: 2px;
    background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    
    @media (max-width: 768px) {
      border-radius: 17px;
    }
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: #5EEAD4;
    font-size: 2.8rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 20px rgba(94, 234, 212, 0.3);
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  }
  
  p {
    color: #94A3B8;
    font-size: 1.1rem;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
      padding: 0 1rem;
    }
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  
  h2 {
    color: #5EEAD4;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 15px rgba(94, 234, 212, 0.3);
  }
  
  p {
    color: #94A3B8;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const LoginButton = styled.button`
  padding: 1rem 3rem;
  background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
  border: none;
  border-radius: 12px;
  color: #0F172A;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(94, 234, 212, 0.3);
  }
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    background: transparent;
    padding: 1rem 0;
    border-radius: 0;
    
    &::before {
      display: none;
    }
  }
`;

const InputGroup = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 1.5rem;
  margin-right: 1rem;
  
  label {
    display: block;
    color: #94A3B8;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  input, textarea, select {
    position: relative;
    z-index: 2;
    width: 95%;
    padding: 0.8rem 1rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(94, 234, 212, 0.2);
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
    
    &:focus {
      outline: none;
      border-color: #5EEAD4;
      box-shadow: 0 0 15px rgba(94, 234, 212, 0.2);
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
    
    input, textarea, select {
      width: 100%;
      padding: 0.8rem;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(94, 234, 212, 0.3);
      font-size: 0.9rem;
    }
    
    textarea {
      min-height: 100px;
    }
    
    label {
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
    }
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed rgba(94, 234, 212, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  
  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .preview-item {
    position: relative;
    aspect-ratio: 1;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid rgba(94, 234, 212, 0.3);
    }
    
    .remove-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      background: #FF4B4B;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.1);
        background: #FF3333;
      }
    }
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
  border: none;
  border-radius: 12px;
  color: #0F172A;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(94, 234, 212, 0.3);
  }
`;

const FloatingIcon = styled.div`
  position: absolute;
  font-size: ${props => props.size || '2rem'};
  color: #5EEAD4;
  opacity: 0.5;
  animation: ${float} ${props => props.duration || '3s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    filter: blur(8px);
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(94, 234, 212, 0.2);
    transform: translateY(-50%);
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0 1.5rem;
    padding: 0;
    
    &::before {
      height: 1px;
    }
  }
`;

const ProgressStep = styled.div`
  position: relative;
  z-index: 1;
  background: ${props => props.active ? 
    'linear-gradient(45deg, #5EEAD4, #2DD4BF)' : 
    'rgba(15, 23, 42, 0.8)'};
  color: ${props => props.active ? '#0F172A' : '#5EEAD4'};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &::after {
    content: '${props => props.label}';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.5rem;
    white-space: nowrap;
    color: #94A3B8;
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
    
    &::after {
      font-size: 0.7rem;
      margin-top: 0.3rem;
    }
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: ${props => props.progress}%;
  height: 2px;
  background: linear-gradient(90deg, #5EEAD4, #2DD4BF);
  transform: translateY(-50%);
  transition: width 0.3s ease;
  z-index: 0;
`;

const AiGenerateButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.disabled ? 
    'rgba(94, 234, 212, 0.2)' : 
    'linear-gradient(45deg, #5EEAD4, #2DD4BF)'};
  border: none;
  border-radius: 8px;
  color: ${props => props.disabled ? '#94A3B8' : '#0F172A'};
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(94, 234, 212, 0.3);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const AiInfoText = styled.p`
  color: #94A3B8;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  font-style: italic;
`;

// 添加新的样式组件
const FileUploadButton = styled.div`
  position: relative;
  margin-bottom: 2rem;
  
  input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
  
  .upload-button {
    padding: 1.5rem;
    background: rgba(15, 23, 42, 0.6);
    border: 2px dashed rgba(94, 234, 212, 0.3);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #5EEAD4;
      background: rgba(15, 23, 42, 0.8);
      transform: translateY(-2px);
    }
    
    .icon {
      font-size: 2.5rem;
      color: #5EEAD4;
      animation: ${float} 3s ease-in-out infinite;
    }
    
    .text {
      color: #94A3B8;
      font-size: 1rem;
      text-align: center;
      
      strong {
        color: #5EEAD4;
        display: block;
        margin-bottom: 0.5rem;
      }
    }
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  
  .preview-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(94, 234, 212, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      border-color: #5EEAD4;
      box-shadow: 0 8px 12px rgba(94, 234, 212, 0.2);
      
      .remove-btn {
        opacity: 1;
      }
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 75, 75, 0.9);
      color: white;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      opacity: 0;
      font-size: 1.2rem;
      
      &:hover {
        transform: scale(1.1);
        background: #FF3333;
      }
    }
  }
  
  .image-count {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(15, 23, 42, 0.8);
    color: #5EEAD4;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 0.5rem;
    margin-top: 1rem;
    
    .preview-item {
      border-radius: 8px;
      
      .remove-btn {
        opacity: 1;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

function Upload() {
  const [formData, setFormData] = useState({
    name: '',
    rarity: 'N',
    description: '',
    location: '',
    clue: '',
    images: [],
    password: '',
    hiddenInfo: '',
    story: '',
    discoveryStory: '',
    additionalInfo: '',
    secretContent: {
      title: '',
      additionalInfo: '',
      discoveryStory: '',
      secretLocations: ['', '', '']
    }
  });

  const navigate = useNavigate();

  // 添加当前步骤 state
  const [currentStep, setCurrentStep] = useState(1);
  
  // 添加表单验证状态
  const [formValidation, setFormValidation] = useState({
    basicInfo: false,
    locationInfo: false,
    imageInfo: false,
    storyInfo: false,
    secretInfo: false
  });

  // 添加 AI 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 检查是否可以使用 AI 生成
  const canUseAiGenerate = () => {
    return formData.name && 
           formData.description && 
           formData.images.length > 0 && 
           formData.password && 
           formData.secretContent.title;
  };
  
  // AI 生成处理函数
  const handleAiGenerate = async () => {
    if (!canUseAiGenerate()) return;
    
    setIsGenerating(true);
    try {
      // 这里添加实际的 AI 生成逻辑
      // const response = await generateAiStory(formData);
      // setFormData(prev => ({
      //   ...prev,
      //   story: response.story,
      //   discoveryStory: response.discoveryStory,
      //   additionalInfo: response.additionalInfo
      // }));
      
      // 模拟 AI 生成延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('AI 生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 检查基本信息是否完整
  const validateBasicInfo = () => {
    const isValid = 
      formData.name.length > 0 && 
      formData.rarity !== '' && 
      formData.description.length > 0;
    
    setFormValidation(prev => ({
      ...prev,
      basicInfo: isValid
    }));
    
    if (isValid && currentStep === 1) {
      setCurrentStep(2);
    }
  };

  // 检查位置信息是否完整
  const validateLocationInfo = () => {
    const isValid = 
      formData.location !== '' && 
      formData.clue.length > 0;
    
    setFormValidation(prev => ({
      ...prev,
      locationInfo: isValid
    }));
    
    if (isValid && currentStep === 2) {
      setCurrentStep(3);
    }
  };

  // 检查图片是否上传
  const validateImageInfo = () => {
    const isValid = formData.images.length > 0;
    setFormValidation(prev => ({
      ...prev,
      imageInfo: isValid
    }));
    
    if (isValid && currentStep === 3) {
      setCurrentStep(4);
    }
  };

  // 添加故事息验证
  const validateStoryInfo = () => {
    const isValid = 
      formData.story.length > 0 && 
      formData.discoveryStory.length > 0 &&
      formData.additionalInfo.length > 0;
    
    setFormValidation(prev => ({
      ...prev,
      storyInfo: isValid
    }));
    
    if (isValid && currentStep === 4) {
      setCurrentStep(5);
    }
  };

  // 修改神秘内容验证
  const validateSecretInfo = () => {
    const { secretContent } = formData;
    const isValid = 
      formData.password.length > 0 && 
      secretContent.title.length > 0 &&
      secretContent.additionalInfo.length > 0 &&
      secretContent.discoveryStory.length > 0 &&
      secretContent.secretLocations.some(location => location.length > 0);
    
    setFormValidation(prev => ({
      ...prev,
      secretInfo: isValid
    }));
  };

  // 修改输入处理函数
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('secretContent.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        secretContent: {
          ...prev.secretContent,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // 根据输入字段验证相应部分
    switch(name) {
      case 'name':
      case 'rarity':
      case 'description':
        setTimeout(validateBasicInfo, 300);
        break;
      case 'location':
      case 'clue':
        setTimeout(validateLocationInfo, 300);
        break;
      case 'story':
      case 'discoveryStory':
      case 'additionalInfo':
        setTimeout(validateStoryInfo, 300);
        break;
      case 'secretContent.title':
      case 'secretContent.additionalInfo':
      case 'secretContent.discoveryStory':
        setTimeout(validateSecretInfo, 300);
        break;
      default:
        break;
    }
  };

  // 修改图片上传处理函数
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file: file,
            preview: reader.result
          });
          
          if (newImages.length === files.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages]
            }));
            setTimeout(validateImageInfo, 300);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // 修改移除图片函数
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('表单提交的数据如下:');
    console.log('图片:', formData.images);
    console.log('密码:', formData.password);
    console.log('隐藏信息:', formData.hiddenInfo);
    // 添加提交逻辑
    // 例如，发送数据到服务器
    // 处理响应 

    // 跳转到完成页
    navigate('/upload-complete');
  };

  // 计算总进度
  const calculateProgress = () => {
    const steps = Object.values(formValidation);
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  // 处理秘密位置的输入
  const handleSecretLocationChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      secretContent: {
        ...prev.secretContent,
        secretLocations: prev.secretContent.secretLocations.map((loc, i) => 
          i === index ? value : loc
        )
      }
    }));
    setTimeout(validateSecretInfo, 300);
  };

  return (
    <UploadContainer>
      <FloatingIcon style={{ top: '10%', left: '10%' }} delay="0s">🎯</FloatingIcon>
      <FloatingIcon style={{ top: '20%', right: '15%' }} delay="0.5s" size="2.5rem">✨</FloatingIcon>
      <FloatingIcon style={{ bottom: '15%', left: '20%' }} delay="1s">🔍</FloatingIcon>
      
      <UploadContent>
        <Header>
          <h1>上传藏宝图</h1>
          <p>分享你的发现，让更多人参与寻宝的乐趣，让更多人找到你</p>
        </Header>
        
        <ProgressIndicator>
          <ProgressBar progress={calculateProgress()} />
          <ProgressStep 
            active={currentStep >= 1} 
            completed={formValidation.basicInfo}
            label="基本信息"
          >1</ProgressStep>
          <ProgressStep 
            active={currentStep >= 2} 
            completed={formValidation.locationInfo}
            label="位置信息"
          >2</ProgressStep>
          <ProgressStep 
            active={currentStep >= 3} 
            completed={formValidation.imageInfo}
            label="图片上传"
          >3</ProgressStep>
          <ProgressStep 
            active={currentStep >= 4} 
            completed={formValidation.storyInfo}
            label="故事背景"
          >4</ProgressStep>
          <ProgressStep 
            active={currentStep >= 5} 
            completed={formValidation.secretInfo}
            label="神秘内容"
          >5</ProgressStep>
        </ProgressIndicator>
        
        <UploadForm onSubmit={handleSubmit}>
          <FormSection delay="0.2s" active={currentStep === 1}>
            <h3>基本信息</h3>
            <InputGroup>
              <label>物品名称 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="给你的物品起个独特的名字"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <label>稀有度 *</label>
              <select
                name="rarity"
                value={formData.rarity || ""}
                onChange={handleInputChange}
                required
              >
                <option value="N">请选择稀有度</option>
                <option value="1N">N - 普通</option>
                <option value="2R">R - 稀有</option>
                <option value="3SR">SR - 超稀有</option>
                <option value="4SSR">SSR - 绝世珍品</option>
              </select>
            </InputGroup>
            
            <InputGroup>
              <label>物品描述 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="详细描述一下这个物品的特点..."
                required
              />
            </InputGroup>
          </FormSection>
          
          <FormSection delay="0.4s" active={currentStep === 2}>
            <h3>位置信息</h3>
            <InputGroup>
              <label>藏匿地点</label>
              <select
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
              >
                <option value="A">请选择藏匿地点</option>
                <option value="A">A - 天台区域3楼</option>
                <option value="B">B - 前门区域</option>
                <option value="C">C - 知识花园</option>
                <option value="D">D - 创意实验室</option>
                
              </select>
            </InputGroup>
            
            <InputGroup>
              <label>寻宝线索</label>
              <textarea
                name="clue"
                value={formData.clue}
                onChange={handleInputChange}
                placeholder="给寻宝者一些提示..."
              />
            </InputGroup>
          </FormSection>
          
          <FormSection delay="0.6s" active={currentStep === 3}>
            <h3>图片上传</h3>
            <ImageUpload>
              <FileUploadButton>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  multiple
                />
                <div className="upload-button">
                  <span className="icon" role="img" aria-label="upload">📸</span>
                  <div className="text">
                    <strong>点击或拖拽上传图片</strong>
                    支持多张图片同时上传 • 每张图片不超过 5MB • 首张图片为封面
                  </div>
                </div>
              </FileUploadButton>
              
              {formData.images.length > 0 && (
                <ImagePreviewGrid>
                  {formData.images.map((image, index) => (
                    <div key={index} className="preview-item">
                      <img src={image.preview} alt={`预览 ${index + 1}`} />
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveImage(index)}
                        type="button"
                      >
                        ×
                      </button>
                      <div className="image-count">
                        {index + 1}/{formData.images.length}
                      </div>
                    </div>
                  ))}
                </ImagePreviewGrid>
              )}
            </ImageUpload>
          </FormSection>
          
          <FormSection delay="1s" active={currentStep === 5}>
            <h3>神秘内容</h3>
            <InputGroup>
              <label>验证密码 *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="设置一个密码，用于解锁隐藏内容"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <label>神秘标题 *</label>
              <input
                type="text"
                name="secretContent.title"
                value={formData.secretContent.title}
                onChange={handleInputChange}
                placeholder="给这个秘密起个标题..."
                required
              />
            </InputGroup>
            
            <InputGroup>
              <label>隐藏故事 *</label>
              <textarea
                name="secretContent.discoveryStory"
                value={formData.secretContent.discoveryStory}
                onChange={handleInputChange}
                placeholder="这里可以详细描述发现的完整过程..."
                required
              />
            </InputGroup>
            
            <InputGroup>
              <label>额外秘密信息 & 联系方式 📞</label>
              <textarea
                name="secretContent.additionalInfo"
                value={formData.secretContent.additionalInfo}
                onChange={handleInputChange}
                placeholder="如果你希望对方找到你，可以填写你的联系方式...."
                required
              />
            </InputGroup>
            
            <InputGroup>
              <label>🗺️关键地点 或者 是📱联系方式 (至少填写一个)</label>
              {formData.secretContent.secretLocations.map((location, index) => (
                <input
                  key={index}
                  type="text"
                  value={location}
                  onChange={(e) => handleSecretLocationChange(index, e.target.value)}
                  placeholder={`🗺️关键地点 & 📱联系方式 ${index + 1}`}
                  style={{ marginBottom: '0.5rem' }}
                />
              ))}
            </InputGroup>
          </FormSection>

          
          <FormSection delay="0.8s" active={currentStep === 4}>
            <h3>故事背景</h3>
            
            <AiGenerateButton
              type="button"
              disabled={!canUseAiGenerate()}
              onClick={handleAiGenerate}
            >
              {isGenerating ? (
                <>
                  <span>生成中...</span>
                  <span role="img" aria-label="loading">🔄</span>
                </>
              ) : (
                <>
                  <span>AI 智能生成</span>
                  <span role="img" aria-label="sparkles">✨</span>
                </>
              )}
            </AiGenerateButton>
            
            <AiInfoText>
              注意：需要先完成基本信息、图片上传和神秘内容的填写才能使用 AI 生成功能
            </AiInfoText>
            
            <InputGroup>
              <label>物品事 *</label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleInputChange}
                placeholder="这个物品背后有什么有趣的故事..."
                required
              />
            </InputGroup>
            
            <InputGroup>
              <label>发现过程 *</label>
              <textarea
                name="discoveryStory"
                value={formData.discoveryStory}
                onChange={handleInputChange}
                placeholder="描述一下你是如何发现这个物品的..."
                required
              />
            </InputGroup>
            
            <InputGroup>
              <label>额外信息 *</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="还有什么特别的信息想要分享..."
                required
              />
            </InputGroup>
          </FormSection>
          
          
          <SubmitButton 
            type="submit"
            disabled={!Object.values(formValidation).every(Boolean)}
          >
            发布物品 <span role="img" aria-label="rocket">🚀</span>
          </SubmitButton>
        </UploadForm>
      </UploadContent>
    </UploadContainer>
  );
}

export default Upload; 