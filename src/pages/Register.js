import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


// 样式定义
const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, #0F172A, #1E293B);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0;
    background: linear-gradient(135deg, #0F172A, #1E293B);
    overflow: hidden;
  }
`;

const CosmicBackground = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const ShootingStar = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: shooting-star linear forwards;

  @keyframes shooting-star {
    from {
      transform: translateX(0) translateY(0) rotate(-45deg);
      opacity: 1;
    }
    to {
      transform: translateX(150px) translateY(150px) rotate(-45deg);
      opacity: 0;
    }
  }
`;

const RegisterCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(94, 234, 212, 0.3);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 20px rgba(94, 234, 212, 0.2);

  @media (max-width: 768px) {
    border-radius: 0;
    max-width: 100%;
    min-height: 100vh;
    padding: 1.5rem;
    padding: 1rem;
    box-shadow: none;
    border: 1px solid rgba(94, 234, 212, 0.3);
    border-radius: 20px;
  }
`;

const CardTitle = styled.h1`
  text-align: center;
  color: #5EEAD4;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  
  span {
    animation: twinkle 1.5s infinite;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StepDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#5EEAD4' : 
    props.completed ? 'rgba(94, 234, 212, 0.5)' : 'rgba(94, 234, 212, 0.2)'};
  transition: all 0.3s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StepContent = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #94A3B8;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(94, 234, 212, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #5EEAD4;
    box-shadow: 0 0 0 2px rgba(94, 234, 212, 0.2);
  }
`;

const TextArea = styled.textarea`
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(94, 234, 212, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  color: #fff;
  height: 100px;
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #5EEAD4;
    box-shadow: 0 0 0 2px rgba(94, 234, 212, 0.2);
  }
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(94, 234, 212, 0.5);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(15, 23, 42, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 2rem;
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
  color: #0F172A;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 234, 212, 0.3);
  }
`;

const GenderSelect = styled.div`
  display: flex;
  gap: 1rem;
`;

const GenderOption = styled.button`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid rgba(94, 234, 212, 0.3);
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(94, 234, 212, 0.2)' : 'transparent'};
  color: ${props => props.selected ? '#5EEAD4' : '#94A3B8'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(94, 234, 212, 0.1);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 15px;
  border: 1px solid rgba(94, 234, 212, 0.3);
  background: ${props => props.selected ? 'rgba(94, 234, 212, 0.2)' : 'transparent'};
  color: ${props => props.selected ? '#5EEAD4' : '#94A3B8'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(94, 234, 212, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const StepButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(94, 234, 212, 0.3);
  background: transparent;
  color: #5EEAD4;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(94, 234, 212, 0.1);
  }
`;

const SubmitButton = styled(StepButton)`
  background: linear-gradient(45deg, #5EEAD4, #2DD4BF);
  border: none;
  color: #0F172A;
  font-weight: 600;

  &:hover {
    background: linear-gradient(45deg, #2DD4BF, #14B8A6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 234, 212, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #FF6B6B;
  font-size: 0.9rem;
  text-align: center;
`;



function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    nickname: '',
    avatar: null,
    gender: '',
    signature: '',
    tags: [],
    status: '正在寻找志同道合的探索者~',
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [shootingStars, setShootingStars] = useState([]);
  const navigate = useNavigate();

  // 预设标签选项
  const tagOptions = [
    '探索达人', '故事收集者', '城市漫游', '文化寻宝',
    '历史爱好者', '摄影玩家', '解谜高手', '社交达人'
  ];

  // 添加验证函数
  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return false;
    }
    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.nickname.trim()) {
      setError('请输入昵称');
      return false;
    }
    if (!formData.gender) {
      setError('请选择性别');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.signature.trim()) {
      setError('请填写个性签名');
      return false;
    }
    if (formData.tags.length === 0) {
      setError('请至少选择一个标签');
      return false;
    }
    return true;
  };

  // 处理头像上传
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('图片大小不能超过5MB');
        return;
      }
      setFormData({ ...formData, avatar: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 处理标签选择
  const handleTagToggle = (tag) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter(t => t !== tag)
      : [...formData.tags, tag].slice(0, 4);
    setFormData({ ...formData, tags: newTags });
  };

  // 添加流星效果
  useEffect(() => {
    const interval = setInterval(() => {
      const newStar = {
        id: Date.now(),
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: 1 + Math.random() * 2
      };
      setShootingStars(prev => [...prev, newStar]);
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
      }, newStar.duration * 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 修改步骤切换处理
  const handleNextStep = () => {
    setError(''); // 清除之前的错误信息
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // 修改表单提交处理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep3()) {
      return;
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/explore');
    } catch (error) {
      setError('注册失败，请重试');
    }
  };

  return (
    <RegisterContainer>
      <CosmicBackground>
        {shootingStars.map(star => (
          <ShootingStar
            key={star.id}
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </CosmicBackground>

      <RegisterCard>
        <CardTitle>
          <span>✨</span> 开启你的探索之旅 <span>✨</span>
        </CardTitle>

        <StepIndicator>
          {[1, 2, 3].map(step => (
            <StepDot key={step} active={step === currentStep} completed={step < currentStep} />
          ))}
        </StepIndicator>

        <Form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <StepContent>
              <FormGroup>
                <Label>用户名</Label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  placeholder="请输入用户名（用于登录）"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>密码</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="请设置密码"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>确认密码</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="请再次输入密码"
                  required
                />
              </FormGroup>
            </StepContent>
          )}

          {currentStep === 2 && (
            <StepContent>
              <AvatarUpload>
                <AvatarPreview>
                  {previewUrl ? (
                    <img src={previewUrl} alt="头像预览" />
                  ) : (
                    <span>📸</span>
                  )}
                </AvatarPreview>
                <AvatarInput
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  id="avatar-upload"
                />
                <UploadLabel htmlFor="avatar-upload">
                  选择头像
                </UploadLabel>
              </AvatarUpload>
              <FormGroup>
                <Label>昵称</Label>
                <Input
                  type="text"
                  value={formData.nickname}
                  onChange={e => setFormData({...formData, nickname: e.target.value})}
                  placeholder="给自己起个好听的昵称吧"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>性别</Label>
                <GenderSelect>
                  <GenderOption
                    selected={formData.gender === 'male'}
                    onClick={() => setFormData({...formData, gender: 'male'})}
                  >
                    👨 男生
                  </GenderOption>
                  <GenderOption
                    selected={formData.gender === 'female'}
                    onClick={() => setFormData({...formData, gender: 'female'})}
                  >
                    👩 女生
                  </GenderOption>
                </GenderSelect>
              </FormGroup>
            </StepContent>
          )}

          {currentStep === 3 && (
            <StepContent>
              <FormGroup>
                <Label>个性签名</Label>
                <TextArea
                  value={formData.signature}
                  onChange={e => setFormData({...formData, signature: e.target.value})}
                  placeholder="写下你的探索宣言..."
                  maxLength={50}
                />
              </FormGroup>
              <FormGroup>
                <Label>选择标签（最多4个）</Label>
                <TagsContainer>
                  {tagOptions.map(tag => (
                    <TagButton
                      key={tag}
                      selected={formData.tags.includes(tag)}
                      onClick={() => handleTagToggle(tag)}
                      type="button"
                    >
                      {tag}
                    </TagButton>
                  ))}
                </TagsContainer>
              </FormGroup>
            </StepContent>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            {currentStep > 1 && (
              <StepButton type="button" onClick={() => setCurrentStep(prev => prev - 1)}>
                上一步
              </StepButton>
            )}
            {currentStep < 3 ? (
              <StepButton type="button" onClick={handleNextStep}>
                下一步
              </StepButton>
            ) : (
              <SubmitButton type="submit">开启探索之旅</SubmitButton>
            )}
          </ButtonGroup>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register; 