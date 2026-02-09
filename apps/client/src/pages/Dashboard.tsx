import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen w-full bg-[#f0f2f5] overflow-hidden">
      {/* 1. Left Sidebar - Icons */}
      <Sidebar user={user} />

      {/* 2. Chat List - Contacts/Recent Chats */}
      <ChatList />

      {/* 3. Main Chat Area */}
      <ChatWindow />
    </div>
  );
}