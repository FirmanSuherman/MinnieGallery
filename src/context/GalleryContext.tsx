import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type {
  GalleryContextType,
  GalleryItem,
  ExtendedGalleryItem,
  GalleryProviderProps,
  State,
  Interaction,
} from "../types";
import { galleryReducer } from "./galleryReducers";
import { supabase } from "../supabase/supabase";

const GalleryContext = createContext<GalleryContextType | null>(null);

const initialState: State = {
  items: [],
  imageUploadFormVisible: false,
  inputs: {
    title: null,
    file: null,
    path: null,
  },
  searchQuery: "",
};

export function GalleryProvider({ children }: GalleryProviderProps) {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  const filteredItems = useMemo(() => {
    if (!state.searchQuery) {
      return state.items;
    }

    return state.items.filter((item) =>
      item.title.toLowerCase().includes(state.searchQuery.toLowerCase().trim())
    );
  }, [state.items, state.searchQuery]);

  useEffect(() => {
    fetchImages(false); // Fetch only user's images by default
  }, []);

  async function fetchImages(fetchAll: boolean = false) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query;
    if (fetchAll) {
      // Fetch all images for homepage
      query = supabase
        .from("images-db")
        .select("*")
        .order("created_at", { ascending: false });
    } else {
      // Fetch only images uploaded by the current user for gallery page
      query = supabase
        .from("images-db")
        .select("*")
        .eq("user_id", user?.id || '')
        .order("created_at", { ascending: false });
    }
    
    const { data: imagesData, error: imagesError } = await query;
    
    if (imagesError) {
      console.error("Error fetching images", imagesError);
      return;
    }

    if (imagesData && imagesData.length > 0) {
      // Fetch interactions based on the images we're fetching
      let interactionsData, interactionsError;
      if (fetchAll) {
        // If fetching all images, get all interactions
        ({ data: interactionsData, error: interactionsError } = await supabase
          .from("interaction")
          .select("*"));
      } else {
        // If fetching user's images only, get interactions for those images
        const imageIds = imagesData.map(image => image.id);
        ({ data: interactionsData, error: interactionsError } = await supabase
          .from("interaction")
          .select("*")
          .in("image_id", imageIds));
      }
      
      if (interactionsError) {
        console.error("Error fetching interactions", interactionsError);
      }
      
      const interactions = interactionsData || [];
      
      // Process each image with its interactions
      const extendedGalleryItems: ExtendedGalleryItem[] = await Promise.all(imagesData.map(async (photo) => {
        // Filter interactions for this specific image
        const imageInteractions = interactions.filter((interaction: Interaction) => interaction.image_id === photo.id);
        
        // Calculate likes count
        const likesCount = imageInteractions.filter((interaction: Interaction) => interaction.like).length;
        
        // Calculate comments count
        const commentsCount = imageInteractions.filter((interaction: Interaction) => interaction.comment && interaction.comment.trim() !== "").length;
        
        // Check if current user liked this image
        const userLiked = user ? imageInteractions.some(
          (interaction: Interaction) => interaction.user_id === user.id && interaction.like
        ) : false;
        
        // Get user info for the image uploader
        let userEmail = 'User';
        if (photo.user_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users') // Assuming you have a users table
              .select('email')
              .eq('id', photo.user_id)
              .single();
              
            if (!userError && userData) {
              userEmail = userData.email || 'User';
            }
          } catch (error: any) {
            console.error('Error fetching user info:', error);
            // Check if it's a 'Row not found' error which is common for deleted users
            if (error.code === 'PGRST116' || error.message?.includes('Row not found')) {
              userEmail = 'Deleted User';
            } else {
              userEmail = 'User';
            }
          }
        }
        
        return {
          id: photo.id,
          image_url: photo.image_url,
          title: photo.title,
          likes_count: likesCount,
          comments_count: commentsCount,
          user_liked: userLiked,
          interactions: imageInteractions,
          user_email: userEmail,
          user_id: photo.user_id,
        };
      }));

      dispatch({
        type: "SET_ITEMS",
        payload: extendedGalleryItems,
      });
    }

    console.log("Fetched Images with Interactions:", imagesData);
  }

  async function uploadImage() {
    const { inputs } = state;

    if (!inputs.file || !inputs.title) {
      console.log("Missing file or title");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return;
    }

    // Step 1: Upload image file to Supabase Storage
    const fileName = `${Date.now()}-${inputs.file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery-images-2")
      .upload(fileName, inputs.file);

    if (uploadError) {
      console.error("Error uploading images", uploadError);
      return;
    }

    // Step 2: Get Public URL - Table
    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery-images-2").getPublicUrl(fileName);

    // Step 3: Store Metadata to Table - DB
    const { data, error } = await supabase
      .from("images-db")
      .insert([
        {
          title: inputs.title,
          image_url: publicUrl,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving to database", error);
      return;
    }

    if (data) {
      const newItem: GalleryItem = {
        id: data.id,
        image_url: data.image_url,
        title: data.title,
      };

      // Step 4: Update local state
      dispatch({
        type: "ADD_ITEM",
        payload: newItem,
      });
    }

    console.log("Successfully uploaded:", data);
  }

  async function deleteImage(id: number, imageUrl: string) {
    // Step 1: Extracting file name
    const fileName = imageUrl.split("gallery-images-2/").pop();

    if (!fileName) {
      console.error("could not extract fielname from url");
      return;
    }

    // Step 2: deleting from storage
    const { error: storageError } = await supabase.storage
      .from("gallery-images-2")
      .remove([fileName]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
    }

    // Step 3: Deleting from db
    const { error: dbError } = await supabase
      .from("images-db")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Error deleting from db:", dbError);
      return;
    }

    // Step 4: Update local state
    dispatch({
      type: "DELETE_ITEM",
      payload: id,
    });
  }

  async function toggleLike(imageId: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return;
    }

    // Check if user already liked this image
    const { data: existingLike, error: likeError } = await supabase
      .from("interaction")
      .select("*")
      .eq("user_id", user.id)
      .eq("image_id", imageId)
      .eq("like", true)
      .single();

    if (likeError && likeError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Error checking existing like", likeError);
      return;
    }

    if (existingLike) {
      // Unlike: delete the existing like
      const { error: deleteError } = await supabase
        .from("interaction")
        .delete()
        .eq("user_id", user.id)
        .eq("image_id", imageId)
        .eq("like", true);

      if (deleteError) {
        console.error("Error removing like", deleteError);
        return;
      }

      dispatch({
        type: "TOGGLE_LIKE",
        payload: { imageId, userId: user.id },
      });
    } else {
      // Like: insert a new like
      const { error: insertError } = await supabase
        .from("interaction")
        .insert([
          {
            user_id: user.id,
            image_id: imageId,
            like: true,
            comment: null,
          },
        ]);

      if (insertError) {
        console.error("Error adding like", insertError);
        return;
      }

      dispatch({
        type: "TOGGLE_LIKE",
        payload: { imageId, userId: user.id },
      });
    }
  }

  async function addComment(imageId: number, comment: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return;
    }

    if (!comment.trim()) {
      console.error("Comment cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("interaction")
      .insert([
        {
          user_id: user.id,
          image_id: imageId,
          like: false,
          comment: comment,
        },
      ]);

    if (error) {
      console.error("Error adding comment", error);
      return;
    }

    dispatch({
      type: "ADD_COMMENT",
      payload: { imageId, comment, userId: user.id },
    });
  }

  async function fetchInteractions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return;
    }

    const { data, error } = await supabase
      .from("interaction")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching interactions", error);
      return;
    }

    console.log("Fetched interactions:", data);
  }

  async function fetchAllImages() {
    // Fetch all images for homepage
    await fetchImages(true);
  }
  
  async function fetchUserImages() {
    // Fetch only images uploaded by the current user
    await fetchImages(false);
  }

  return (
    <GalleryContext.Provider
      value={{ state, dispatch, uploadImage, deleteImage, filteredItems, toggleLike, addComment, fetchInteractions, fetchAllImages, fetchUserImages }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGallery() {
  const context = useContext(GalleryContext);

  if (!context) {
    throw new Error("useGallery must be used within GalleryProvider");
  }

  return context;
}
