import { useState } from "react";
import { supabase } from "../supabase/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Logged in:", data.user);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      console.log("Signed up:", data.user);
      alert("Check your email for verification!");
    }

    setLoading(false);
  }

  function handleToggle() {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
  }

  return (
    <div className="bg-white flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img src="../public/assets/bg-img.png" alt="Background" className="object-cover w-full h-full"/>
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <div className="bg-white p-8 rounded-lg w-full max-w-md mt-12">
          <h2 className="text-2xl font-bold text-sky-500 mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="
              bg-neutral-secondary-medium
              border border-default-medium
              text-heading text-sm
              rounded-lg
              block w-full px-2.5 py-2 shadow-xs
              focus:outline-none
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500
              "
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              minLength={6}
              className="
              
              bg-neutral-secondary-medium
              border border-default-medium
              text-heading text-sm
              rounded-lg
              block w-full px-2.5 py-2 shadow-xs
              focus:outline-none
              focus:border-sky-500
              focus:ring-2 focus:ring-sky-500
              "
            />
            <button
              type="submit"
              disabled={loading}
              className="
              bg-sky-600 text-white
              px-6 py-2.5
              rounded-lg
              font-medium
              transition-all duration-300
              hover:bg-sky-700
              hover:shadow-lg hover:shadow-blue-500/50
              focus:outline-none
              "
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="text-sky-500 text-center mt-4">
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
            <button
              onClick={handleToggle}
              className="underline hover:text-sky-400 cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
