"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatTextIcon as MessageSquare } from "@phosphor-icons/react/dist/ssr/ChatText";
import { PaperPlaneTiltIcon as Send } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { XIcon as X } from "@phosphor-icons/react/dist/ssr/X";
import Button from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { Message } from "ai";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 bg-primary"
      >
        <MessageSquare className="text-primary-foreground transition-transform duration-300 text-3xl" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-16 right-0 w-96 bg-background/95 backdrop-blur-xl border border-foreground/20 flex flex-col justify-between min-h-[500px] max-h-[600px]"
        >
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 animate-pulse"></div>
              <h3 className="text-lg font-semibold">talk to ankur</h3>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              className="p-2 transition-all duration-200 hover:rotate-90"
            >
              <X className="text-primary-foreground" size={18} />
            </Button>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col flex-grow gap-3 overflow-y-auto text-sm font-light leading-relaxed max-h-80 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-2 self-start border border-foreground/50"
                >
                  <div className="text-foreground">
                    Hello! How can I help you today?
                  </div>
                </motion.div>
              ) : (
                messages.map((message: Message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`px-4 py-2 border max-w-[85%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground self-end border-foreground/20"
                        : "text-foreground self-start border-1 border-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-foreground self-start border border-foreground/50 px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-primary animate-bounce [animation-delay:0.2s]"></div>
                    <span className="ml-2">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t-[0.5px] border-border/50 pt-4 bg-gradient-to-r from-background to-muted/20 -mx-6 px-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex w-full space-x-2">
                  <input
                    ref={inputRef}
                    autoFocus
                    type="text"
                    placeholder="ask me anything..."
                    className="w-full px-3 py-2 border-[0.5px] border-foreground/50 outline-none text-sm bg-background/50 backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground/60"
                    value={input}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {/* <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary/50 hover:bg-primary/80 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Button> */}
                  <Button
                    className=""
                    type="submit"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
