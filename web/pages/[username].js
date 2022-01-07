import React, { useState, useRef, useEffect, useCallback } from "react";

import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Shuffle from "../shuffle/shuffle";
import imagesLoaded from "imagesloaded";
import { Mixpanel } from "../utils/Mixpanel";

// change to postList with specific number of posts to get
const PROFILE = gql`
  query Profile($username: String!, $numresults: Int!) {
    specificUser(username: $username) {
      username
      numfollowers
    }
    postList(username: $username, numresults: $numresults) {
      id
      title
      order
      imageUrl
      size
      description
      postTokenId
    }
  }
`;

const ME = gql`
  query {
    me {
      username
      following {
        username
      }
    }
  }
`;

const FOLLOW = gql`
  mutation Follow($username: String!) {
    addFollowing(username: $username) {
      ok
    }
  }
`;
const UNFOLLOW = gql`
  mutation Unfollow($username: String!) {
    stopFollowing(username: $username) {
      ok
    }
  }
`;


function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

let num_results = 15;
function Home() {
  const router = useRouter();

  const { username } = router.query;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, refetch, networkStatus } = useQuery(PROFILE, {
    variables: { username: username, numresults: num_results },
  });
  const meQuery = useQuery(ME, {
    onCompleted: (data) => {
      Mixpanel.track("Profile Page View", {
        profile: username,
      });
    },
  });
  const [follow] = useMutation(FOLLOW);
  const [unfollow] = useMutation(UNFOLLOW);
  useEffect(() => {
    setIsLoaded(true);
  }, [loading]);

  useEffect(() => {
    if (!loading && !error) {
      window.addEventListener(
        "scroll",
        debounce((event) => {
          let scrollTop = event.target.documentElement.scrollTop;
          if (document.getElementById("grid")) {
            let gridHeight = document.getElementById("grid").clientHeight;

            if (
              scrollTop + window.innerHeight > gridHeight &&
              data.postList.length >= num_results
            ) {
              console.log("====");
              num_results += 15;
              refetch({ username: username, numresults: num_results });
            }
          }
        }, 100)
      );
    }
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
    if (!loading && error) {
      router.replace("/");
    }
  });

  //fetch more assets
  // useEffect(() => {
  //   setIsLoading(true)
  //   setIsError(false)
  //   if(!data){return}

  //   setNfts(prevNfts => {
  //       return[...prevNfts, ...data.postList
  //       ]
  //   })

  //   if(data.postList.length === 0){
  //     setHasMore(false)
  //   }
  //   else{
  //       setHasMore(true)
  //   }

  //   // setHasMore(result.assets.length > 0)
  //   console.log(nfts)
  //   setIsLoading(false)

  // }, [pageNumber, data])

  function handleFollow() {
    if (meQuery.data.me == null) {
      router.push("/login");
    } else {
      follow({
        variables: { username: username },
        onCompleted(data) {
          if (data.addFollowing.ok) {
            meQuery.refetch();
            refetch({ variables: { username } });
          } else {
            router.push("/login");
          }
        },
      });
    }
    if (!loading && error) {
      router.replace("/");
    }
  }
  function handleUnfollow() {
    if (meQuery.data.me == null) {
      router.push("/login");
    } else {
      unfollow({
        variables: { username: username },
        onCompleted(data) {
          if (data.stopFollowing.ok) {
            meQuery.refetch();
            refetch({ variables: { username } });
          } else {
            router.push("/login");
          }
        },
      });
    }
  }

  function includesName(followerList, specificName) {
    for (let i = 0; i < followerList.length; i++) {
      if (followerList[i].username == specificName) {
        return true;
      }
    }
    return false;
  }
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
        <div class="container position-relative zindex-5 text-center pt-md-6 pt-lg-7 py-5 my-lg-3 pb-0">
          {/* show profile pic */}
          <h1 class="profilename text-purple-600 mb-0">{username}</h1>
          {!loading && !error && (
            <p class="fs-lg text-gray-500 mt-1">
              {data.specificUser.numfollowers} Followers
            </p>
          )}
          {!meQuery.loading &&
            !meQuery.error &&
            meQuery.data.me != null &&
            !includesName(meQuery.data.me.following, username) && (
              <button
                type="button"
                class="btn btn-translucent-primary mt-4"
                onClick={handleFollow}
              >
                Follow
              </button>
            )}
          {!meQuery.loading &&
            !meQuery.error &&
            meQuery.data.me != null &&
            includesName(meQuery.data.me.following, username) && (
              <button
                type="button"
                class="btn btn-translucent-success mt-4"
                onClick={handleUnfollow}
              >
                Following
              </button>
            )}
        </div>
        {!loading && !error && (
          <section class="container overflow-hidden py-5 py-md-6 py-lg-7">
            <div class="masonry-filterable">
              <div
                className="masonry-grid"
                id="grid"
                data-columns={
                  window.innerWidth > 1200
                    ? "4"
                    : window.innerWidth > 750
                    ? "3"
                    : "2"
                }
              >
                {data.postList.map((post, index) => {
                  return (
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
                            <h3 class="h5 nav-heading mt-1 mb-2">
                              {post.title}
                            </h3>
                            <p class="fs-sm text-muted mb-1">
                              {post.description}
                            </p>
                            {/* <p>{post.order}</p> */}
                          </a>
                        </div>
                      </div>
                      {/* <div class="text-center py-3 pb-md-0" onClick={() => }>Load More</div> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        {/* <div>{isLoading && loading && <div class="lds-ring"><div></div><div></div><div></div><div></div></div>}</div> */}
        <div>
          {loading && (
            <div class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
        <div>
          {!loading && !error && data.postList.length >= num_results && (
            <div class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
