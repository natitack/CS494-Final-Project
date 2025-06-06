"use client";

import Link from "next/link";
import Login from "./login"; // Add this import

const NavBar: React.FC = () => {

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">Home</Link>
      </div>
      <div className="flex gap-2">
        <Login /> 
      </div>
    </div>
  );
};

export default NavBar;