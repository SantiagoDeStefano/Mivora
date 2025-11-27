import React, { useState, useRef, useEffect } from "react";
import searchIcon from "../../assets/search.svg";

export default function SearchButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input khi mở
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div
      className={`relative flex items-center transition-all duration-300 ${open ? "w-64" : "w-10"} ${className}`}
    >
      {/* Button container */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`absolute left-0 flex items-center justify-center h-10 w-10 rounded-full transition bg-gray-950`}
      >
        <img
          src={searchIcon}
          alt="Search"
          className="h-5 w-5 select-none filter invert"
          loading="lazy"
          decoding="async"
        />
      </button>

      {/* Input sliding */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search... "
        className={`rounded-full pl-10 pr-4 py-2 text-sm shadow-sm outline-none transition-all duration-300 border ${open ? 'bg-white text-gray-900 border-slate-300 opacity-100 w-full' : 'bg-transparent border-slate-200 opacity-0 w-0 pointer-events-none'}`}
      />
    </div>
  );
}
