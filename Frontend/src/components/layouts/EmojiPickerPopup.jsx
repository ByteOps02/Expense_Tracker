import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          {icon ? (
            <img src={icon} alt="Icon" className="w-6 h-6" />
          ) : (
            <LuImage className="w-5 h-5 text-slate-500" />
          )}
        </div>
        <p className="text-sm text-slate-600">
          {icon ? "Change Icon" : "Pick Icon"}
        </p>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl">
            <button
              className="absolute -top-3 -right-3 z-10 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <LuX className="w-4 h-4" />
            </button>

            <EmojiPicker
              open={isOpen}
              onEmojiClick={(emoji) => {
                onSelect(emoji?.imageUrl || "");
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
