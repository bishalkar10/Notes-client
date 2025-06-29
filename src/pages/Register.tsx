import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import useApi from "../hooks/useApi";
import '../styles/Auth.css';
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Register() {
    const { loading, error, execute } = useApi(api.register);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await execute({email, password});
        navigate('/login')
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
                        <FiMail className="login-icon" />
                    </div>
                    
                    <h2 className="login-title">Create an account</h2>
                    <p className="login-subtitle">
                        Join us to start managing your notes efficiently
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
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                disabled={loading}
                                autoComplete="new-password"
                                className="login-input"
                            />
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
                                    Registering...
                                </span>
                            ) : (
                                <span className="button-content">
                                    Register <FiArrowRight className="button-icon" />
                                </span>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                <div className="login-footer">
                    <p className="footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="footer-link">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
