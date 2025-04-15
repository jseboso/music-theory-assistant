import { MusicIcon } from '../ui/Icons';

export function AppFooter() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <MusicIcon className="h-6 w-6" />
          <h3 className="text-lg font-bold">Music Theory Assistant</h3>
        </div>
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Music Theory Assistant. All rights reserved.</p>
      </div>
    </footer>
  );
}