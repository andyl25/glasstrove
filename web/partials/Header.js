import React, { useState, useEffect } from "react";
import Link from "next/link";
import "tailwindcss/tailwind.css";

function Header() {
  const [top, setTop] = useState(true);

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        "bg-white blur shadow-lg"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="flex-shrink-0 mr-4">
            {/* Logo */}
            <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center">
                <li>
                  <a className = "group hover:no-underline" href="/">
                    <a className="no-underline font-bold text-gray-600 text-2xl items-center group-hover:text-gray-700 hover:no-underline transition duration-150 ease-in-out">glass</a>
                    <a className="no-underline font-bold text-purple-600 text-2xl items-center group-hover:text-gray-900 hover:no-underline transition duration-150 ease-in-">trove</a>
                  </a>
                </li>
            </ul>
          </nav>
            
          </div>

          {/* Site navigation */}
          <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center space-x-6">
              <li className="">
                {/* <Link href="/"> */}
                <a className = "group hover:no-underline" href="/">
                    <a className="no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 hover:no-underline transition duration-150 ease-in-out">Home</a>
                </a>
                {/* </Link> */}
              </li>
              <li className="">
                {/* <Link href="/"> */}
                <a className = "group hover:no-underline" href="/">
                    <a className="no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 hover:no-underline transition duration-150 ease-in-out">Profile</a>
                </a>
                {/* </Link> */}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
