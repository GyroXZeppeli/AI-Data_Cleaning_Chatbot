import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatbotUI from '../../components/chatbot/ChatbotUI';

export default function ChatbotPage() {
  return (
    <DashboardLayout>
      <div className="dc-page">
        <div className="dc-page-header">
          <div>
            <div className="dc-page-kicker">AI Assistant</div>
            <h1 className="dc-page-title">Chat with your dataset</h1>
            <p className="dc-page-copy">Use natural language to ask for cleaning actions or data questions. The chat panel now scales down better on shorter laptop screens and mobile viewports.</p>
          </div>
        </div>
        <div className="dc-card p-3 sm:p-5">
          <div className="h-[68dvh] min-h-[460px] sm:min-h-[520px]">
            <ChatbotUI />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
