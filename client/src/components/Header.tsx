import { FC } from "react";

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="relative z-10 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.425 7.573C18.21 5.516 15.962 4 13.243 4 9.066 4 5.5 7.477 5.5 12s3.566 8 7.743 8c2.719 0 4.967-1.516 6.182-3.573"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 12h-9m9 0l-3-3m3 3l-3 3"
            />
          </svg>
        </div>
        <h1 className="ml-3 text-xl font-medium">Breathe</h1>
      </div>

      <button
        onClick={onSettingsClick}
        className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-slate-700/80 transition-colors"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </header>
  );
};

export default Header;
