import {React, useEffect, useState, useRef, useCallback} from 'react';

import Header from '../../partials/Header';
import HeroHome from '../../partials/HeroHome';
import FeaturesHome from '../../partials/Features';
import FeaturesBlocks from '../../partials/FeaturesBlocks';
import Testimonials from '../../partials/Testimonials';
import Newsletter from '../../partials/Newsletter';
import Footer from '../../partials/Footer';

import { gql, useMutation, useQuery, useLazyQuery} from "@apollo/client";
import { useRouter } from "next/router";
import Shuffle from "../../shuffle/shuffle";
import imagesLoaded from "imagesloaded";
import 'tailwindcss/tailwind.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers';


const ME = gql`
  query {
    me {
      username
      posts{
          imageUrl,
          title,
          id,
          title,
          description,
          order,
      }
    }
  }
`;
function Home() {

    const [test, setTest] = useState(false)
    const router = useRouter()
    const {loading, error, data, refetch} = useQuery(ME);
    function redirAdd() {
      router.push("/edit/add")
    }
    function redirReorder() {
      router.reload()
    }

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
          router.replace('/')
        }
      });
    
    return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
        <main className="flex-grow">
            <div class="border-bottom pt-2 pb-2 mb-5 mx-28">
                <div class="content-center text-center flex flex-nowrap justify-center">
                    <div className="px-24 text-center pt-28 mb-4">
                        <button 
                            type="button" 
                            class="btn btn-translucent-dark border-0 flex flex-nowrap"
                            onClick = {redirAdd}
                        >
                            <i class="ai-plus-square pr-2 pt-0.5"></i>
                            <h1 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter " data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Add NFTs</span></h1>
                        </button>
                    </div>
                    <div className="px-24 text-center pt-28 mb-4">
                        <button 
                            type="button" 
                            class="btn btn-translucent-dark border-0 flex flex-nowrap"

                            onClick = {redirReorder}
                        >
                            <i class="ai-move pr-2 pt-0.5"></i>
                            <h1 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Reorder Profile</span></h1>
                        </button>
                    </div>
                </div>
            </div>

            {/* NFTS */}
            {(
            
            <section class="container overflow-hidden py-2 py-md-2 py-lg-2">
           
            <div>
              <div class="even-columns-2 ">
                    <div class="even-columns-child-2 text-center pb-2 no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 space-x-5">
                        <div class="add-padding font-bold">Drag and drop to reorder your posts, then save when you're ready</div>
                        
                    </div>
                </div>
                <div class="even-columns-2 ">
                    <div class="even-columns-child-2 text-center pb-5 no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 space-x-5">
                        
                        <button type="button" class="add-padding btn btn-translucent-dark-2 border-1"
                            onClick = {()=>{
                                console.log(data)
                                
                            }}
                        ><span className="bg-clip-text text-gray-500 font-medium">Save!</span></button>


                    </div>
                    
                </div>
            </div>
            </section>)}

            
            <DragDropContext>
              {!loading && !error && (
              
              
            <section class="container overflow-hidden py-5 py-md-6 py-lg-7">
              <div class="masonry-filterable">
              <Droppable droppableId="abc">
              {(provided) => (
                <ul
                  className="abc" {...provided.droppableProps}
                  data-columns={
                    window.innerWidth > 1200
                      ? "4"
                      : window.innerWidth > 750
                      ? "3"
                      : "2"
                  }
                  ref={provided.innerRef}
                >
                  
                    {data.me.posts.map((post, index) => (
                      <Draggable key={post.id} draggableId={post.id} index={index}>
                      {(provided) => (
                        <li class="masonry-grid-item" order={post.order} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                        </li>
                      )}
                      </Draggable>
                    ))}
                  
                  {provided.placeholder}
                </ul>
                
                )}
                
                </Droppable>
              </div>
            </section>
              
            
            
          )}
          </DragDropContext>
        
        </main>
               
    


    </div>
  );
}


export default Home;