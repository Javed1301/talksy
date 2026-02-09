import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Camera, CheckCircle, Mail, User, Info, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    about: user?.about || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/user/update", formData);
      setUser(res.data.user);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      await api.post("/auth/request-verification");
      alert("Verification email sent!");
    } catch (err) {
      alert("Failed to send verification.");
    }
  };

  return (
    <div className="h-screen w-full bg-[#f0f2f5] flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-whatsapp-teal h-[108px] flex items-end p-5 text-white">
        <div className="flex items-center space-x-6 max-w-2xl mx-auto w-full mb-2">
          <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
      </div>

      <div className="max-w-xl w-full mt-6 space-y-6 px-4">
        {/* Avatar Section */}
        <div className="flex justify-center relative group">
          <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm relative">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={80} className="text-gray-400" />
            )}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs text-center p-2">
              <Camera size={24} className="mb-1" />
              CHANGE PROFILE PHOTO
            </div>
          </div>
        </div>

        {/* Verification Alert */}
        {!user?.isVerified && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex justify-between items-center shadow-sm">
            <div className="flex items-center">
              <Mail className="text-yellow-600 mr-3" size={20} />
              <p className="text-sm text-yellow-700 font-medium">Your email is not verified.</p>
            </div>
            <button 
              onClick={verifyEmail}
              className="text-xs bg-yellow-600 text-white px-3 py-1.5 rounded hover:bg-yellow-700 transition"
            >
              Verify Now
            </button>
          </div>
        )}

        <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs text-whatsapp-teal font-medium uppercase tracking-wider">Your Name</label>
            <div className="flex items-center border-b border-gray-200 pb-2 focus-within:border-whatsapp-teal transition">
              <input 
                className="flex-1 outline-none text-gray-800" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <User size={18} className="text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-500">This is not your username or pin. This name will be visible to your Talksy contacts.</p>
          </div>

          {/* About Input */}
          <div className="space-y-2">
            <label className="text-xs text-whatsapp-teal font-medium uppercase tracking-wider">About</label>
            <div className="flex items-center border-b border-gray-200 pb-2 focus-within:border-whatsapp-teal transition">
              <input 
                className="flex-1 outline-none text-gray-800" 
                value={formData.about} 
                onChange={(e) => setFormData({...formData, about: e.target.value})}
              />
              <Info size={18} className="text-gray-400" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-whatsapp-teal text-white py-2.5 rounded shadow hover:bg-[#107d71] transition font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}