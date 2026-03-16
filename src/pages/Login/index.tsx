import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import './style.css';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const login = useStore((s) => s.login);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const isValidPhone = (p: string) => /^1[3-9]\d{9}$/.test(p);

  const sendCode = useCallback(() => {
    if (!isValidPhone(phone)) {
      setError('请输入正确的手机号');
      return;
    }
    setError('');
    setCountdown(60);
    setAttempts(0);
  }, [phone]);

  const handleLogin = useCallback(() => {
    if (!isValidPhone(phone)) {
      setError('请输入正确的手机号');
      return;
    }
    if (code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }
    // Mock: any 6-digit code works
    if (attempts >= 5) {
      setError('验证码输错次数过多，请重新获取');
      setCode('');
      return;
    }
    setError('');
    login(phone);
    navigate('/', { replace: true });
  }, [phone, code, attempts, login, navigate]);

  return (
    <div className="login-page">
      <div className="login-header">
        <h1 className="login-title">投资助手</h1>
        <p className="login-subtitle">您的个人投资研究伙伴</p>
      </div>

      <div className="login-form">
        <div className="input-group">
          <label>手机号</label>
          <input
            type="tel"
            placeholder="请输入手机号"
            maxLength={11}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
          />
        </div>

        <div className="input-group">
          <label>验证码</label>
          <div className="code-row">
            <input
              type="text"
              placeholder="请输入验证码"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
            />
            <button
              className="send-code-btn"
              disabled={countdown > 0 || !isValidPhone(phone)}
              onClick={sendCode}
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </button>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          className="login-btn"
          disabled={!isValidPhone(phone) || code.length !== 6}
          onClick={handleLogin}
        >
          登录
        </button>

        <p className="login-hint">首次登录将自动注册账号</p>
      </div>
    </div>
  );
};

export default Login;
