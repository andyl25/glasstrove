import React, { useState, useEffect } from "react";

import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Shuffle from "../shuffle/shuffle";
import imagesLoaded from "imagesloaded";

// change to postList with specific number of posts to get
const PROFILE = gql`
  query Profile($username: String!) {
    specificUser(username: $username) {
      username
      numfollowers
      posts {
        id
        title
        order
        imageUrl
        size
      }
    }
  }
`;

function Home() {
  const router = useRouter();
  const { username } = router.query;
  const { loading, error, data, refetch } = useQuery(PROFILE, {
    variables: { username },
  });

  useEffect(() => {
    if (!loading && !error) {
      let grid = document.querySelectorAll(".masonry-grid"),
        masonry;

      if (grid === null) return;

      function sortByOrder(element) {
        return element.getAttribute("order") * 10;
      }

      for (let i = 0; i < grid.length; i++) {
        masonry = new Shuffle(grid[i], {
          itemSelector: ".masonry-grid-item",
          sizer: ".masonry-grid-item",
        });
        imagesLoaded(grid[i]).on("progress", () => {
          masonry.layout();
        });
        masonry.sort({ by: sortByOrder });
      }
    }
  });

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main classname="flex-grow">
        {/* <section class="position-relative bg-purple-300 pt-7 pb-5 pb-md-7 bg-size-cover bg-attachment-fixed">
          <div class="shape shape-bottom shape-curve bg-body">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 185.4">
              <path
                fill="currentColor"
                d="M3000,0v185.4H0V0c496.4,115.6,996.4,173.4,1500,173.4S2503.6,115.6,3000,0z"
              ></path>
            </svg>
          </div>
          <div class="container position-relative zindex-5 text-center pt-md-6 pt-lg-7 py-5 my-lg-3">
            <h1 class="profilename text-light mb-0">{username}</h1>
          </div>
        </section> */}
        <div class="container position-relative zindex-5 text-center pt-md-6 pt-lg-7 py-5 my-lg-3">
          <h1 class="profilename text-purple-600 mb-0">{username}</h1>
        </div>
        {!loading && !error && (
          <section class="container overflow-hidden py-5 py-md-6 py-lg-7">
            <div class="masonry-filterable">
              <div
                class="masonry-grid"
                data-columns={
                  window.innerWidth > 1200
                    ? "4"
                    : window.innerWidth > 750
                    ? "3"
                    : "2"
                }
              >
                {data.specificUser.posts.map((post) => (
                  <div class="masonry-grid-item" order={post.order}>
                    <div class="card card-curved-body shadow card-slide">
                      <div class="card-slide-inner">
                        <img
                          class="card-img"
                          src={post.imageUrl}
                          alt={post.title}
                        />
                        <a
                          class="card-body text-center"
                          href={"/post/" + post.id}
                        >
                          <h3 class="h5 nav-heading mt-1 mb-2">{post.title}</h3>
                          <p class="fs-sm text-muted mb-1">DESCRIPTION</p>
                          {/* <p>{post.order}</p> */}
                        </a>
                      </div>
                    </div>
                    {/* <div class="text-center py-3 pb-md-0" onClick={() => }>Load More</div> */}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;
