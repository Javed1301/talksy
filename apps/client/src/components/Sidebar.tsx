import { LogOut, MessageSquare, Settings, UserCircle } from "lucide-react";
import api from "../lib/api";
import { useNavigate, Link } from 'react-router-dom'; // 👈 Added Link
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ user }: { user: any }) {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

  return (
    <div className="w-[64px] bg-[#eae6df] flex flex-col items-center py-4 justify-between border-r border-gray-300">
      <div className="space-y-6 flex flex-col items-center">
        
        {/* 🔗 LINK TO PROFILE PAGE */}
        <Link 
          to="/profile" 
          title="Profile"
          className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-whatsapp-teal transition-all overflow-hidden"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Me" className="w-full h-full object-cover" />
          ) : (
            <span>{user?.name?.[0] || "U"}</span>
          )}
        </Link>

        <MessageSquare className="text-gray-600 cursor-pointer hover:text-black" />
      </div>
      
      <div className="space-y-6 pb-4 flex flex-col items-center">
        <Settings className="text-gray-600 cursor-pointer hover:text-black" />
        <button onClick={handleLogout} title="Logout">
            <LogOut className="text-red-500 cursor-pointer hover:text-red-700" />
        </button>
      </div>
    </div>
  );
}