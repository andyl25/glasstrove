import React, { useState } from 'react';
import Modal from '../utils/Modal';
import 'tailwindcss/tailwind.css'

function HeroHome() {

  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative">

      {/* Illustration behind hero content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none" aria-hidden="true">
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#DDD6FE" offset="0%" />
              <stop stopColor="#A78BFA" offset="77.402%" />
              <stop stopColor="#7C3AED" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Showcase your favorite <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">NFTs</span></h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">Make a profile to show off your favorite NFTs, build a following, and create communities.</p>
              {/* <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                <div>
                  <a className="btn text-white bg-purple-600 hover:bg-purple-700 w-full mb-4 sm:w-auto sm:mb-0" href="#0">Start free trial</a>
                </div>
                <div>
                  <a className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4" href="#0">Learn more</a>
                </div>
              </div> */}
            </div>
          </div>

          {/* Hero image */}
          <div>
            <div className="relative flex justify-center mb-8" data-aos="zoom-y-out" data-aos-delay="450">
              <div className="mx-9 flex flex-row justify-center">

                <img className="z-20 -mx-8 rounded-2xl w-1/3 transform skew-y-6" src="https://lh3.googleusercontent.com/GS1ISv04SMCaNyBnc2WAWdQG0MLQ3mkboDqhdEFR8M6PXs6xAC-zUQaMTDk9sfk4OeLIYpA7jqDFChJ8aHXz3nQnNf6drrqS28xL" />
                <img className="z-10 -mx-8 rounded-2xl w-1/3 transform skew-y-6" src="https://lh3.googleusercontent.com/qxky4Bie8peNjK4VkIUyXjXp91tv8a5qfEfP50NOP4pdW4fggUmoJFnII08WYwPYe8QpgJkoXvBzriUN_qTSuxX8VyTXozWqwvi5_g" />
                
                <img className="z-0 -mx-8 rounded-2xl w-1/3 transform skew-y-6" src="https://lh3.googleusercontent.com/Gwk0ZXD4fs7NomQ7K7zzlF_lORkIwdJCgUMxMk7Ad23wl4x5sKIIVcNOTn5IwUwwJQCsjF9-sa-0NA_bdEWl0a0pxVf2fGXs0twi78o=w404" />

              </div>
              {/* <div className="flex flex-row justify-center space-x-5">

                <img className="rounded-2xl w-1/2" src="https://lh3.googleusercontent.com/GS1ISv04SMCaNyBnc2WAWdQG0MLQ3mkboDqhdEFR8M6PXs6xAC-zUQaMTDk9sfk4OeLIYpA7jqDFChJ8aHXz3nQnNf6drrqS28xL" />
                <img className="rounded-2xl w-1/2" src="https://lh3.googleusercontent.com/qxky4Bie8peNjK4VkIUyXjXp91tv8a5qfEfP50NOP4pdW4fggUmoJFnII08WYwPYe8QpgJkoXvBzriUN_qTSuxX8VyTXozWqwvi5_g" />

              </div> */}
              
            </div>

            {/* Modal */}
            <Modal id="modal" ariaLabel="modal-headline" show={videoModalOpen} handleClose={() => setVideoModalOpen(false)}>
              <div className="relative pb-9/16">
                <iframe className="absolute w-full h-full" src="https://player.vimeo.com/video/174002812" title="Video" allowFullScreen></iframe>
              </div>
            </Modal>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroHome;