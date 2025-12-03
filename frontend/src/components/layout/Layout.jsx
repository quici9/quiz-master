import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="glass mt-auto border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-white/60">
          © {new Date().getFullYear()} QuizMaster. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
