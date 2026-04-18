import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-text-dark text-center mb-6">Set New Password</h2>
      
      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark block">New Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark block">Confirm Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          />
        </div>
        
        <Button type="submit" className="w-full mt-4">
          Reset Password
        </Button>
      </form>
    </Card>
  );
};

export default ResetPassword;
