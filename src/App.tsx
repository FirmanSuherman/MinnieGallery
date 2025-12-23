import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DownloadPage from "./pages/DownloadPage";
import NotFoundPage from "./pages/NotFoundPage";
import { GalleryProvider } from "./context/GalleryContext";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabase";
import type { User } from "@supabase/supabase-js";
import Auth from "./components/Auth";

function Footer() {
  return (
    <footer className="
      w-full
      bg-sky-600
      text-white
      flex items-center justify-center
      py-3
      text-xs sm:text-sm
  ">
      <span className="text-center">© {new Date().getFullYear()} MinnieGallery. All Rights Reserved.
      </span>
  </footer>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Step 1; Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Step 2: Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <p className="tex-sky-500 text-xl">Loading ...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col">
        <div className="flex-grow">
          <Auth />
        </div>
      </div>
    );
  }

  const routes = [
    {
      path: "/",
      element: <Layout user={user} />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          element: <GalleryPage />,
        },
        {
          path: "home",
          element: <HomePage />,
        },
        {
          path: "about",
          element: <AboutPage />,
        },
        {
          path: "download/:imageId",
          element: <DownloadPage />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    <GalleryProvider>
      <div className="flex flex-col min-h-screen">
        <RouterProvider router={router} />
        <Footer />
      </div>
    </GalleryProvider>
  );
}