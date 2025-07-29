import React from "react";

const DeleteAlert = ({ content, onDelete, isDeleting = false }) => {
  return (
    <div>
      <p className="text-sm ">{content}</p>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;