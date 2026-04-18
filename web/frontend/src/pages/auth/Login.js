import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useToast } from "../../context/ToastContext";

const api = "http://localhost:3000";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${api}/auth/login`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        login(data.token, { role: data.role, user_id: data.user_id });
        addToast("Logged in successfully", "success");
        navigate("/");
      } else {
        addToast("Login failed", "danger");
      }
    },
    onError: (error) => {
      addToast(
        error.response?.data?.message || "Login failed due to network error",
        "danger",
      );
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      addToast("Please provide both username and password", "warning");
      return;
    }
    loginMutation.mutate(formData);
  };

  return (
    <div className="w-full bg-transparent p-0">
      <h2 className="text-3xl font-extrabold text-text-dark text-left mb-2">
        Welcome Back
      </h2>
      <p className="text-text-muted text-sm text-left mb-8">
        Please enter your details to sign in.
      </p>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-dark block">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Doctor"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark block">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary font-medium hover:underline hover:text-[#0284c7] transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3 mt-6 shadow-md hover:shadow-lg transition-shadow text-base font-semibold">
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted mt-10">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-primary font-semibold hover:underline hover:text-[#0284c7] transition-colors">
          Sign up for free
        </Link>
      </p>
    </div>
  );
};

export default Login;
