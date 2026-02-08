import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', name: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      alert("Account created! Now login.");
      navigate('/login');
    } catch (err: any) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg space-y-4 w-96">
        <h2 className="text-2xl font-bold text-center">Join Talksy</h2>
        <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" 
          onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="text" placeholder="Username" className="w-full p-2 border rounded" 
          onChange={e => setFormData({...formData, username: e.target.value})} />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
          onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
          onChange={e => setFormData({...formData, password: e.target.value})} />
        <button className="w-full bg-green-500 text-white p-2 rounded font-bold">Sign Up</button>
      </form>
      {/* 🔗 This is the link to the login page */}
    <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#128C7E] font-semibold hover:underline">
            Login here
          </Link>
    </p>
    </div>
  );
}