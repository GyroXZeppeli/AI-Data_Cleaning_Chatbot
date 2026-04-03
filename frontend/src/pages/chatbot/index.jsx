import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatbotUI from '../../components/chatbot/ChatbotUI';

export default function ChatbotPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="dc-card p-4 sm:p-6">
          <div className="h-[70dvh] min-h-[520px]">
            <ChatbotUI />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
