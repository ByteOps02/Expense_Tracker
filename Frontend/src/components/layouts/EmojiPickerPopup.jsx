import React, { useState } from 'react';
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleEmojiClick = (emojiData) => {
        onSelect(emojiData.emoji);
        setIsOpen(false);
    };

    return (
        <div className="emoji-picker-popup-wrapper">
            <div
                className="emoji-picker-trigger flex items-center gap-2 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <div className="emoji-icon-preview w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                    {icon ? (
                        <span className="text-2xl">{icon}</span>
                    ) : (
                        <LuImage className="text-xl text-gray-400" />
                    )}
                </div>
                <p className="text-sm text-gray-600">{icon ? "Change Icon" : "Pick Icon"}</p>
            </div>
            {isOpen && (
                <div className="emoji-picker-modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-4">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close emoji picker"
                        >
                            <LuX size={20} />
                        </button>
                        <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmojiPickerPopup;