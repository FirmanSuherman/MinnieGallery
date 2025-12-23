import { useEffect, useState } from "react";
import { useGallery } from "../context/GalleryContext";
import type { ExtendedGalleryItem } from "../types";
import { Heart, MessageCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase/supabase";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { filteredItems, toggleLike, addComment, fetchAllImages } = useGallery();
  const [items, setItems] = useState<ExtendedGalleryItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<ExtendedGalleryItem | null>(null);
  const [likesEnabled, setLikesEnabled] = useState<boolean>(true); // Default to enabled
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get current user and fetch all images
    const initializePage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Fetch like settings
      await fetchLikeSettings();
      
      // Fetch all images for homepage
      await fetchAllImages();
    };
    
    initializePage();
    
    // Use filteredItems from gallery context
    setItems(filteredItems);
  }, [filteredItems, user, fetchAllImages]);
  
  // Fetch like settings from Supabase
  const fetchLikeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings') // Assuming we have a settings table
        .select('value')
        .eq('key', 'likes_enabled')
        .single();
      
      if (error) {
        // If settings don't exist, default to true (enabled)
        setLikesEnabled(true);
        console.log('Like settings not found, defaulting to enabled');
        // Create default setting if it doesn't exist
        await setLikeSetting(true);
        return;
      }
      
      if (data) {
        setLikesEnabled(data.value === 'true');
      } else {
        setLikesEnabled(true); // Default to enabled
        // Create default setting if it doesn't exist
        await setLikeSetting(true);
      }
    } catch (error) {
      console.error('Error fetching like settings:', error);
      setLikesEnabled(true); // Default to enabled on error
    }
  };
  
  // Update like settings in Supabase
  const setLikeSetting = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert(
          { key: 'likes_enabled', value: enabled.toString() },
          { onConflict: 'key' }
        );
      
      if (error) {
        console.error('Error updating like settings:', error);
        return false;
      }
      
      setLikesEnabled(enabled);
      return true;
    } catch (error) {
      console.error('Error updating like settings:', error);
      return false;
    }
  };
  
  // Update selectedImage when filteredItems change to ensure like status is updated
  useEffect(() => {
    if (selectedImage) {
      const updatedItem = filteredItems.find(item => item.id === selectedImage.id);
      if (updatedItem) {
        setSelectedImage(updatedItem);
      }
    }
  }, [filteredItems, selectedImage]);
  
  const handleImageClick = (item: ExtendedGalleryItem) => {
    setSelectedImage(item);
  };
  
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto container mx-auto px-4 py-8">

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No photos available yet</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="mb-6 break-inside-avoid bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                  onClick={() => handleImageClick(item)}
                >
                  <div className="relative h-full">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-auto object-cover "
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{item.likes_count}</span>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{item.comments_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </div>
      
      {/* Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2  hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-2 sm:p-4 rounded-lg">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              </div>
              
              <div className="w-full md:w-1/2 p-4 sm:p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedImage.title}</h2>
                <p className="text-gray-600 mb-4">Uploaded by: {selectedImage.user_email || 'Unknown User'}</p>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {likesEnabled && (
                    <button 
                      onClick={() => toggleLike(selectedImage.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedImage.user_liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'} hover:opacity-90`}
                    >
                      <Heart className={`w-5 h-5 ${selectedImage.user_liked ? 'fill-current' : ''}`} />
                      <span>{selectedImage.likes_count} {selectedImage.likes_count === 1 ? 'Like' : 'Likes'}</span>
                    </button>
                  )}
                  
                  <div className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 rounded-full">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">{selectedImage.comments_count} {selectedImage.comments_count === 1 ? 'Comment' : 'Comments'}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/download/${selectedImage.id}`)}
                    className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-xs sm:text-sm">Download</span>
                  </button>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Comments</h3>
                  <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 overflow-y-auto pr-1 sm:pr-2">
                    {selectedImage.interactions
                      .filter(interaction => interaction.comment && interaction.comment.trim() !== "")
                      .map((interaction, index) => (
                        <div key={index} className="bg-gray-100 p-2 sm:p-3 rounded-lg text-sm">
                          <p className="font-medium text-xs sm:text-sm">{interaction.user_id === selectedImage.user_id ? 'Uploader' : 'User'}:</p>
                          <p className="text-gray-700 text-xs sm:text-sm">{interaction.comment}</p>
                        </div>
                      ))
                    }
                    {selectedImage.interactions.filter(interaction => interaction.comment && interaction.comment.trim() !== "").length === 0 && (
                      <p className="text-gray-500 italic text-sm">No comments yet</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Add Comment</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          if (target.value.trim()) {
                            addComment(selectedImage.id, target.value);
                            target.value = '';
                          }
                        }
                      }}
                    />
                    <button 
                      className="bg-sky-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-sky-600 text-sm mt-2 sm:mt-0"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input.value.trim()) {
                          addComment(selectedImage.id, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <span className="hidden sm:inline">Post</span><span className="sm:hidden">Go</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}