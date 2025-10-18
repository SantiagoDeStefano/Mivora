import React from "react";
import Container from "../Container/Container";
import { LogoMark } from "../../constants/brandLogo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-gray-800 bg-gray-950 py-10 text-center text-gray-400">
  <Container>
    <LogoMark className="mx-auto mb-4" />
    <p>© {year} Mivora. All rights reserved.</p>
  </Container>
</footer>
  );
}