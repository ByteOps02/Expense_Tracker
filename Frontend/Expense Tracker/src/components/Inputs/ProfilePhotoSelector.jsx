import React, { useState, useRef, useEffect } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

/**
 * ProfilePhotoSelector allows users to select, preview, and remove a profile photo.
 * @param {Object} props
 * @param {File|null} image - The current image file (if any)
 * @param {Function} setImage - Setter for the image file
 */
const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Generate preview URL when image changes
    useEffect(() => {
        if (image) {
            const url = URL.createObjectURL(image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [image]);

    // Handle file input change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setImage(null);
    };

    // Trigger file input
    const onChooseFile = () => {
        inputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                className="hidden"
                onChange={handleImageChange}
                aria-label="Choose profile photo"
            />
            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full relative">
                    <LuUser className="w-16 h-16 text-gray-400" aria-label="Default profile icon" />
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow hover:bg-gray-50 focus:outline-none"
                        onClick={onChooseFile}
                        aria-label="Upload profile photo"
                    >
                        <LuUpload className="w-5 h-5 text-blue-500" />
                    </button>
                </div>
            ) : (
                <div className="w-20 h-20 flex flex-col items-center justify-center relative">
                    <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-20 h-20 object-cover rounded-full border border-gray-200"
                    />
                    <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-gray-50 focus:outline-none"
                        onClick={handleRemoveImage}
                        aria-label="Remove profile photo"
                    >
                        <LuTrash className="w-5 h-5 text-red-500" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;