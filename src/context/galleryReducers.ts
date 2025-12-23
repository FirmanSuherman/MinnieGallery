import type { Action, State } from "../types";

export function galleryReducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_FORM":
      return {
        ...state,
        imageUploadFormVisible: !state.imageUploadFormVisible,
        inputs: state.imageUploadFormVisible
          ? { title: null, file: null, path: null }
          : state.inputs,
      };

    case "ADD_ITEM":
      return {
        ...state,
        items: [action.payload, ...state.items],
        imageUploadFormVisible: false,
        inputs: {
          title: null,
          file: null,
          path: null,
        },
      };

    case "UPDATE_INPUTS":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ...action.payload,
        },
      };

    case "RESET_INPUTS":
      return {
        ...state,
        inputs: {
          title: null,
          file: null,
          path: null,
        },
      };

    case "SET_ITEMS":
      return {
        ...state,
        items: action.payload,
      };

    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };

    case "TOGGLE_LIKE":
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.imageId) {
            const userLiked = item.user_liked;
            return {
              ...item,
              user_liked: !userLiked,
              likes_count: userLiked ? item.likes_count - 1 : item.likes_count + 1,
            };
          }
          return item;
        }),
      };

    case "ADD_COMMENT":
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.imageId) {
            return {
              ...item,
              comments_count: item.comments_count + 1,
            };
          }
          return item;
        }),
      };

    case "UPDATE_LIKES_COUNT":
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.imageId) {
            return {
              ...item,
              likes_count: action.payload.likesCount,
            };
          }
          return item;
        }),
      };

    case "UPDATE_COMMENTS_COUNT":
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.imageId) {
            return {
              ...item,
              comments_count: action.payload.commentsCount,
            };
          }
          return item;
        }),
      };

    default:
      return state;
  }
}
