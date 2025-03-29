import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/app-context";

interface LanguageDropdownProps {
  open: boolean;
}

export function LanguageDropdown({ open }: LanguageDropdownProps) {
  const { t } = useTranslation();
  const { changeLanguage } = useApp();

  if (!open) return null;

  return (
    <div className="absolute right-24 md:right-12 top-14 bg-white rounded-md shadow-lg py-1 z-50 w-40">
      <button
        onClick={() => changeLanguage("id")}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <span className="inline-block w-5 h-5 rounded-sm bg-red-500 mr-2 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
            <rect width="3" height="1" fill="#fff"/>
            <rect y="1" width="3" height="1" fill="#f00"/>
          </svg>
        </span>
        <span>Indonesia (ID)</span>
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <span className="inline-block w-5 h-5 rounded-sm mr-2 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
            <clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath>
            <clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
            <g clipPath="url(#a)">
              <path d="M0 0v30h60V0z" fill="#012169"/>
              <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
              <path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4"/>
              <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
              <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
            </g>
          </svg>
        </span>
        <span>English (EN)</span>
      </button>
    </div>
  );
}
