import React from 'react';

import Header from '../partials/Header';
import HeroHome from '../partials/HeroHome';
import FeaturesHome from '../partials/Features';
import FeaturesBlocks from '../partials/FeaturesBlocks';
import Testimonials from '../partials/Testimonials';
import Newsletter from '../partials/Newsletter';
import Footer from '../partials/Footer';
import 'tailwindcss/tailwind.css'

function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="py-32 flex items-center justify-between h-16 md:h-20">
            {/* Site branding */}
                <div className="flex-shrink-0 mr-4">
                    {/* Logo */}
                    <nav className="flex flex-grow">
                    <ul className="flex flex-grow justify-end flex-wrap items-center">
                        <li>
                        <h1 className="text-xl font-bold " data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">Your Unposted NFTs</span></h1>
                        </li>
                    </ul>
                </nav>
                    
                </div>
            </div>
        </div>
      </main>


    </div>
  );
}

export default Home;