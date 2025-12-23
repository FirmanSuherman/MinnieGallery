import type { User } from "@supabase/supabase-js";

export interface GalleryItem {
  id: number;
  image_url: string;
  title: string;
}

export interface Interaction {
  id: number;
  user_id: string;
  image_id: number;
  like: boolean;
  comment: string | null;
  created_at: string;
}

export interface ExtendedGalleryItem extends GalleryItem {
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  interactions: Interaction[];
  user_email?: string;
  user_id?: string;
}

export interface Inputs {
  title: string | null;
  file: File | null;
  path: string | null;
}

export interface ImageUplaodFormProps {
  isVisible: boolean;
  inputs: Inputs;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface State {
  items: ExtendedGalleryItem[];
  imageUploadFormVisible: boolean;
  inputs: Inputs;
  searchQuery: string;
}

export type Action =
  | { type: "ADD_ITEM"; payload: ExtendedGalleryItem }
  | { type: "TOGGLE_FORM" }
  | { type: "UPDATE_INPUTS"; payload: Partial<Inputs> }
  | { type: "RESET_INPUTS" }
  | { type: "SET_ITEMS"; payload: ExtendedGalleryItem[] }
  | { type: "DELETE_ITEM"; payload: number }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_LIKE"; payload: { imageId: number; userId: string } }
  | { type: "ADD_COMMENT"; payload: { imageId: number; comment: string; userId: string } }
  | { type: "UPDATE_LIKES_COUNT"; payload: { imageId: number; likesCount: number } }
  | { type: "UPDATE_COMMENTS_COUNT"; payload: { imageId: number; commentsCount: number } };

export interface GalleryContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  uploadImage: () => Promise<void>;
  deleteImage: (id: number, imageUrl: string) => Promise<void>;
  filteredItems: ExtendedGalleryItem[];
  toggleLike: (imageId: number) => Promise<void>;
  addComment: (imageId: number, comment: string) => Promise<void>;
  fetchInteractions: () => Promise<void>;
  fetchAllImages: () => Promise<void>;
  fetchUserImages: () => Promise<void>;
}

export interface GalleryProviderProps {
  children: React.ReactNode;
}

export interface LayoutProps {
  user: User;
}
