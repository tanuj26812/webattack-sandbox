import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Shield, Sun, Moon, Send } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "" : null);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Detect site theme from <html>
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Sync theme with site
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("chat-dark", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("chat-dark", "false");
    }
  }, [dark]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, `**You:** ${userMessage}`]);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You are the AI mentor inside WebAttack Sandbox.
User is on the current lab interface.
User says: ${userMessage}`,
          lab: "WebAttack Sandbox"
        })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, `**AI:**\n${data.reply}`]);
    } catch {
      setMessages((prev) => [
        ...prev,
        "**AI:** Secure channel lost. Backend unreachable."
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Cyber Node */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle AI Security Assistant"
        className="fixed bottom-6 right-6 z-[999]
                   w-14 h-14 rounded-full
                   bg-primary/20 border border-primary
                   cyber-glow-strong
                   flex items-center justify-center
                   hover:bg-primary/30 transition-all"
      >
        <Shield className="text-primary w-6 h-6" />
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-[999]
                     w-[360px] h-[460px]
                     cyber-card cyber-border-glow
                     flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono cyber-text-glow">
                AI Security Assistant
              </span>
            </div>

            <button
              onClick={() => setDark((prev) => !prev)}
              className="text-muted-foreground hover:text-primary transition"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 text-sm font-mono pr-1">
            {messages.map((m, i) => (
              <ReactMarkdown
                key={i}
                components={{
                  code({ children }) {
                    return (
                      <SyntaxHighlighter language="javascript">
                        {String(children)}
                      </SyntaxHighlighter>
                    );
                  }
                }}
              >
                {m}
              </ReactMarkdown>
            ))}

            {isLoading && (
              <div className="text-muted-foreground italic">
                ▸ AI analyzing security context...
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                isLoading
                  ? "Waiting for secure response..."
                  : "Ask about vulnerabilities, exploits, or defenses..."
              }
              className="flex-1 cyber-input px-3 py-2 text-sm"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading}
              aria-label="Send message"
              className="cyber-button px-3 rounded-md flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;





