import { LogOut, UserIcon, Home, Upload, User, Info, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { LayoutProps } from "../types";
import { supabase } from "../supabase/supabase";
import { useGallery } from "../context/GalleryContext";
import ImageUploadForm from "./ImageUploadForm";
import { useState } from "react";


export default function Navigation({ user }: LayoutProps) {
  const { state, dispatch, uploadImage } = useGallery();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error loggin out:", error);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
  }

  const handleProfileClick = () => {
    navigate('/'); // Navigate to GalleryPage
    setMobileMenuOpen(false);
  };

  const handleUploadClick = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setMobileMenuOpen(false);
  };

  const handleAboutClick = () => {
    navigate('/about');
    setMobileMenuOpen(false);
  };

  const handleGalleryClick = () => {
    navigate('/home');
    setMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/home');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
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

  return (
    <nav className = {`
    w-full
    bg-sky-600 text-white
    border-b border-sky-700
  `}
  >
    
    <div className="p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex justify-between items-center">
          <Link to="/home" onClick={(e) => { e.preventDefault(); handleHomeClick(); }} className="font-black text-lg md:text-xl tracking-wide cursor-pointer">
            MinnieGallery
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile menu - only visible when mobileMenuOpen is true */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-sky-700 rounded-lg p-4 flex flex-col gap-2">
            <form className="mb-3">
              <input
                type="search"
                placeholder="Search"
                value={state.searchQuery}
                onChange={handleSearch}
                className="
                  bg-white/10
                  border border-white/30
                  text-white placeholder-white/70
                  text-sm
                  rounded-lg
                  px-3 py-2
                  w-full
                  outline-none
                  transition-all

                  focus:border-white
                  focus:ring-2 focus:ring-white/70
                "
              />
            </form>
            
            <button
              onClick={handleProfileClick}
              title="Profile"
              className="
                flex items-center justify-between gap-2
                border border-white/40
                px-3 py-2
                rounded-md
                text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                w-full
              "
            >
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>Profile</span>
              </div>
            </button>
            
            <button
              onClick={handleGalleryClick}
              title="Gallery"
              className="
                flex items-center justify-between gap-2
                border border-white/40
                px-3 py-2
                rounded-md
                text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                w-full
              "
            >
              <div className="flex items-center gap-2">
                <Home size={14} />
                <span>Home</span>
              </div>
            </button>
            
            <button
              onClick={handleUploadClick}
              title="Upload"
              className="
                flex items-center justify-between gap-2
                border border-white/40
                px-3 py-2
                rounded-md
                text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                w-full
              "
            >
              <div className="flex items-center gap-2">
                <Upload size={14} />
                <span>Upload</span>
              </div>
            </button>
            
            <button
              onClick={handleAboutClick}
              title="About"
              className="
                flex items-center justify-between gap-2
                border border-white/40
                px-3 py-2
                rounded-md
                text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                w-full
              "
            >
              <div className="flex items-center gap-2">
                <Info size={14} />
                <span>About</span>
              </div>
            </button>
            
            <div className="flex items-center justify-between gap-2 border border-white/40 px-3 py-2 rounded-md text-sm">
              <div className="flex items-center gap-2">
                <UserIcon size={14} />
                <span className="truncate max-w-[100px]">{user.email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="
                flex items-center justify-between gap-2
                border border-white/40
                px-3 py-2
                rounded-md
                text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                w-full
              "
            >
              <div className="flex items-center gap-2">
                <LogOut size={14} />
                <span>Logout</span>
              </div>
            </button>
          </div>
        )}

        {/* Desktop navigation - hidden on small screens */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <form className="w-full md:w-auto">
            <input
              type="search"
              placeholder="Search"
              value={state.searchQuery}
              onChange={handleSearch}
              className="
                bg-white/10
                border border-white/30
                text-white placeholder-white/70
                text-xs md:text-sm
                rounded-lg
                px-2 py-1 md:px-3 md:py-2
                w-full
                outline-none
                transition-all

                focus:border-white
                focus:ring-2 focus:ring-white/70
              "
            />
          </form>

          <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
            <button
              onClick={handleProfileClick}
              title="Profile"
              className="
                flex items-center gap-1 md:gap-2
                border border-white/40
                px-2 py-1 md:px-3 md:py-1.5
                rounded-md
                text-xs md:text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                whitespace-nowrap
              "
            >
              <User size={10} className="md:size-4" />
              <span className="hidden md:inline">Profile</span>
              <span className="md:hidden">Prof</span>
            </button>
            
            <button
              onClick={handleGalleryClick}
              title="Gallery"
              className="
                flex items-center gap-1 md:gap-2
                border border-white/40
                px-2 py-1 md:px-3 md:py-1.5
                rounded-md
                text-xs md:text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                whitespace-nowrap
              "
            >
              <Home size={10} className="md:size-4" />
              <span className="hidden md:inline">Home</span>
              <span className="md:hidden">Hm</span>
            </button>
            
            <button
              onClick={handleUploadClick}
              title="Upload"
              className="
                flex items-center gap-1 md:gap-2
                border border-white/40
                px-2 py-1 md:px-3 md:py-1.5
                rounded-md
                text-xs md:text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                whitespace-nowrap
              "
            >
              <Upload size={10} className="md:size-4" />
              <span className="hidden md:inline">Upload</span>
              <span className="md:hidden">Up</span>
            </button>
            
            <button
              onClick={handleAboutClick}
              title="About"
              className="
                flex items-center gap-1 md:gap-2
                border border-white/40
                px-2 py-1 md:px-3 md:py-1.5
                rounded-md
                text-xs md:text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                whitespace-nowrap
              "
            >
              <Info size={10} className="md:size-4" />
              <span className="hidden md:inline">About</span>
              <span className="md:hidden">Ab</span>
            </button>
            
            <div className="hidden md:flex items-center gap-2 border border-white/40 px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm">
              <UserIcon size={10} className="md:size-4" />
              <span className="truncate max-w-[80px] md:max-w-[150px]">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="
                flex items-center gap-1 md:gap-2
                border border-white/40
                px-2 py-1 md:px-3 md:py-1.5
                rounded-md
                text-xs md:text-sm
                transition-all
                hover:bg-white hover:text-sky-700
                whitespace-nowrap
              "
            >
              <LogOut size={10} className="md:size-4" />
              <span className="hidden md:inline">Logout</span>
              <span className="md:hidden">Out</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Upload Form Modal - reuse the existing form from state */}
      {state.imageUploadFormVisible && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => dispatch({ type: "TOGGLE_FORM" })}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white text-sky-600 rounded-lg shadow-xl w-full max-w-2xl p-6 relative flex flex-col items-center">
              <button
                onClick={() => dispatch({ type: "TOGGLE_FORM" })}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
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
  </nav>
  );
}