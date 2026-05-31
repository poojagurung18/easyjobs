import ChatDashboard from "@/components/chat/ChatDashboard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Messages | EasyJobs Recruiter",
  description: "Chat with applicants",
};

export default function RecruiterChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
        <p className="text-text-secondary">Communicate directly with applicants</p>
      </div>
      <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>}>
        <ChatDashboard role="recruiter" />
      </Suspense>
    </div>
  );
}
