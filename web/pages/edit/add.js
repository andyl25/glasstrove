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
import { Mixpanel } from '../../utils/Mixpanel';


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

const ADDPOSTS = gql`
  mutation AddPosts($contractAddress: [String!], $tokenID: [String!]){
	addPosts(contractAddress:$contractAddress, tokenId: $tokenID){
		ok,
	}
}
`;

function handleCardSelected(isSelected){
    if(isSelected){
        return "card-2 card-curved-body border-0 card-slide shadow card-hover card-active unselectable"
    }
    return "card-2 card-curved-body border-0 card-slide shadow card-hover card-hover unselectable"
}





function Home() {
    const meQuery = useQuery(ME);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [nfts, setNfts] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [walletNum, setWalletNum] = useState(0)
    const [wallets, setWallets] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [test, setTest] = useState(false);
    const [add] = useMutation(ADDPOSTS)
    const observer = useRef()
    const router = useRouter()
    const lastNFTRef = useCallback(node =>{
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries =>{
            if(entries[0].isIntersecting && hasMore){
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if(node) observer.current.observe(node)

    }, [loading, hasMore])
    const [posts, setPosts] = useState([])

    function redirAdd() {
        router.reload()
      }
    function redirReorder() {
        router.push("/edit/delete")
      }
    

    // const handleSelectionChange = useCallback((box: Box) => {
    //     console.log(box);
    //   },[])
    
    // const { DragSelection } = useSelectionContainer({
    //     onSelectionChange,
    // });


    useEffect(()=>{
        if (meQuery.data) {
            // mutate data if you need to
            for(let i in meQuery.data.me.wallets){
                wallets.push(meQuery.data.me.wallets[i].address)
            }

            for(let i in meQuery.data.me.posts){
                posts.push([meQuery.data.me.posts[i].postTokenId, meQuery.data.me.posts[i].postAssetContract])
            }
        }
        console.log(posts)
    }, [meQuery.data])




    useEffect(() => {
        setLoading(true)
        setError(false)
        if(!meQuery.data){return}
        var url = (`https://api.opensea.io/api/v1/assets?owner=${wallets[walletNum]}&order_direction=desc&offset=${30*pageNumber}&limit=30`);

        fetch(url, {
            headers: {"X-API-KEY":"5926963383cb434fb2bd228e4bc4e107", "Content-Type":"application/json"}})
          .then(res => res.json())
          .then(
            (result) => {
                setNfts(prevNfts => {
                    return[...prevNfts, ...result.assets.filter(
                        n =>{ 
                            let already_included = false;
                            n.selected = false
                            for(let i in posts){
                                if(posts[i][0] == n.token_id && posts[i][1] == n.asset_contract.address){
                                    already_included = true;
                                }
                            }

                            return !already_included
                            // return n
                            

                        }).map(n=>{
                            n.selected = false;
                            return n;
                        })
                    ]
                })

                if(result.assets.length === 0){
                    if(walletNum + 1 === wallets.length){
                        setHasMore(false)
                    }
                    else{
                        setHasMore(true)
                        setWalletNum(walletNum + 1)
                        setPageNumber(0)
                    }
                }
                else{
                    setHasMore(true)
                }
                
                // setHasMore(result.assets.length > 0)
                setLoading(false)
            },
            (error) => {
                setLoading(true);
                setError(true);
            }
          )
        
      }, [pageNumber, walletNum, meQuery.data])
    
    function deselectAll(){
        for(let i in nfts){
            nfts[i].selected = false;
            
        }
        setTest(!test);
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
                            <i class="ai-delete pr-2 pt-0.5"></i>
                            <h1 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Remove NFTs</span></h1>
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
                        <div class="add-padding font-bold">Select individual NFTs or [Shift + Click] an entire row to add</div>
                    </div>
                    
                </div>
                <div class="even-columns-2 ">
                    <div class="even-columns-child-2 text-center pb-5 no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 space-x-5">
                        <button type="button" class="add-padding btn btn-translucent-dark-2 border-1"
                            onClick = {()=> {
                                    let to_add_addresses = [];
                                    let to_add_ids = [];
                                    for(let i in nfts){
                                        if(nfts[i].selected){
                                            to_add_addresses.push(nfts[i].asset_contract.address);
                                            to_add_ids.push(nfts[i].token_id);
                                        }
                                    }
                                    
                                    add({
                                        variables: { contractAddress: to_add_addresses, tokenID: to_add_ids },
                                        onCompleted(data) {
                                            Mixpanel.track('NFTs Posted', {contractAddresses: to_add_addresses, tokenIDs: to_add_ids})
                                        },
                                      });
                                    router.reload();
                                    
                                }
                            }
                        ><span className="bg-clip-text text-gray-500 font-medium">Add Selected</span></button>
                        <button type="button" class="add-padding btn btn-translucent-dark-2 border-1"
                            onClick = {()=>{
                                for(let i in nfts){
                                    nfts[i].selected = false;
                                    
                                }
                                setTest(!test);
                            }}
                        ><span className="bg-clip-text text-gray-500 font-medium">Deselect</span></button>
                        <button type="button" class="add-padding btn btn-translucent-dark-2 border-1"
                            onClick = {()=>{
                                for(let i in nfts){
                                    nfts[i].selected = true;
                                    
                                }
                                setTest(!test);
                                
                            }}
                        ><span className="bg-clip-text text-gray-500 font-medium">Select All</span></button>


                    </div>
                    
                </div>
              <div
                class="even-columns"
                // data-columns={
                //     window.innerWidth > 1200
                //       ? "4"
                //       : window.innerWidth > 750
                //       ? "3"
                //       : "2"
                // }
              >
            {nfts.map((nft, index) =>
                {
                
                let card_selected = handleCardSelected(nft.selected);
                if(nfts.length === index+1){
                    return(<div class = "even-columns-child unselectable">
                        
                        <div class="even-columns-child unselectable">
                                <div 
                                    class={card_selected}
                                    onClick = {(e) => {
                                        if(e.shiftKey){
                                            //gets the row of the nft
                                            let this_row = Math.floor(nfts.indexOf(nft)/5)
                                            for(let i = 0; i < 5; i++){
                                                if(this_row*5+i >= nfts.length){
                                                    continue;
                                                }
                                                let temp_nft = nfts[this_row*5+i];
                                                temp_nft.selected = !temp_nft.selected;
                                            }
                                            
                                            setTest(!test);
                                        }
                                        else{
                                            nft.selected = !nft.selected;
                                            // card_selected = handleCardSelected(nft.selected);
                                            
                                            //required to rerender element
                                            setTest(!test);
                                        }
                                    }}
                                >
                                {/* <div ref = {lastNFTRef} class="card-slide-inner"> */}
                                <div class="card-slide-inner">
                                    <img
                                    class="card-img"
                                    src={nft.image_url}
                                    alt={nft.name}
                                    />
                                    <a
                                    class="card-body text-center"
                                    >
                                    <h3 class="h5 nav-heading mt-1 mb-2">{nft.name}</h3>
                                    <p class="fs-sm text-muted mb-1">DESCRIPTION</p>
                                    {/* <p>{post.order}</p> */}
                                    </a>
                                </div>
                                </div>
                            {/* <div class="text-center py-3 pb-md-0" onClick={() => }>Load More</div> */}
                        </div>
                            {/* <p>{post.order}</p> */}
                        {/* <div class="text-center py-3 pb-md-0" onClick={() => }>Load More</div> */}
                    </div>
                    )
                }
                else{
                    return(<div class = "even-columns-child unselectable">
                        
                        <div class="even-columns-child unselectable">
                                <div 
                                    class={card_selected}
                                    onClick = {(e) => {
                                        if(e.shiftKey){
                                            //gets the row of the nft
                                            let this_row = Math.floor(nfts.indexOf(nft)/5)
                                            for(let i = 0; i < 5; i++){
                                                if(this_row*5+i >= nfts.length){
                                                    continue;
                                                }
                                                let temp_nft = nfts[this_row*5+i];
                                                temp_nft.selected = !temp_nft.selected;
                                            }
                                            
                                            setTest(!test);
                                        }
                                        else{
                                            nft.selected = !nft.selected;
                                            // card_selected = handleCardSelected(nft.selected);
                                            
                                            //required to rerender element
                                            setTest(!test);
                                        }
                                    }}
                                >
                                <div class="card-slide-inner">
                                    <img
                                    class="card-img"
                                    src={nft.image_url}
                                    alt={nft.name}
                                    />
                                    <a
                                    class="card-body text-center"
                                    >
                                    <h3 class="h5 nav-heading mt-1 mb-2">{nft.name}</h3>
                                    <p class="fs-sm text-muted mb-1">DESCRIPTION</p>
                                    {/* <p>{post.order}</p> */}
                                    </a>
                                </div>
                                </div>
                            {/* <div class="text-center py-3 pb-md-0" onClick={() => }>Load More</div> */}
                        </div>
                            {/* <p>{post.order}</p> */}
                        {/* <div class="text-center py-3 pb-md-0" onClick={() => }>Load More</div> */}
                    </div>
                    )
                }
                
                    // <div>
                    //     <div>
                    //     {nft.name}
                    //     </div>
                    //     <div>
                    //     {nft.image_url}
                    //     </div>
                    // </div>
                
            }
            
            )}
            </div>
            
            
            {/* {!loading && !error && (
                data.me.username
                )} */}
            </div>
            </section>)}

            <div>{loading &&<div class="lds-ring"><div></div><div></div><div></div><div></div></div>}</div>
            <div>{error && 'Error...'}</div>
        </main>
        

        <div ref = {lastNFTRef} class = "foot-infinite-reload"> </div>
    </div>
  );
}


export default Home;