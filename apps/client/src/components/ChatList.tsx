import { Search, Filter } from "lucide-react";

// Dummy data for now so we can see the UI
const DUMMY_CHATS = [
  { id: 1, name: "Himanshu", lastMsg: "Check the PR for the backend", time: "10:45 AM", unread: 2 },
  { id: 2, name: "Project Group", lastMsg: "Javed: Let's use Vite for the frontend", time: "Yesterday", unread: 0 },
  { id: 3, name: "Coding Clan", lastMsg: "New challenge is live! 🚀", time: "Yesterday", unread: 5 },
];

export default function ChatList() {
  return (
    <div className="w-[400px] h-full bg-white border-r border-gray-300 flex flex-col">
      {/* 1. Header & Search */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Chats</h1>
          <Filter className="w-5 h-5 text-gray-500 cursor-pointer" />
        </div>
        
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            className="w-full py-2 pl-10 pr-4 bg-[#f0f2f5] rounded-lg text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Scrollable Chats */}
      <div className="flex-1 overflow-y-auto">
        {DUMMY_CHATS.map((chat) => (
          <div 
            key={chat.id} 
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors border-b border-gray-100"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-whatsapp-teal flex-shrink-0 flex items-center justify-center text-white font-semibold">
              {chat.name[0]}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">{chat.lastMsg}</p>
                {chat.unread > 0 && (
                  <span className="bg-[#25D366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}