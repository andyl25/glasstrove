import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Onboard from 'bnc-onboard'
import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";

const ME = gql`
  query {
    me {
      username,
      id,
      wallets{
          address,
          id,
      }
      posts{
        postTokenId,
		postAssetContract,
      }
      }
    }
`;

const DELWALLET = gql`
mutation DelWallet($id: Int!){
	deleteWallet(id:$id){
		ok,
		err,
	}
}
`;

const ADDWALLET = gql`
mutation AddWallet($nonce: String!, $signature: String!){
	addWallet(nonce: $nonce, signature: $signature){
		ok,
		err,
	}
}
`;

const NONCE = gql`
  query{
    me{
     nonce
   }}
`;

const login = async () => {
  await onboard.walletSelect();
  await onboard.walletCheck();
}

var web3 = new Web3(Web3.givenProvider);

const onboard = Onboard({
  dappId: "5fd74524-ab47-4645-a91c-17ed8833508a",       // [String] The API key created by step one above
  networkId: 1, 
  subscriptions: {
    wallet: wallet => {
       web3 = new Web3(wallet.provider)
       console.log(wallet.name)
    }
  }
});


function Signup() {
  const [wallets, setWallets] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const meQuery = useQuery(ME);
  const [del] = useMutation(DELWALLET);
  const [add] = useMutation(ADDWALLET);
  const {data, loading, error} = useQuery(NONCE);
  const [address, setAddress] = useState(null);
  let publicAddress;

  function handleRemove(id_remove){
    del({
      variables: {id: id_remove},
      onCompleted(data){
        router.reload();
      }
    })
  }

  function handleAdd(){
    let userAddress;
    if(!loading && !error) {
      login().then(() => {
      console.log("...");
      console.log((data.me.nonce));
      console.log(web3.utils.utf8ToHex('240739'));
      web3.eth.getCoinbase((err, coinbase) => {userAddress = coinbase}).then(() => {
        web3.eth.personal.sign(
          web3.utils.fromUtf8(data.me.nonce.toString()),
          userAddress,
          (err, signature) => {
            console.log( signature );
            add({
              variables: {nonce: data.me.nonce, signature: signature},
              onCompleted(data){
                router.reload();
              }
            })
          
          }
          )
      }
      )}
      );
    }
  }

  useEffect(()=>{
      if (meQuery.data) {
          // mutate data if you need to
          for(let i in meQuery.data.me.wallets){
              wallets.push(meQuery.data.me.wallets[i])
          }
          setLoaded(true);
      }
      console.log(wallets)
  }, [meQuery.data])

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      
      <main className="flex-grow">
            <div class="border-bottom pt-2 mb-5 mx-28">
                <div class="content-center text-center flex flex-nowrap justify-center">
                    <div className="px-24 text-center pt-28 mb-4">
                        <button 
                            type="button" 
                            class="btn btn-translucent-dark border-0 flex flex-nowrap"
                            onClick={handleAdd}
                        >
                            <i class="ai-plus-square pr-2 pt-0.5"></i>
                            <h1 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter " data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Add Wallet</span></h1>
                        </button>
                    </div>
                </div>
            </div>
            <div class="even-columns-child-2 text-center pb-2 no-underline font-semibold text-gray-500 text-lg items-center group-hover:text-gray-700 space-x-5">
                        <div class="add-padding font-bold">Add more wallets above ^^</div>
                 
            </div>
            {loaded && (
              <section className = "space-y-4 px-5">
                
                    {wallets.map((wallet, index) => (
                      <div class="card card-horizontal">
                      
                      <div class="card-body">
                        <h5 class="card-title">Wallet {index+1}
                        
                        </h5>
                        
                        <p class="card-text fs-sm pb-3">{wallet.address}</p>
                        
                      </div>
                      
                      <div className = "pt-4 pr-8">
                        <button class="btn btn-sm btn-primary"
                          onClick = {() => {
                            handleRemove(wallet.id)
                          }}
                        >
                          Remove Wallet 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet float-right pl-1 pt-1.5" viewBox="0 0 16 16">
                          <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z"/>
                        </svg>
                        </button>
                        
                      </div>
                    </div>
                    ))}
              </section>
            )}
    </main>
    
                    
    </div>
  );
}

export default Signup;
