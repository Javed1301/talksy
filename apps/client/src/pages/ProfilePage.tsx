import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Camera, User, Info, ArrowLeft, AtSign,Mail, CheckCircle, AlertCircle, } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    about: user?.about || "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a local preview
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Use FormData instead of JSON
    const data = new FormData();
    data.append("name", formData.name);
    data.append("username", formData.username);
    data.append("about", formData.about);
    
    if (selectedFile) {
      data.append("avatar", selectedFile); // Matches upload.single('avatar') on backend
    }

    try {
      const res = await api.put("/user/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.user);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/request-verification");
      alert(res.data.message || "Check your inbox for the verification link!");
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to send email.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full bg-[#f0f2f5] flex flex-col items-center overflow-y-auto">
      {/* Header */}
      <div className="w-full bg-[#008069] h-[108px] flex items-end p-5 text-white shrink-0">
        <div className="flex items-center space-x-6 max-w-2xl mx-auto w-full mb-2">
          <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
      </div>

      <div className="max-w-xl w-full mt-6 space-y-6 px-4 pb-10">
        {/* Avatar Section */}
        <div className="flex justify-center relative group">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm relative cursor-pointer"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={80} className="text-gray-400" />
            )}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] text-center p-2">
              <Camera size={24} className="mb-1" />
              CHANGE PROFILE PHOTO
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Email verification */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <label className="text-xs text-[#008069] font-medium uppercase tracking-wider flex items-center gap-2">
            <Mail size={14}/> Email Status
          </label>
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex flex-col">
              <span className="text-gray-800 font-medium">{user?.email}</span>
              {user?.isVerified ? (
                <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <CheckCircle size={12} /> Verified Account
                </span>
              ) : (
                <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> Not Verified
                </span>
              )}
            </div>

            {!user?.isVerified && (
              <button
                onClick={handleRequestVerification}
                disabled={loading}
                className="text-xs bg-[#008069] text-white px-4 py-2 rounded-full hover:bg-[#066354] transition disabled:bg-gray-400"
              >
                {loading ? "Sending..." : "Verify Now"}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-xs text-[#008069] font-medium uppercase tracking-wider flex items-center gap-1">
              <AtSign size={14}/> Username
            </label>
            <input 
              className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#008069] transition text-gray-800" 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-xs text-[#008069] font-medium uppercase tracking-wider">Your Name</label>
            <input 
              className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#008069] transition text-gray-800" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* About Field */}
          <div className="space-y-2">
            <label className="text-xs text-[#008069] font-medium uppercase tracking-wider">About</label>
            <input 
              className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#008069] transition text-gray-800" 
              value={formData.about} 
              onChange={(e) => setFormData({...formData, about: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#008069] text-white py-2.5 rounded shadow hover:bg-[#066354] transition font-medium disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}