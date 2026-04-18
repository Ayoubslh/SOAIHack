import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  return (
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-text-dark text-center mb-2">Reset Password</h2>
      <p className="text-center text-sm text-text-muted mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark block">Email Address</label>
          <input 
            type="email" 
            placeholder="admin@doctome.com" 
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>
        
        <Button className="w-full mt-4">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 flex justify-center">
        <Link to="/login" className="flex items-center text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Login
        </Link>
      </div>
    </Card>
  );
};

export default ForgotPassword;
