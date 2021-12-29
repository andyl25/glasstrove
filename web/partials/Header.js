import React, { useState, useEffect } from "react";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";

const SEARCH = gql`
  query search($searchstring: String!, $numresults: Int!) {
    searchUsers(searchstring: $searchstring, numresults: $numresults) {
      username
      numfollowers
    }
  }
`;

function Header() {
  const router = useRouter();
  const [top, setTop] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loadSearch, { called, loading, data, error }] = useLazyQuery(SEARCH);

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
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${"bg-white blur shadow-lg"}`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="flex-shrink-0 mr-4">
            {/* Logo */}
            <nav className="flex flex-grow">
              <ul className="flex flex-grow justify-end flex-wrap items-center">
                <li>
                  <a className="group hover:no-underline" href="/">
                    <a className="no-underline font-bold text-gray-600 text-2xl items-center group-hover:text-gray-700 hover:no-underline transition duration-150 ease-in-out">
                      glass
                    </a>
                    <a className="no-underline font-bold text-purple-600 text-2xl items-center group-hover:text-gray-900 hover:no-underline transition duration-150 ease-in-">
                      trove
                    </a>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="input-group w-80 absolute left-1/2 -ml-40 rounded-l-xl">
            <input
              class="form-control"
              // type="text"
              placeholder="Search by username..."
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                if (event.target.value !== "") {
                  loadSearch({
                    variables: {
                      searchstring: event.target.value,
                      numresults: 20,
                    },
                  });
                }
              }}
            />
            <div class="btn-icon search-button">
              <i class="ai-search"></i>
            </div>
          </div>
          {searchText.length > 0 && !loading && !error && (
            <div class="absolute left-1/2 -ml-40 search-results rounded-b-xl">
              {data.searchUsers.map((user) => (
                <a
                  href={"/" + user.username}
                  class="dropdown-item flex flex-row"
                >
                  {user.username}
                  <p className="follower-count"> {user.numfollowers} Followers</p>
                </a>
              ))}
            </div>
          )}
          {/* Site navigation */}
          <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center space-x-6">
              <li className="">
                {/* <Link href="/"> */}
                <a className="group hover:no-underline" href="/">
                  <a className="no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 hover:no-underline transition duration-150 ease-in-out">
                    Home
                  </a>
                </a>
                {/* </Link> */}
              </li>
              <li className="">
                {/* <Link href="/"> */}
                <a className="group hover:no-underline" href="/">
                  <a className="no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 hover:no-underline transition duration-150 ease-in-out">
                    Profile
                  </a>
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
