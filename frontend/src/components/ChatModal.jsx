import { useEffect, useRef, useState } from "react";
import { TextField, IconButton, Paper } from "@mui/material";
import { X } from "lucide-react";
import clsx from "clsx";
import { sendChat, getChatsForCareer } from "../services/agent/client";
import { toastAlert } from "../lib/toastAlert";

const ChatModal = ({ open, onClose, careerId }) => {
  const [inputValue, setInputValue] = useState("");
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [chats, open]);

  useEffect(() => {
    if (open && careerId) {
      (async () => {
        const { success, data, message } = await getChatsForCareer(careerId);
        if (success) {
          const formatted = data.flatMap((msg, idx) => {
            const convo = [];
            if (idx == 0 && msg.initial_prompt) {
              convo.push({ sender: "user", text: msg.initial_prompt });
            } else if (msg.user_input) {
              convo.push({ sender: "user", text: msg.user_input });
            }
            if (idx !== 0 && msg.agent_response) {
              try {
                msg.agent_response = JSON.parse(msg.agent_response);
                convo.push({
                  sender: "ai",
                  text: msg.agent_response?.message || msg.agent_response,
                });
              } catch {
                convo.push({
                  sender: "ai",
                  text: "Unable to parse AI response",
                });
              }
            }
            return convo;
          });
          setChats(formatted);
        } else {
          toastAlert({ type: "error", message });
        }
      })();
    } else if (!open) {
      setChats([]);
    }
  }, [open, careerId]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const payload = { message: inputValue };
    setChats((prev) => [...prev, { sender: "user", text: inputValue }]);
    setInputValue("");

    const { success, message, data } = await sendChat(payload, careerId);

    if (success) {
      try {
        setChats((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              JSON.parse(data.agent_response)?.message || data.agent_response,
          },
        ]);
      } catch (error) {
        console.log(error);
        setChats((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.agent_response,
          },
        ]);
      }
    } else {
      toastAlert({ type: "error", message });
      setChats((prev) => prev.slice(0, prev.length - 1));
      setInputValue(payload.message);
    }
  };

  const pastelUser = "ml-auto bg-pink-200 text-pink-800 border border-pink-100";
  const pastelAI = "mr-auto bg-cyan-50 text-sky-800 border border-sky-100";

  if (!open) return null;

  return (
    <Paper
      elevation={6}
      className="fixed bottom-4 right-4 z-50 w-[90vw] sm:w-[360px] h-[480px] flex flex-col rounded-2xl overflow-hidden shadow-xl border border-pink-200"
      style={{
        background: "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%)",
        backdropFilter: "blur(5px)",
      }}
    >
      {/* Chat Header */}
      <div className="bg-white/80 px-4 py-3 border-b-2 border-pink-100 flex justify-between items-center">
        <span className="font-semibold text-sm text-purple-600">
          Chat with CareerGen AI
        </span>
        <IconButton size="small" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-transparent text-sm">
        {chats.map((msg, index) => (
          <div
            key={index}
            className={clsx(
              "max-w-[80%] px-3 py-2 rounded-lg shadow-sm",
              msg.sender === "user" ? pastelUser : pastelAI
            )}
            style={{ wordBreak: "break-word", fontSize: 15 }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleChatSubmit}
        className="p-3 border-t-2 border-pink-100 bg-white/80"
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleChatSubmit(e);
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "#fff0f6",
              borderRadius: 2,
            },
            "&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline":
              { borderColor: "#f9a8d4" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fbcfe8",
            },
          }}
        />
      </form>
    </Paper>
  );
};

export default ChatModal;
