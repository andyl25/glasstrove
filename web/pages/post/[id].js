import React, { useState, useEffect } from "react";

import Header from "../../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

// format copied from [username].js
const PICTURE = gql`
  query Profile($id: Int!) {
    specificPost(id: $id) {
      id,
      title,
      order,
      imageUrl,
      size,
      description,
      owner {
        username,
        numfollowers
      }
    }
  }
`;

function Home() {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data, refetch } = useQuery(PICTURE, {
    variables: { id },
  });

  useEffect(() => {
    if (!loading && !error) {
      console.log(data)
    //   let grid = document.querySelectorAll(".masonry-grid"),
    //     masonry;

    //   if (grid === null) return;

    //   for (let i = 0; i < grid.length; i++) {
    //     masonry = new Shuffle(grid[i], {
    //       itemSelector: ".masonry-grid-item",
    //       sizer: ".masonry-grid-item",
    //     });
    //     masonry.layout();
    //   }
    }
  });

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main class="page-wrapper">
        {!loading && !error && data.specificPost.length > 0 && (<section class="sidebar-enabled sidebar-end">
          <div class="container">
            <div class="row">
              {/* <!-- Post / Owner description--> */}
              <div class="col-lg-3 sidebar pt-5 pt-lg-7 order-lg-2">
                <div class="px-sm-4 pt-6 py-lg-6 position-relative zindex-5">
                  <h1 class="h2 text-purple-600">{data.specificPost[0].title}</h1>
                  {/* <div class="d-sm-flex align-items-center pt-3 pb-2 mb-5 border-bottom fs-sm">
                    <div class="d-flex align-items-center mb-3">
                      <div class="text-nowrap text-muted me-3"><i class="ai-calendar me-1"></i><span>Aug 28, 2020</span></div>
                      <div class="text-nowrap text-muted"><i class="ai-tag me-1"></i><span>3D Modelling</span></div>
                    </div><a class="btn btn-translucent-primary btn-sm ms-auto mb-3 d-inline-block d-lg-none" href="#gallery" data-scroll>Project Gallery</a>
                  </div> */}
                  
                  <div class="d-flex align-items-center pb-1 mb-3"><a class="d-block flex-shrink-0" href="#">
                    <img class="rounded-circle" src={data.specificPost[0].imageUrl} alt="Post" width="64"></img></a>
                    <div class="ps-2 ms-1">
                      <h3 class="h5 mt-4 mb-1"> Owner </h3>
                      <ul class="list-unstyled fs-md mb-4 pb-2">
                      <li class="mb-1">User:<a href={"/"+data.specificPost[0].owner.username}><span class="fw-medium text-nav ms-2">{data.specificPost[0].owner.username}</span></a></li>
                      <li class="mb-1">Followers:<span class="fw-medium text-nav ms-2">{data.specificPost[0].owner.numfollowers}</span></li>
                      </ul>
                    </div>
                  </div>


                  <h3 class="h5 mt-4 mb-1"> Owner </h3>
                  <ul class="list-unstyled fs-md mb-4 pb-2">
                    <li class="mb-1">User:<a href={"/"+data.specificPost[0].owner.username}><span class="fw-medium text-nav ms-2">{data.specificPost[0].owner.username}</span></a></li>
                    <li class="mb-1">Followers:<span class="fw-medium text-nav ms-2">{data.specificPost[0].owner.numfollowers}</span></li>
                  </ul>

                  <h3 class="h5 mt-4 mb-1"> Description </h3>
                  <p class="fs-sm mb-4 pb-2">{data.specificPost[0].description}</p>


                  <h3 class="h5 mt-4 mb-1"> Creator </h3>
                  <ul class="list-unstyled fs-md mb-4 pb-2">
                    <li class="mb-1">Name:<span class="fw-medium text-nav ms-2">{data.specificPost[0].title}</span></li>
                  </ul>

                </div>
              </div>
              {/* <!-- image--> */}
              <div class="col-lg-9 content pt-2 pt-lg-7 pb-lg-4 order-lg-1" id="gallery">
                <div class="gallery-item rounded-3 mb-grid-gutter">
                  {/* <a class="gallery-item rounded-3 mb-grid-gutter" href={data.specificPost[0].imageUrl}>   */}
                    <img src={data.specificPost[0].imageUrl} alt={data.specificPost[0].title}></img>
                  {/* </a> */}
                  {/* <a class="gallery-item rounded-3 mb-grid-gutter" href="img/portfolio/single/01.jpg"><img src={data.specificPost.imageUrl} alt={data.specificPost.title}></img></a> */}
                </div>
              </div>
            </div>
          </div>
        </section>)}
      </main>
    </div>
  );
}

export default Home;
