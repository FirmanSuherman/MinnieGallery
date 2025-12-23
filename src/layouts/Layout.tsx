import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import type { LayoutProps } from "../types";

export default function Layout({ user }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation user={user} />

      <main className="flex-1 bg-white text-sky-500">
        <Outlet />
      </main>
    </div>
  );
}
