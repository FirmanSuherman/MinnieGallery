import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGallery } from "../context/GalleryContext";
import type { ExtendedGalleryItem } from "../types";
import { Heart, MessageCircle, Download } from "lucide-react";
import { supabase } from "../supabase/supabase";

export default function DownloadPage() {
  const { imageId } = useParams<{ imageId: string }>();
  const { filteredItems, toggleLike } = useGallery();
  // const { filteredItems, toggleLike, addComment } = useGallery(); // addComment not used in this component
  const [selectedImage, setSelectedImage] = useState<ExtendedGalleryItem | null>(null);
  // const [user, setUser] = useState<User | null>(null); // Not used in this component

  useEffect(() => {
    // Find the specific image based on the URL parameter
    if (imageId) {
      const image = filteredItems.find(item => item.id === Number(imageId));
      if (image) {
        setSelectedImage(image);
      }
    }
  }, [imageId, filteredItems]);

  const handleDownload = async () => {
    if (!selectedImage) return;

    try {
      // Extract file name from the image URL
      const fileName = selectedImage.image_url.split('/').pop();
      if (!fileName) {
        console.error("Could not extract file name from URL");
        return;
      }

      // Download the image from Supabase storage
      const { data, error } = await supabase
        .storage
        .from('gallery-images-2')
        .download(fileName);

      if (error) {
        console.error("Error downloading image:", error);
        return;
      }

      // Create a temporary URL and trigger download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  if (!selectedImage) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        {/* <Navigation user={user} /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Image not found</p>
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Left side: Image display */}
          <div className="md:w-1/2 flex items-center justify-center bg-gray-100 rounded-xl p-2 sm:p-4">
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="max-h-[50vh] sm:max-h-[70vh] object-contain rounded-lg"
            />
          </div>

          {/* Right side: Image information and download button */}
          <div className="md:w-1/2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">{selectedImage.title}</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Uploaded by: {selectedImage.user_email || 'Unknown User'}</p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <button 
                onClick={() => toggleLike(selectedImage.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm ${selectedImage.user_liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'} hover:opacity-90`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedImage.user_liked ? 'fill-current' : ''}`} />
                <span className="text-xs sm:text-sm">{selectedImage.likes_count} {selectedImage.likes_count === 1 ? 'Like' : 'Likes'}</span>
              </button>
              
              <div className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 rounded-full text-sm">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{selectedImage.comments_count} {selectedImage.comments_count === 1 ? 'Comment' : 'Comments'}</span>
              </div>
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8">
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

            {/* Download button */}
            <div className="pt-4">
              <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-sky-500 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-sky-600 transition-colors text-base sm:text-lg font-semibold shadow-md"
              >
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Download Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col">
        {/* <Navigation user={user} /> */}
        {content}
      </div>
      <footer className="bg-sky-600 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} MinnieGallery. All rights reserved.</p>
          <p className="mt-2 text-sky-200">Preserving moments, sharing stories</p>
        </div>
      </footer>
    </div>
  );
}