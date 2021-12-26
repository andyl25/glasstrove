import React from 'react';

import Header from '../partials/Header';
import HeroHome from '../partials/HeroHome';
import FeaturesHome from '../partials/Features';
import FeaturesBlocks from '../partials/FeaturesBlocks';
import Testimonials from '../partials/Testimonials';
import Newsletter from '../partials/Newsletter';
import Footer from '../partials/Footer';

import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Shuffle from "../shuffle/shuffle";
import imagesLoaded from "imagesloaded";
import 'tailwindcss/tailwind.css'

const ME = gql`
  query {
    me {
      username,
      id,
      wallets{
          address,
      }
      posts{
        postTokenId,
		postAssetContract,
      }
      }
    }
`;

function Home() {
  return (
    <div className="">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="">
            <div class="border-bottom pt-2 pb-2 mb-5 mx-28">
                <div class="content-center text-center flex flex-nowrap justify-center">
                    <div className="px-24 text-center pt-28 mb-4">
                        <button 
                            type="button" 
                            class="btn btn-translucent-dark border-0 flex flex-nowrap"
                        >
                            <i class="ai-plus-square pr-2 pt-0.5"></i>
                            <h1 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter " data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Add NFTs</span></h1>
                        </button>
                    </div>
                    <div className="px-24 text-center pt-28 mb-4">
                        <button 
                            type="button" 
                            class="btn btn-translucent-dark border-0 flex flex-nowrap"
                        >
                            <i class="ai-move pr-2 pt-0.5"></i>
                            <h1 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Reorder Profile</span></h1>
                        </button>
                    </div>
                </div>
            </div>
      </main>


    </div>
  );
}

export default Home;