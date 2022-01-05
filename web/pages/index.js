import React, { useState, useEffect } from "react";

import Header from "../partials/Header";
import HeroHome from "../partials/HeroHome";
// import FeaturesHome from '../partials/Features';
// import FeaturesBlocks from '../partials/FeaturesBlocks';
// import Testimonials from '../partials/Testimonials';
// import Newsletter from '../partials/Newsletter';
// import Footer from '../partials/Footer';
import "tailwindcss/tailwind.css";
import { gql, useMutation, useQuery, NetworkStatus } from "@apollo/client";
import { useRouter } from "next/router";

const FEED = gql`
  query feedQuery($numresults: Int!) {
    feed(numresults: $numresults) {
      id
      title
      postedDate
      imageUrl
      description
      owner {
        username
      }
    }
  }
`;

function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
let num_results = 15;

function Home() {
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery(FEED, {
    variables: { numresults: num_results },
  });
  
  useEffect(() => {
    if (!loading && !error) {
      window.addEventListener("scroll", debounce((event) => {
        let scrollTop = event.target.documentElement.scrollTop;
        if (document.getElementById("grid")) {
          let gridHeight = document.getElementById("grid").clientHeight;
          console.log(data.feed.length)
          console.log(num_results)
          console.log(scrollTop + window.innerHeight > gridHeight)
          if (scrollTop + window.innerHeight > gridHeight && data.feed.length >= num_results) {
            num_results += 15;
            refetch({ numresults: num_results });
          }
        }
      }, 100));
    }
  });

  return (
    <div>
      {!loading && error && (
        <div className="flex flex-col min-h-screen overflow-hidden">
          {/*  Site header */}
          <Header />

          {/*  Page content */}
          <main className="flex-grow">
            {/*  Page sections */}
            <HeroHome />
            {/* <FeaturesHome />
      <FeaturesBlocks />
      <Testimonials />
      <Newsletter /> */}
          </main>

          {/*  Site footer */}
          {/* <Footer /> */}
        </div>
      )}
      {!loading && !error && (
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-grow">
            <section class="container overflow-hidden py-5 py-md-6 py-lg-7">
              <div>
                <div>
                  <div className="even-columns-feed" id="grid">
                    {data.feed.map((post) => (
                      <div class="masonry-grid-item-fixed pb-20 pr-6 pl-6">
                        <div class="card card-curved-body shadow card-slide">
                          <div
                            class="card-slide-inner pointer-hover"
                            onClick={() => {
                              router.push("/post/" + post.id);
                            }}
                          >
                            <img
                              class="card-img"
                              src={post.imageUrl}
                              alt={post.title}
                            />
                            <a
                              class="card-body text-center"
                              href={"/post/" + post.id}
                            >
                              <h3 class="h5 nav-heading mt-1 mb-2">
                                {post.title}
                              </h3>
                            </a>
                          </div>
                        </div>
                        <div>
                          <p className="pt-2">
                            <a
                              href={"/" + post.owner.username}
                              className="post-owner"
                            >
                              {post.owner.username}
                            </a>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      )}
    </div>
  );
}

export default Home;
