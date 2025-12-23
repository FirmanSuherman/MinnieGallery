import { Heart, Image, Users, Star } from "lucide-react";
import Navigation from "../components/Navigation";
import type { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";

export default function AboutPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getCurrentUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto container mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <div className="max-w-full sm:max-w-4xl mx-auto">
            <header className="text-center mb-8 sm:mb-12 md:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-sky-600 mb-4 sm:mb-6">About MinnieGallery</h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-full sm:max-w-2xs mx-auto">
                A beautiful and intuitive photo sharing platform where memories come to life
              </p>
            </header>

            <section className="mb-16">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <Image className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" />
                  Our Story
                </h2>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-2 sm:mb-4">
                  MinnieGallery was born from a simple idea: to create a platform where people can easily share and 
                  discover beautiful moments from around the world. Our journey began with a passion for photography 
                  and a desire to build a community that celebrates visual storytelling.
                </p>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Today, we continue to empower creators and enthusiasts to share their perspectives, connect with 
                  others, and preserve memories that matter most.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-sky-100 p-2 sm:p-3 rounded-full">
                      <Heart className="text-sky-600 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    To provide a seamless and inspiring platform for people to share their visual stories, 
                    connect with a global community of photographers and art lovers, and preserve memories 
                    that matter most to them.
                  </p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-sky-100 p-2 sm:p-3 rounded-full">
                      <Star className="text-sky-600 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    To become the premier destination for visual storytelling, where creativity flourishes, 
                    communities thrive, and every image tells a unique story worth sharing.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Why Choose MinnieGallery?</h2>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-sky-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="text-sky-600 w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 sm:mb-3">Community Focused</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Connect with photographers and art enthusiasts from around the world. Share, discover, and be inspired.
                  </p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-sky-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Image className="text-sky-600 w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 sm:mb-3">Beautiful Interface</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Intuitive design that puts your photos first. Experience your gallery in a clean, distraction-free environment.
                  </p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-sky-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Heart className="text-sky-600 w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 sm:mb-3">Engagement Tools</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Like, comment, and share photos. Build meaningful connections through visual storytelling.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Join Our Community</h2>
                <p className="text-base sm:text-lg mb-4 sm:mb-6 max-w-full sm:max-w-2xs">
                  Whether you're a professional photographer, an amateur enthusiast, or simply someone who 
                  appreciates beautiful imagery, MinnieGallery is the place for you. Share your vision, 
                  discover new perspectives, and become part of a growing community of visual storytellers.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <div className="bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm">
                    <span className="font-semibold">10K+</span> Active Users
                  </div>
                  <div className="bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm">
                    <span className="font-semibold">50K+</span> Photos Shared
                  </div>
                  <div className="bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm">
                    <span className="font-semibold">100+</span> Countries
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Technology Stack</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                  MinnieGallery is built using modern web technologies to ensure a fast, secure, and 
                  responsive experience across all devices.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="font-bold text-sky-600 text-sm sm:text-base mb-1 sm:mb-2">React</div>
                    <p className="text-xs sm:text-sm text-gray-600">Frontend Library</p>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="font-bold text-sky-600 text-sm sm:text-base mb-1 sm:mb-2">TypeScript</div>
                    <p className="text-xs sm:text-sm text-gray-600">Type Safety</p>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="font-bold text-sky-600 text-sm sm:text-base mb-1 sm:mb-2">Supabase</div>
                    <p className="text-xs sm:text-sm text-gray-600">Backend Services</p>
                  </div>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="font-bold text-sky-600 text-sm sm:text-base mb-1 sm:mb-2">Tailwind CSS</div>
                    <p className="text-xs sm:text-sm text-gray-600">Styling Framework</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}