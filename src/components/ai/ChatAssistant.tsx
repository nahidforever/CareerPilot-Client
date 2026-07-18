"use client";

import {
  useCallback,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Clock3,
  LoaderCircle,
  Menu,
  MessageSquare,
  Plus,
  RefreshCcw,
  SendHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type {
  AIConversationResponse,
  AIConversationSummary,
  AIConversationsResponse,
  AIMessage,
  AIStreamEvent,
} from "@/types/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatAssistantProps {
  userName: string;
  initialConversations: AIConversationSummary[];
  initialError?: string;
}

const DEFAULT_SUGGESTIONS = [
  "How do I explore jobs?",
  "How can I publish a job?",
  "How should I prepare for an interview?",
];

function formatConversationDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(parsedDate);
}

function formatMessageTime(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

function createLocalConversationTitle(message: string) {
  const normalizedMessage = message.replace(/\s+/g, " ").trim();

  if (normalizedMessage.length <= 55) {
    return normalizedMessage;
  }

  return `${normalizedMessage.slice(0, 52)}...`;
}

function getServerUri() {
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  if (!serverUri) {
    throw new Error("NEXT_PUBLIC_SERVER_URI is not configured.");
  }

  return serverUri;
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-5 text-xl font-semibold text-white first:mt-0">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="mb-3 mt-5 text-lg font-semibold text-white first:mt-0">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-base font-semibold text-slate-100 first:mt-0">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="mb-3 leading-7 last:mb-0">{children}</p>
        ),

        ul: ({ children }) => (
          <ul className="mb-4 ml-5 list-disc space-y-1.5 last:mb-0">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="mb-4 ml-5 list-decimal space-y-1.5 last:mb-0">
            {children}
          </ol>
        ),

        li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,

        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),

        em: ({ children }) => (
          <em className="italic text-slate-200">{children}</em>
        ),

        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-2 border-blue-400/50 bg-blue-500/[0.06] px-4 py-3 text-slate-400">
            {children}
          </blockquote>
        ),

        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-300 underline decoration-blue-400/40 underline-offset-4 transition hover:text-blue-200"
          >
            {children}
          </a>
        ),

        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-6 text-slate-200">
            {children}
          </pre>
        ),

        code: ({ children, className }) => (
          <code
            className={`font-mono text-[0.9em] text-blue-200 ${
              className ? className : "rounded bg-black/30 px-1.5 py-0.5"
            }`}
          >
            {children}
          </code>
        ),

        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[500px] border-collapse text-left text-xs">
              {children}
            </table>
          </div>
        ),

        thead: ({ children }) => (
          <thead className="bg-white/[0.06] text-slate-200">{children}</thead>
        ),

        tbody: ({ children }) => (
          <tbody className="divide-y divide-white/10">{children}</tbody>
        ),

        th: ({ children }) => (
          <th className="border-r border-white/10 px-3 py-2.5 font-semibold last:border-r-0">
            {children}
          </th>
        ),

        td: ({ children }) => (
          <td className="border-r border-white/10 px-3 py-2.5 text-slate-400 last:border-r-0">
            {children}
          </td>
        ),

        hr: () => <hr className="my-5 border-white/10" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function ChatAssistant({
  userName,
  initialConversations,
  initialError = "",
}: ChatAssistantProps) {
  const router = useRouter();

  const conversationRequestId = useRef(0);

  const messagesViewportRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] =
    useState<AIConversationSummary[]>(initialConversations);

  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const [currentConversationTitle, setCurrentConversationTitle] =
    useState("New conversation");

  const [messages, setMessages] = useState<AIMessage[]>([]);

  const [input, setInput] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);

  const [isLoading, setIsLoading] = useState(false);

  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [error, setError] = useState(initialError);

  const [messageError, setMessageError] = useState("");

  const [conversationToDelete, setConversationToDelete] =
    useState<AIConversationSummary | null>(null);

  const scrollToBottom = useCallback((smooth = false) => {
    window.requestAnimationFrame(() => {
      const viewport = messagesViewportRef.current;

      if (!viewport) {
        return;
      }

      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    });
  }, []);

  const getToken = useCallback(async () => {
    const { data: tokenData, error: tokenError } = await authClient.token();

    if (tokenError || !tokenData?.token) {
      router.replace("/login");

      throw new Error("Your session has expired. Please sign in again.");
    }

    return tokenData.token;
  }, [router]);

  const loadConversations = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
        setError("");
      }

      try {
        const token = await getToken();
        const serverUri = getServerUri();

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
          throw new Error(result?.message || "Unable to load conversations.");
        }

        setConversations(Array.isArray(result?.data) ? result.data : []);

        setError("");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load conversations.";

        if (showLoading) {
          setError(errorMessage);
        } else {
          toast.error("Conversation history could not be refreshed.");
        }
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [getToken],
  );

  const loadConversation = useCallback(
    async (conversation: AIConversationSummary) => {
      if (isSending) {
        toast.info("Please wait for the current response to finish.");
        return;
      }

      const requestId = conversationRequestId.current + 1;

      conversationRequestId.current = requestId;

      setCurrentConversationId(conversation._id);

      setCurrentConversationTitle(conversation.title);

      setMessages([]);
      setSuggestions([]);
      setMessageError("");
      setIsMessagesLoading(true);
      setIsMobileSidebarOpen(false);

      try {
        const token = await getToken();
        const serverUri = getServerUri();

        const response = await fetch(
          `${serverUri}/ai/conversations/${conversation._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const result = (await response
          .json()
          .catch(() => null)) as AIConversationResponse | null;

        if (!response.ok) {
          throw new Error(
            result?.message || "Unable to load the conversation.",
          );
        }

        if (requestId !== conversationRequestId.current) {
          return;
        }

        setCurrentConversationTitle(result?.data?.title || conversation.title);

        setMessages(
          Array.isArray(result?.data?.messages) ? result.data.messages : [],
        );

        scrollToBottom();
      } catch (error) {
        if (requestId !== conversationRequestId.current) {
          return;
        }

        setMessageError(
          error instanceof Error
            ? error.message
            : "Unable to load the conversation.",
        );
      } finally {
        if (requestId === conversationRequestId.current) {
          setIsMessagesLoading(false);
        }
      }
    },
    [getToken, isSending, scrollToBottom],
  );

  const handleNewChat = () => {
    if (isSending) {
      toast.info("Please wait for the current response to finish.");
      return;
    }

    conversationRequestId.current += 1;

    setCurrentConversationId(null);
    setCurrentConversationTitle("New conversation");
    setMessages([]);
    setInput("");
    setSuggestions(DEFAULT_SUGGESTIONS);
    setMessageError("");
    setIsMessagesLoading(false);
    setIsMobileSidebarOpen(false);
  };

  const handleConversationKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    conversation: AIConversationSummary,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    void loadConversation(conversation);
  };

  const handleRetryConversation = () => {
    const conversation = conversations.find(
      (item) => item._id === currentConversationId,
    );

    if (!conversation) {
      return;
    }

    void loadConversation(conversation);
  };

  const handleDeleteRequest = (
    event: MouseEvent<HTMLButtonElement>,
    conversation: AIConversationSummary,
  ) => {
    event.stopPropagation();

    if (isSending && conversation._id === currentConversationId) {
      toast.info("Please wait for the current response to finish.");

      return;
    }

    setConversationToDelete(conversation);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) {
      return;
    }

    const conversationId = conversationToDelete._id;

    setIsDeletingId(conversationId);

    try {
      const token = await getToken();
      const serverUri = getServerUri();

      const response = await fetch(
        `${serverUri}/ai/conversations/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to delete the conversation.",
        );
      }

      setConversations((current) =>
        current.filter((conversation) => conversation._id !== conversationId),
      );

      if (currentConversationId === conversationId) {
        handleNewChat();
      }

      setConversationToDelete(null);

      toast.success("Conversation deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete the conversation.",
      );
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleSendMessage = async (messageOverride?: string) => {
    const normalizedMessage = (messageOverride ?? input).trim();

    if (!normalizedMessage || isSending || isMessagesLoading) {
      return;
    }

    if (normalizedMessage.length > 2000) {
      toast.error("Message cannot exceed 2000 characters.");
      return;
    }

    const userMessageId = crypto.randomUUID();

    const assistantMessageId = crypto.randomUUID();

    const userMessage: AIMessage = {
      id: userMessageId,
      role: "user",
      content: normalizedMessage,
      createdAt: new Date().toISOString(),
    };

    const assistantPlaceholder: AIMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    if (!currentConversationId) {
      setCurrentConversationTitle(
        createLocalConversationTitle(normalizedMessage),
      );
    }

    setInput("");
    setMessageError("");
    setSuggestions([]);
    setIsSending(true);

    setMessages((current) => [...current, userMessage, assistantPlaceholder]);

    scrollToBottom(true);

    let receivedStreamEvent = false;
    let receivedDoneEvent = false;
    let assistantContent = "";

    try {
      const token = await getToken();
      const serverUri = getServerUri();

      const response = await fetch(`${serverUri}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: currentConversationId || undefined,
          message: normalizedMessage,
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(
          result?.message || "Unable to generate an AI response.",
        );
      }

      if (!response.body) {
        throw new Error("Streaming response is not available.");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let buffer = "";

      const processStreamLine = (line: string) => {
        const normalizedLine = line.trim();

        if (!normalizedLine) {
          return;
        }

        let streamEvent: AIStreamEvent;

        try {
          streamEvent = JSON.parse(normalizedLine) as AIStreamEvent;
        } catch {
          throw new Error("Received an invalid streaming response.");
        }

        receivedStreamEvent = true;

        if (streamEvent.type === "conversation" && streamEvent.conversationId) {
          setCurrentConversationId(streamEvent.conversationId);

          return;
        }

        if (streamEvent.type === "delta" && streamEvent.content) {
          assistantContent += streamEvent.content;

          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    content: message.content + streamEvent.content,
                  }
                : message,
            ),
          );

          scrollToBottom();
          return;
        }

        if (streamEvent.type === "done") {
          receivedDoneEvent = true;

          if (streamEvent.conversationId) {
            setCurrentConversationId(streamEvent.conversationId);
          }

          setSuggestions(
            Array.isArray(streamEvent.suggestions)
              ? streamEvent.suggestions
              : [],
          );

          return;
        }

        if (streamEvent.type === "error") {
          throw new Error(
            streamEvent.message || "Unable to generate an AI response.",
          );
        }
      };

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          processStreamLine(line);
        }
      }

      buffer += decoder.decode();

      if (buffer.trim()) {
        processStreamLine(buffer);
      }

      if (!receivedDoneEvent) {
        throw new Error("The AI response ended before completion.");
      }

      if (!assistantContent.trim()) {
        throw new Error("The AI provider returned an empty response.");
      }

      scrollToBottom(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to generate an AI response.";

      if (!receivedStreamEvent) {
        setMessages((current) =>
          current.filter(
            (message) =>
              message.id !== userMessageId && message.id !== assistantMessageId,
          ),
        );

        setInput(normalizedMessage);
      } else if (!assistantContent.trim()) {
        setMessages((current) =>
          current.filter((message) => message.id !== assistantMessageId),
        );
      }

      toast.error(errorMessage);
    } finally {
      setIsSending(false);

      if (receivedStreamEvent) {
        void loadConversations(false);
      }

      scrollToBottom();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void handleSendMessage();
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      void handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    void handleSendMessage(prompt);
  };

  const renderSidebar = () => {
    return (
      <div className="flex h-full flex-col bg-[#0c1726]">
        <div className="border-b border-white/10 p-4">
          <button
            type="button"
            onClick={handleNewChat}
            disabled={isSending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            New conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-3 flex items-center justify-between gap-3 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              Conversation history
            </p>

            {!isLoading && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-500">
                {conversations.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[74px] animate-pulse rounded-xl bg-white/[0.04]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-4 text-center">
              <p className="text-xs leading-5 text-red-300">{error}</p>

              <button
                type="button"
                onClick={() => void loadConversations()}
                className="mt-3 text-xs font-semibold text-red-200 transition hover:text-white"
              >
                Try again
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center">
              <MessageSquare className="mx-auto h-6 w-6 text-slate-700" />

              <p className="mt-3 text-sm font-medium text-slate-400">
                No conversations yet
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Start a new conversation with CareerPilot AI.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const active = currentConversationId === conversation._id;

                const isDeleting = isDeletingId === conversation._id;

                return (
                  <div
                    key={conversation._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => void loadConversation(conversation)}
                    onKeyDown={(event) =>
                      handleConversationKeyDown(event, conversation)
                    }
                    className={`group flex cursor-pointer items-center gap-1 rounded-xl border p-1 outline-none transition focus-visible:border-blue-400/40 focus-visible:ring-2 focus-visible:ring-blue-500/20 ${
                      active
                        ? "border-blue-400/20 bg-blue-500/10"
                        : "border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="min-w-0 flex-1 px-2 py-2">
                      <p
                        className={`truncate text-sm font-medium ${
                          active ? "text-blue-200" : "text-slate-300"
                        }`}
                      >
                        {conversation.title}
                      </p>

                      {conversation.lastMessage && (
                        <p className="mt-1 truncate text-[11px] text-slate-600">
                          {conversation.lastMessage}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-700">
                        <Clock3 className="h-3 w-3" />

                        <span>
                          {formatConversationDate(conversation.updatedAt)}
                        </span>

                        <span>•</span>

                        <span>{conversation.messageCount} messages</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) =>
                        handleDeleteRequest(event, conversation)
                      }
                      disabled={isDeleting}
                      aria-label={`Delete ${conversation.title}`}
                      title="Delete conversation"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      {isDeleting ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSuggestions = () => {
    if (isSending || suggestions.length === 0) {
      return null;
    }

    return (
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestedPrompt(suggestion)}
            className="rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  const renderChatContent = () => {
    if (isMessagesLoading) {
      return (
        <div className="mx-auto w-full max-w-4xl space-y-7">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`flex gap-3 ${
                item % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`h-24 animate-pulse rounded-2xl bg-white/[0.05] ${
                  item % 2 === 0 ? "w-[55%]" : "w-[72%]"
                }`}
              />
            </div>
          ))}
        </div>
      );
    }

    if (messageError) {
      return (
        <div className="m-auto w-full max-w-md rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-6 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-red-300" />

          <h2 className="mt-4 font-semibold text-red-100">
            Conversation could not be loaded
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-300/80">
            {messageError}
          </p>

          <button
            type="button"
            onClick={handleRetryConversation}
            className="mx-auto mt-5 flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-400/20"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="m-auto w-full max-w-2xl text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300">
            <Sparkles className="h-9 w-9" />
          </span>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-blue-400">
            AI-powered assistance
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Hello, {userName}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Ask about CareerPilot, job searching, interview preparation, career
            development or any general topic.
          </p>

          {renderSuggestions()}
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-4xl space-y-7">
        {messages.map((message) => {
          const isUser = message.role === "user";

          const isTyping = !isUser && isSending && message.content.length === 0;

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/15">
                  <Bot className="h-4 w-4" />
                </span>
              )}

              <div
                className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
                    isUser
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md border border-white/10 bg-white/[0.045] text-slate-300"
                  }`}
                >
                  {isTyping ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <LoaderCircle className="h-4 w-4 animate-spin" />

                      <span>CareerPilot AI is typing...</span>
                    </div>
                  ) : isUser ? (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  ) : (
                    <div className="min-w-0 break-words">
                      <MarkdownMessage content={message.content} />
                    </div>
                  )}
                </div>

                <span className="mt-1.5 px-1 text-[10px] text-slate-700">
                  {isUser ? "You" : "CareerPilot AI"}

                  {message.createdAt
                    ? ` • ${formatMessageTime(message.createdAt)}`
                    : ""}
                </span>
              </div>

              {isUser && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300">
                  <UserRound className="h-4 w-4" />
                </span>
              )}
            </div>
          );
        })}

        {renderSuggestions()}
      </div>
    );
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b1422] px-3 py-4 text-white sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto flex min-h-[700px] w-full max-w-[1500px] overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-2xl shadow-black/20 lg:h-[calc(100vh-120px)]">
        <aside className="hidden w-80 shrink-0 border-r border-white/10 lg:block">
          {renderSidebar()}
        </aside>

        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              aria-label="Close conversation history"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <aside className="relative h-full w-[88%] max-w-sm border-r border-white/10 shadow-2xl">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                aria-label="Close conversation history"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#111d2d] text-slate-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {renderSidebar()}
            </aside>
          </div>
        )}

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open conversation history"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.07] hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20">
              <Bot className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-semibold text-white sm:text-lg">
                CareerPilot AI Assistant
              </h1>

              <p className="truncate text-xs text-slate-500">
                {currentConversationTitle}
              </p>
            </div>

            <span className="hidden items-center gap-2 text-xs text-emerald-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {isSending ? "Generating" : "Online"}
            </span>
          </header>

          <div
            ref={messagesViewportRef}
            aria-busy={isMessagesLoading || isSending}
            className="flex flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8"
          >
            {renderChatContent()}
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#0d1827] px-3 py-3 sm:px-5 sm:py-4">
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-lg shadow-black/10 transition focus-within:border-blue-400/30 focus-within:ring-2 focus-within:ring-blue-500/10">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  maxLength={2000}
                  rows={1}
                  disabled={isSending || isMessagesLoading}
                  placeholder="Message CareerPilot AI..."
                  aria-label="Message CareerPilot AI"
                  className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={isSending || isMessagesLoading || !input.trim()}
                  aria-label="Send message"
                  title="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
                >
                  {isSending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[10px] text-slate-700">
                <span>Enter to send, Shift + Enter for a new line</span>

                <span>{input.length}/2000</span>
              </div>
            </form>
          </div>
        </section>
      </div>

      {conversationToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-conversation-title"
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() => setConversationToDelete(null)}
            disabled={Boolean(isDeletingId)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#111d2d] p-6 shadow-2xl shadow-black/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2
              id="delete-conversation-title"
              className="mt-5 text-xl font-semibold text-white"
            >
              Delete conversation?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This will permanently delete{" "}
              <span className="font-medium text-slate-200">
                “{conversationToDelete.title}”
              </span>{" "}
              and all of its messages.
            </p>

            <p className="mt-2 text-xs text-slate-600">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConversationToDelete(null)}
                disabled={Boolean(isDeletingId)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={Boolean(isDeletingId)}
                className="flex h-10 min-w-24 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingId ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Deleting
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
