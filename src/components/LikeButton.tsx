import { Heart } from "lucide-react";
import { useState } from "react";

interface LikeButtonProps {
  imageId: number;
  isLiked: boolean;
  likesCount: number;
  onToggleLike: (imageId: number) => void;
  likesEnabled?: boolean; // Whether likes are enabled
}

export default function LikeButton({ 
  imageId, 
  isLiked, 
  likesCount, 
  onToggleLike,
  likesEnabled = true // Default to enabled
}: LikeButtonProps) {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  const handleClick = () => {
    // Only allow clicking if likes are enabled
    if (!likesEnabled) return;
    
    // Optimistic update
    if (localIsLiked) {
      setLocalIsLiked(false);
      setLocalLikesCount(prev => prev - 1);
    } else {
      setLocalIsLiked(true);
      setLocalLikesCount(prev => prev + 1);
    }
    
    // Call the actual function to update in database
    onToggleLike(imageId);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={!likesEnabled}
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-full transition-all
        ${!likesEnabled 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : localIsLiked 
            ? 'bg-red-500 text-white' 
            : 'bg-white/80 text-gray-700 hover:bg-white'}
      `}
    >
      <Heart 
        className={`w-4 h-4 ${!likesEnabled ? 'text-gray-500' : localIsLiked ? 'fill-current' : ''}`} 
      />
      <span className="text-sm font-medium">{localLikesCount}</span>
    </button>
  );
}

interface CommentBoxProps {
  imageId: number;
  commentsCount: number;
  onAddComment: (imageId: number, comment: string) => void;
}

export function CommentBox({ 
  imageId, 
  onAddComment 
}: Omit<CommentBoxProps, 'commentsCount'>) {
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    // Call the actual function to add comment to database
    onAddComment(imageId, comment);
    
    // Clear the input
    setComment('');
  };

  return (
    <div className="mt-2 p-3 rounded-lg">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-1.5 text-sm border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
      </form>
    </div>
  );
}