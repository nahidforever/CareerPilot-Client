import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ChatAssistant from "@/components/ai/ChatAssistant";
import type {
  AIConversationSummary,
  AIConversationsResponse,
} from "@/types/ai";

export const metadata: Metadata = {
  title: "AI Assistant | CareerPilot",
  description: "Get AI-powered guidance and CareerPilot navigation support.",
};

export const dynamic = "force-dynamic";

interface InitialConversationsData {
  conversations: AIConversationSummary[];
  error: string;
}

async function getInitialConversations(
  token: string,
): Promise<InitialConversationsData> {
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  if (!serverUri) {
    return {
      conversations: [],
      error: "NEXT_PUBLIC_SERVER_URI is not configured.",
    };
  }

  try {
    const response = await fetch(`${serverUri}/ai/conversations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = (await response
      .json()
      .catch(() => null)) as AIConversationsResponse | null;

    if (!response.ok) {
      return {
        conversations: [],
        error: result?.message || "Unable to load conversations.",
      };
    }

    return {
      conversations: Array.isArray(result?.data) ? result.data : [],
      error: "",
    };
  } catch (error) {
    return {
      conversations: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load conversations.",
    };
  }
}

export default async function AIAssistantPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    redirect("/login");
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenResponse?.token) {
    redirect("/login");
  }

  const { conversations, error } = await getInitialConversations(
    tokenResponse.token,
  );

  return (
    <ChatAssistant
      userName={session.user.name || "CareerPilot User"}
      initialConversations={conversations}
      initialError={error}
    />
  );
}
