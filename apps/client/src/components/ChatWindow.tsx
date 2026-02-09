import { MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";

const DUMMY_MESSAGES = [
  { id: 1, text: "Hey Javed! Is the project ready?", sender: "Himanshu", time: "10:40 AM", isMe: false },
  { id: 2, text: "Almost! Just finishing the ChatWindow UI.", sender: "Me", time: "10:42 AM", isMe: true },
  { id: 3, text: "Awesome. Let's integrate WebSockets tonight.", sender: "Himanshu", time: "10:45 AM", isMe: false },
];

export default function ChatWindow() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2] relative">
      {/* 1. Header */}
      <div className="h-[60px] bg-[#f0f2f5] px-4 py-2 flex items-center justify-between border-b border-gray-300">
        <div className="flex items-center cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
            H
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-semibold text-gray-800">Himanshu</h2>
            <p className="text-xs text-gray-500">online</p>
          </div>
        </div>
        <div className="flex space-x-4 text-gray-500">
          <MoreVertical className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* 2. Message Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {DUMMY_MESSAGES.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[60%] px-3 py-1.5 rounded-lg shadow-sm relative ${
                msg.isMe ? "bg-[#d9fdd3] text-gray-800 rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-[10px] text-gray-500 float-right ml-2 mt-1">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Input Bar */}
      <div className="bg-[#f0f2f5] px-4 py-3 flex items-center space-x-3">
        <Smile className="text-gray-500 cursor-pointer" />
        <Paperclip className="text-gray-500 cursor-pointer" />
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message" 
          className="flex-1 py-2 px-4 bg-white rounded-lg text-sm focus:outline-none"
        />
        <button className="bg-whatsapp-teal p-2 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}