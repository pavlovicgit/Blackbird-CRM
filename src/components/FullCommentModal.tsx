import React from 'react';
import { Button } from "@/components/ui/button";
import { Comment } from '../utils/types';

interface FullCommentModalProps {
  comment: Comment;
  onClose: () => void;
}

const FullCommentModal: React.FC<FullCommentModalProps> = ({ comment, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center text-black bg-opacity-70 bg-black z-50">
      <div className="relative bg-slate-50 rounded-lg border-2 border-slate-100 p-6 w-1/3 max-w-[500px] max-h-[500px] flex flex-col ">
        <h2 className="text-xl font-bold mb-4">Comment</h2>
        <div className="flex-1 overflow-y-auto mb-16">
          <p className="border text-sm p-4 rounded-md bg-gray-100 break-words">
            {comment.commentText}
          </p>
        </div>
        <Button
          className="absolute bottom-4 right-4 bg-gray-700 text-white"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default FullCommentModal;
