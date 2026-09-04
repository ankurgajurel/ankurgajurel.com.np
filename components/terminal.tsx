"use client";

import type React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import { XIcon as X } from "@phosphor-icons/react/dist/ssr/X";
import { MinusIcon as Minus } from "@phosphor-icons/react/dist/ssr/Minus";
import { CornersOutIcon as Maximize2 } from "@phosphor-icons/react/dist/ssr/CornersOut";
import { SpeakerHighIcon as Volume2 } from "@phosphor-icons/react/dist/ssr/SpeakerHigh";
import { TerminalWindowIcon as TerminalIcon } from "@phosphor-icons/react/dist/ssr/TerminalWindow";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useConsoleVisibleStore } from "@/store/console";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";

type Theme = {
  name: string;
  background: string;
  text: string;
  prompt: string;
  accent?: string;
  headerBg?: string;
  glow?: string;
};

const themes: Record<string, Theme> = {
  default: {
    name: "default",
    background: "bg-black",
    text: "text-gray-200",
    prompt: "text-gray-200",
    accent: "border-gray-700",
    headerBg: "bg-gray-900",
    glow: "shadow-[0_0_15px_rgba(255,255,255,0.1)]",
  },
  "night-owl": {
    name: "night-owl",
    background: "bg-[#011627]",
    text: "text-[#d6deeb]",
    prompt: "text-[#7fdbca]",
    accent: "border-[#1d3b53]",
    headerBg: "bg-[#0b2942]",
    glow: "shadow-[0_0_20px_rgba(127,219,202,0.1)]",
  },
  omaha: {
    name: "omaha",
    background: "bg-[#1b1b1b]",
    text: "text-[#cdcdcd]",
    prompt: "text-[#cdcdcd]",
    accent: "border-[#333333]",
    headerBg: "bg-[#252525]",
    glow: "shadow-[0_0_15px_rgba(205,205,205,0.05)]",
  },
  "web-rings": {
    name: "web-rings",
    background: "bg-[#2d2b55]",
    text: "text-[#fff]",
    prompt: "text-[#ffcc00]",
    accent: "border-[#423f77]",
    headerBg: "bg-[#34325e]",
    glow: "shadow-[0_0_20px_rgba(255,204,0,0.15)]",
  },
  "crt-red": {
    name: "crt-red",
    background: "bg-black",
    text: "text-red-500",
    prompt: "text-red-500",
    accent: "border-red-900",
    headerBg: "bg-red-950",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  },
  "crt-amber": {
    name: "crt-amber",
    background: "bg-black",
    text: "text-amber-500",
    prompt: "text-amber-500",
    accent: "border-amber-900",
    headerBg: "bg-amber-950",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  },
  "crt-green": {
    name: "crt-green",
    background: "bg-black",
    text: "text-green-500",
    prompt: "text-green-500",
    accent: "border-green-900",
    headerBg: "bg-green-950",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]",
  },
  "crt-mono": {
    name: "crt-mono",
    background: "bg-black",
    text: "text-gray-300",
    prompt: "text-gray-300",
    accent: "border-gray-800",
    headerBg: "bg-gray-900",
    glow: "shadow-[0_0_15px_rgba(209,213,219,0.1)]",
  },
  paper: {
    name: "paper",
    background: "bg-gray-100",
    text: "text-gray-800",
    prompt: "text-gray-800",
    accent: "border-gray-300",
    headerBg: "bg-white",
    glow: "shadow-[0_2px_10px_rgba(0,0,0,0.05)]",
  },
};

export default function Terminal() {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [outputHistory, setOutputHistory] = useState<
    Array<{ command: string; output: string[] }>
  >([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    theme === "dark" ? themes["night-owl"] : themes["paper"]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(5);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userHasDragged, setUserHasDragged] = useState(false);
  const { isVisible, setIsVisible } = useConsoleVisibleStore();

  const [position, setPosition] = useState({
    x: typeof window !== "undefined" ? window.innerWidth - 630 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 430 : 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [terminalSize, setTerminalSize] = useState({
    width:
      typeof window !== "undefined"
        ? window.innerWidth <= 640
          ? window.innerWidth
          : 600
        : 600,
    height:
      typeof window !== "undefined"
        ? window.innerWidth <= 640
          ? window.innerHeight * 0.5
          : 400
        : 400,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const initialSizeRef = useRef({
    width: typeof window !== "undefined" ? window.innerWidth <= 640 ? window.innerWidth : 600 : 600,
    height: typeof window !== "undefined" ? window.innerWidth <= 640 ? window.innerHeight * 0.5 : 400 : 400,
  });

  const resizeTimeoutRef = useRef<NodeJS.Timeout>(null);
  const isResizingRef = useRef(false);

  const focusInput = () => {
    if (!isDragging) {
      inputRef.current?.focus();
    }
  };

  const handleRedirectGallery = () => {
    redirect("/gallery");
  };

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0];
    const subCommand = parts[1];
    const args = parts.slice(2);
    let output: string[] = [];

    if (cmd.trim() === "") {
      return output;
    }

    switch (command) {
      case "clear":
        setOutputHistory([]);
        break;

      case "help":
        output = [
          "Usage: <subcommand> ...",
          "",
          "   The CLI",
          "",
          "Subcommands:",
          "",
          "   gallery      : See my gallery.",
          "   theme list   : List available themes",
          "   theme set    : Set the theme",
          "   music play   : Play music",
          "   music stop   : Stop music",
          "   music volume : Set music volume [0-10]",
          "   close        : Closes the terminal",
          "   clear        : Clears the terminal",
          "   history      : List the commands in this terminal's history file",
          "   help         : Lists the commands available for you to use",
          "   fullscreen   : Toggle fullscreen mode",
          "   minimize     : Minimize the terminal",
        ];
        break;

      case "exit":
        setInput("");
        setIsVisible(false);
        break;

      case "gallery":
        setInput("");
        handleRedirectGallery();
        break;

      case "theme":
        if (subCommand === "list") {
          output = Object.keys(themes);
        } else if (subCommand === "set" && args[0]) {
          const themeName = args[0];
          if (themes[themeName]) {
            setCurrentTheme(themes[themeName]);
            output = [`Theme set to ${themeName}`];
          } else {
            output = [`Error: Theme '${themeName}' not found`];
          }
        } else {
          output = ["Usage: theme list | theme set <theme-name>"];
        }
        break;

      case "music":
        if (subCommand === "play") {
          setIsPlaying(true);
          if (audioRef.current) {
            audioRef.current.play().catch(() => {
              output = [
                "Error: Could not play music. User interaction required.",
              ];
            });
          }
          output = ["Music playing"];
        } else if (subCommand === "stop") {
          setIsPlaying(false);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          output = ["Music stopped"];
        } else if (subCommand === "volume" && args[0]) {
          const vol = Number.parseInt(args[0]);
          if (vol >= 0 && vol <= 10) {
            setVolume(vol);
            if (audioRef.current) {
              audioRef.current.volume = vol / 10;
            }
            output = [`Volume set to ${vol}`];
          } else {
            output = ["Error: Volume must be between 0-10"];
          }
        } else {
          output = ["Usage: music play | music stop | music volume <0-10>"];
        }
        break;

      case "close":
        setIsVisible(false);
        output = ["Closing terminal..."];
        break;

      case "fullscreen":
        setIsFullscreen(!isFullscreen);
        output = [
          isFullscreen ? "Exiting fullscreen mode" : "Entering fullscreen mode",
        ];
        break;

      case "minimize":
        setIsMinimized(true);
        output = ["Minimizing terminal..."];
        break;

      case "history":
        output =
          commandHistory.length > 0
            ? commandHistory.map((cmd, i) => `${i + 1}: ${cmd}`)
            : ["No command history"];
        break;

      default:
        output = [
          `Error: Bad command "${command}. Try 'help' for more information.`,
        ];
    }

    if (command !== "clear") {
      setCommandHistory((prev) => [...prev, cmd]);
      setOutputHistory((prev) => [...prev, { command: cmd, output }]);
    }

    return output;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = input.trim();
      if (cmd) {
        executeCommand(cmd);
        setInput("");
        setHistoryIndex(-1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();

      const commands = [
        "help",
        "clear",
        "theme",
        "music",
        "close",
        "history",
        "fullscreen",
        "minimize",
      ];
      const currentInput = input.trim().split(" ")[0];

      if (currentInput) {
        const matches = commands.filter((cmd) => cmd.startsWith(currentInput));

        if (matches.length === 1) {
          setInput(
            matches[0] +
              (input.includes(" ") ? input.substring(input.indexOf(" ")) : " ")
          );
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).classList.contains("terminal-header")
    ) {
      setIsDragging(true);
      const rect = terminalContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }

      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !isFullscreen) {
      if (typeof window !== "undefined" && window.innerWidth <= 640) {
        const newY = Math.max(
          0,
          Math.min(
            e.clientY - dragOffset.y,
            window.innerHeight - terminalSize.height
          )
        );
        setPosition((prev) => ({
          ...prev,
          y: newY,
        }));
        setUserHasDragged(true);
      } else {
        const newX = Math.max(
          0,
          Math.min(
            e.clientX - dragOffset.x,
            window.innerWidth - terminalSize.width
          )
        );

        const newY = Math.max(
          0,
          Math.min(
            e.clientY - dragOffset.y,
            window.innerHeight - terminalSize.height
          )
        );

        setPosition({
          x: newX,
          y: newY,
        });
        setUserHasDragged(true);
      }
    }
  }, [isDragging, isFullscreen, dragOffset, terminalSize, setPosition, setUserHasDragged]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    const handleWindowResize = () => {
      if (isResizingRef.current) return;
      isResizingRef.current = true;

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (!isFullscreen && !isDragging && !userHasDragged) {
          if (window.innerWidth <= 640) {
            setTerminalSize({
              width: window.innerWidth,
              height: window.innerHeight * 0.5,
            });

            setPosition({
              x: 0,
              y: window.innerHeight - window.innerHeight * 0.5,
            });
          } else {
            setTerminalSize({
              width: initialSizeRef.current.width,
              height: initialSizeRef.current.height,
            });

            setPosition({
              x: window.innerWidth - 620,
              y: window.innerHeight - 420,
            });
          }
        } else {
          // For mobile devices
          if (window.innerWidth <= 640) {
            setTerminalSize({
              width: window.innerWidth,
              height: window.innerHeight * 0.5,
            });

            setPosition((prev) => {
              if (prev.y > window.innerHeight - 100) {
                return {
                  ...prev,
                  y: window.innerHeight - 100,
                };
              }
              return prev;
            });
          } else {
            // For desktop
            setTerminalSize({
              width: initialSizeRef.current.width,
              height: initialSizeRef.current.height,
            });

            setPosition((prev) => {
              const newX = Math.min(prev.x, window.innerWidth - initialSizeRef.current.width);
              const newY = Math.min(prev.y, window.innerHeight - initialSizeRef.current.height);

              if (newX !== prev.x || newY !== prev.y) {
                return {
                  x: Math.max(0, newX),
                  y: Math.max(0, newY),
                };
              }
              return prev;
            });
          }
        }
        isResizingRef.current = false;
      }, 100);
    };

    window.addEventListener("resize", handleWindowResize);

    if (typeof window !== "undefined" && !isDragging && !userHasDragged) {
      handleWindowResize();
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleWindowResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isDragging, dragOffset, isFullscreen, userHasDragged, handleMouseMove]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputHistory]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = volume / 10;
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    setCurrentTheme(theme === "dark" ? themes["night-owl"] : themes["default"]);
  }, [theme]);

  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (isVisible && clickSoundRef.current && !hasPlayedSound.current) {
      clickSoundRef.current.volume = 0.5;
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {
        // Silent catch for browsers that block autoplay
      });

      hasPlayedSound.current = true;
    }

    if (!isVisible) {
      hasPlayedSound.current = false;
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={terminalContainerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          left: isFullscreen
            ? 0
            : typeof window !== "undefined" && window.innerWidth <= 640
            ? 0
            : position.x,
          top: isFullscreen ? 0 : position.y,
          width: isFullscreen
            ? "100%"
            : typeof window !== "undefined" && window.innerWidth <= 640
            ? "100%"
            : terminalSize.width,
          height: isFullscreen ? "100%" : terminalSize.height,
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed z-50 overflow-hidden flex flex-col",
          currentTheme.glow,
          "border",
          currentTheme.accent,
          isFullscreen ? "inset-0" : "",
          "sm:rounded-lg",
          typeof window !== "undefined" &&
            window.innerWidth <= 640 &&
            !isFullscreen
            ? "bottom-0 left-0 right-0 rounded-t-lg rounded-b-none"
            : ""
        )}
        style={{
          left: isFullscreen
            ? 0
            : typeof window !== "undefined" && window.innerWidth <= 640
            ? 0
            : position.x,
          top: isFullscreen ? 0 : position.y,
          width: isFullscreen
            ? "100%"
            : typeof window !== "undefined" && window.innerWidth <= 640
            ? "100%"
            : terminalSize.width,
          height: isFullscreen ? "100%" : terminalSize.height,
        }}
      >
        <div
          className={cn(
            "terminal-header flex items-center justify-between px-4 py-2 border-b",
            currentTheme.headerBg,
            currentTheme.accent
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <TerminalIcon size={16} className={currentTheme.prompt} />
            <span className={cn("font-medium text-sm", currentTheme.text)}>
              Terminal
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPlaying && (
              <button
                onClick={() => setIsPlaying(false)}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
              >
                <Volume2 size={14} className={currentTheme.text} />
              </button>
            )}
            <button
              onClick={toggleMinimize}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
            >
              <Minus size={14} className={currentTheme.text} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
            >
              <Maximize2 size={16} className={currentTheme.text} />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X size={16} className={currentTheme.text} />
            </button>
          </div>
        </div>

        <div
          ref={terminalRef}
          className={cn(
            "flex-1 overflow-auto p-4 font-mono text-sm",
            currentTheme.background,
            "scrollbar-thin scrollbar-thumb-foreground scrollbar-track-transparent"
          )}
          onClick={focusInput}
        >
          <div className="mb-4">
            <p className={cn("text-sm font-bold", currentTheme.prompt)}>
              Welcome to the CLI
            </p>
            <p className={cn("text-xs opacity-80", currentTheme.prompt)}>
              Type &apos;help&apos; to see available commands
            </p>
          </div>

          {outputHistory.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("font-bold", currentTheme.prompt)}>$</span>
                <span className={currentTheme.text}>{item.command}</span>
              </div>
              {item.output.map((line, j) => (
                <div key={j} className="pl-6">
                  <span className={currentTheme.text}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <span className={cn("font-bold", currentTheme.prompt)}>$</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full bg-transparent outline-none caret-current",
                  currentTheme.text
                )}
                autoFocus
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-[2px] h-[1.2em] animate-pulse",
                  currentTheme.prompt
                )}
                style={{
                  left: `${cursorPosition * 0.6}em`,
                  display: input === "" ? "inline-block" : "none",
                }}
              ></span>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src="https://cdn.pixabay.com/audio/2025/04/26/audio_e7ea8791cb.mp3"
          loop
          style={{ display: "none" }}
        />
        <audio
          ref={clickSoundRef}
          src="/sounds/handgun-click.mp3"
          preload="auto"
          style={{ display: "none" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
