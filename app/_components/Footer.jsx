import React from "react";

const Footer = () => {
  return (
    <footer className="mt-32 py-6 text-center opacity-90">
      &copy; {new Date().getFullYear()} AI VideoGen. All rights reserved.
    </footer>
  );
};

export default Footer;
