import { useEffect } from "react";
import ImageUploadForm from "../components/ImageUploadForm";
import { Plus, Trash2, X } from "lucide-react";
import { useGallery } from "../context/GalleryContext";
import { useRef, useState } from "react";
import { CommentBox } from "../components/LikeButton";
import { supabase } from "../supabase/supabase";

import type { ExtendedGalleryItem } from "../types";

export default function GalleryPage() {
  const [activePhoto, setActivePhoto] = useState<ExtendedGalleryItem | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Get current user ID for filtering comments
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    
    getCurrentUser();
  }, []);
  
  const { state, dispatch, uploadImage, deleteImage, filteredItems, addComment, fetchUserImages } = // Removed unused toggleLike
    useGallery();
  
  // Ensure we always fetch only the current user's images when GalleryPage mounts
  useEffect(() => {
    fetchUserImages();
  }, [fetchUserImages]);
    
  useEffect(() => {
    if (!filteredItems.length) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (index >= 0 && index < filteredItems.length) {
              setActivePhoto(filteredItems[index]);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );
  
    // Clean up previous observers
    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
  
    return () => {
      observer.disconnect();
      // Cancel any pending observations
      if (itemRefs.current) {
        itemRefs.current.forEach((el) => {
          if (el) observer.unobserve(el);
        });
      }
    };
  }, [filteredItems]);
  

  // Removed unused count variable
  // const count = useMemo(() => {
  //   const itemCount = state.searchQuery
  //     ? filteredItems.length
  //     : state.items.length;
  //
  //   const totalCount = state.items.length;
  //
  //   if (state.searchQuery) {
  //     return `${itemCount} of ${totalCount} Image${
  //       itemCount !== 1 ? "s" : ""
  //     } Found`;
  //   }
  //
  //   return `${totalCount} Image${totalCount !== 1 ? "s" : ""} Uploaded`;
  // }, [state.items.length, filteredItems.length, state.searchQuery]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "file" && e.target.files?.[0]) {
      dispatch({
        type: "UPDATE_INPUTS",
        payload: {
          file: e.target.files[0],
          path: URL.createObjectURL(e.target.files[0]),
        },
      });
    } else {
      dispatch({
        type: "UPDATE_INPUTS",
        payload: { title: e.target.value },
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await uploadImage();
  }

  async function handleDelete(id: number, imageUrl: string) {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteImage(id, imageUrl);
    }
  }

  return (
    <div className="flex flex-col min-h-screen mt-2">
      <div className="flex-1 flex flex-col md:flex-row h-screen">
        <aside className="w-full md:w-1/2 bg-white text-sky-600 flex flex-col md:overflow-y-auto">
          {activePhoto ? (
            <div className="w-full space-y-4 flex flex-col p-4">
              {/* First row: Uploader email + Like icon */}
              <div className="bg-sky-600/20 p-3 sm:p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h2><strong>Username</strong></h2>
                  <p className="opacity-90 break-words flex-1">{activePhoto.user_id || 'Unknown User'}</p>
                </div>
              </div>
                    
              {/* Second row: Image name */}
              <div className="bg-sky-600/20 p-3 sm:p-4 rounded-lg">
                  <h2 className="text-sm sm:text-base"><strong>Caption</strong></h2>
                <h2 className="text-base sm:text-lg break-words">{activePhoto.title}</h2>
              </div>
                    
              {/* Third row: Comment input */}
              <div className="bg-sky-600/20 p-3 sm:p-4 rounded-lg">
                <h2 className="text-sm sm:text-base"><strong>Comment</strong></h2>
                <CommentBox 
                  imageId={activePhoto.id} 
                  onAddComment={addComment} 
                />
              </div>
                    
              {/* Fourth row: All comments for the active image */}
              <div className="bg-sky-600/20 p-3 sm:p-4 rounded-lg flex-1 min-h-0">
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  All Comments ({activePhoto.comments_count})
                </h3>
                <div className="space-y-1 sm:space-y-2 overflow-y-auto flex-1 max-h-40 sm:max-h-60 pr-1 sm:pr-2">
                  {activePhoto.interactions
                    .filter(interaction => {
                      // Show all comments for this image
                      return interaction.comment && 
                             interaction.comment.trim() !== "";
                    })
                    .map((interaction, index) => (
                      <div key={index} className="bg-white/30 p-2 rounded text-xs sm:text-sm">
                        <div className="flex flex-wrap justify-between">
                          <span className="font-medium text-xs sm:text-sm break-all">{interaction.user_id === currentUserId ? 'You' : `User---${interaction.user_id}`}</span>
                        </div>
                        <p className="text-xs sm:text-sm mt-1">{interaction.comment}</p>
                      </div>
                    ))
                  }
                  {activePhoto.interactions.filter(interaction => {
                    return interaction.comment && 
                           interaction.comment.trim() !== "";
                  }).length === 0 && (
                    <p className="text-xs sm:text-sm opacity-75">No comments yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <p>No image selected</p>
            </div>
          )}
        </aside>

        <main className="w-full md:w-1/2 bg-zinc-50 relative flex flex-col mt-4">
          <div className="flex-1 overflow-y-auto">
            <div className="h-[50vh] sm:h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory rounded-lg ">
              {filteredItems.map((photo,index) => (
                <figure
                  key={photo.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="h-[50vh] sm:h-[calc(100vh-80px)] snap-start relative group"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="
                      absolute inset-0
                      bg-black/50
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity duration-300
                      flex items-center justify-center
                      pointer-events-none
                    "
                  >
                    <button
                      onClick={() => handleDelete(photo.id, photo.image_url)}
                      className="
                        pointer-events-auto
                        bg-sky-500 text-white
                        p-2 sm:p-3 rounded-full
                        hover:bg-sky-600
                        z-10
                      "
                    >
                      <Trash2 />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-xs sm:text-sm">{photo.title}</p>
                  </div>
                </figure>
              ))}
            </div>
          </div>
          
          <div className="p-4 flex justify-end">
            <button
              onClick={() => dispatch({ type: "TOGGLE_FORM" })}
              className="bg-sky-500 text-zinc-900 rounded-sm px-4 py-3 cursor-pointer flex gap-2 font-bold fixed bottom-15 right-6 z-100 hover:shadow-lg hover:shadow-blue-500/50">
              {state.imageUploadFormVisible ? <><X /> Close Form</> : <><Plus /> UPLOAD IMAGE</>}
            </button>
          </div>
          
          {state.imageUploadFormVisible && (
            <>
              <div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => dispatch({ type: "TOGGLE_FORM" })}
              />

              <div className="fixed inset-0 z-50 flex items-center justify-center ">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-15 relative flex flex-col items-center pb-20">
                  
                  <ImageUploadForm
                    isVisible={state.imageUploadFormVisible}
                    inputs={state.inputs}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
