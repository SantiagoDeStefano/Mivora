import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-1 border-t border-gray-800 bg-gray-950 py-5 text-center text-gray-400">
    <p>© {year} Mivora. All rights reserved.</p>
</footer>
  );  
}