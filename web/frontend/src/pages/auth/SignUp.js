import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useToast } from "../../context/ToastContext";

const api = "http://localhost:3000";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    type: "doctor",
    full_name: "",
    email: "",
    doctor_id: "",
  });

  const signupMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post(`${api}/auth/signup`, userData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        login(data.token, data.user);
        addToast("Account created successfully. Welcome!", "success");
        navigate("/settings", { replace: true, state: { fromSignup: true } });
      } else {
        addToast("Failed to create account", "danger");
      }
    },
    onError: (error) => {
      addToast(
        error.response?.data?.message ||
          "Registration failed due to network error",
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

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.type) {
      addToast("Username, Password, and Role are required", "warning");
      return;
    }
    signupMutation.mutate(formData);
  };

  return (
    <div className="w-full bg-transparent p-0">
      <h2 className="text-3xl font-extrabold text-text-dark text-left mb-2">
        Create an Account
      </h2>
      <p className="text-text-muted text-sm text-left mb-8">
        Join Doctome to start managing your clinic.
      </p>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-dark block">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="dr.sarah"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-semibold text-text-dark block">
            Full Name (Optional)
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Dr. Sarah Jenkins"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-semibold text-text-dark block">
            Email Address (Optional)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@doctome.com"
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
          />
        </div>

        <div className="hidden space-y-2 mt-4">
          <label className="text-sm font-semibold text-text-dark block">
            Role
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm">
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {formData.type === "doctor" && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-semibold text-text-dark block">
              Doctor ID (Optional)
            </label>
            <input
              type="text"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              placeholder="DOC-001"
              className="w-full bg-bg-main border border-border-light rounded-md px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
            />
          </div>
        )}

        <div className="space-y-2 mt-4">
          <label className="text-sm font-semibold text-text-dark block">
            Password
          </label>
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
          disabled={signupMutation.isPending}
          className="w-full py-3 mt-8 shadow-md hover:shadow-lg transition-shadow text-base font-semibold">
          {signupMutation.isPending
            ? "Creating Account..."
            : "Sign Up for Free"}
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted mt-10">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline hover:text-[#0284c7] transition-colors">
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
