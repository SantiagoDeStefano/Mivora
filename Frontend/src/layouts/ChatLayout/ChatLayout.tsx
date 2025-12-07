import ChatHeader from '../../components/ChatHeader'
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden">
        <ChatHeader />
        {children}
    </div>
  );
}
