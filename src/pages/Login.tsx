import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import useApi from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import "../styles/Auth.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, execute } = useApi(api.login);
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(()=> {
    if (isAuthenticated){
      navigate("/notes")
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await execute({ email, password });
      if (response?.status === 'success' && response?.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="login-content"
        >
          <div className="login-icon-wrapper">
            <FiLogIn className="login-icon" />
          </div>
          
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Sign in to access your personalized dashboard
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="login-error"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <FiMail />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                disabled={loading}
                autoComplete="email"
                className="login-input"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={loading}
                autoComplete="current-password"
                className="login-input"
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="login-options">
              {/* <div className="remember-me">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="remember-checkbox"
                />
                <label htmlFor="remember-me" className="remember-label">
                  Remember me
                </label>
              </div> */}

              {/* <div className="forgot-password">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div> */}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                <span className="button-content">
                  Sign in <FiArrowRight className="button-icon" />
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>

        <div className="login-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="footer-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
