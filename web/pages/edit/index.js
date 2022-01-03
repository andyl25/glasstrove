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


function Home() {

    const router = useRouter()
    function redirAdd() {
      router.push("edit/add")
    }
    function redirReorder() {
      router.push("edit/reorder")
    }
    
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
                        <div class="add-padding font-bold">Choose one of the options above to edit your profile</div>
                    </div>
                </div>
            </div>
            </section>)}

        </main>
               
    


    </div>
  );
}


export default Home;