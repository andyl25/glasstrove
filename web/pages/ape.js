import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Onboard from 'bnc-onboard'
import Header from "../partials/Header";
import "tailwindcss/tailwind.css";

// var Web3 = require('web3');
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



const EXAMPLE = gql`
  query ExampleQuery {
    countries {
      code
      name
    }
  }
`;

const NONCE = gql`
  query{
    me{
     nonce
   }}
`;

// handleSignMessage = ({ publicAddress, nonce }) => {
//   return new Promise((resolve, reject) =>
//     web3.personal.sign(
//       web3.fromUtf8(`${nonce}`),
//       publicAddress,
//       (err, signature) => {
//         if (err) return reject(err);
//         return resolve({ publicAddress, signature });
//       }
//     )
//   );
// };

// handleAuthenticate = ({ publicAddress, signature }) =>
//     fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
//       body: JSON.stringify({ publicAddress, signature }),
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       method: 'POST'
//     }).then(response => response.json());

const login = async () => {
  await onboard.walletSelect();
  await onboard.walletCheck();
}


const Ape = () => {
  const {data, loading, error} = useQuery(NONCE);
  const [address, setAddress] = useState(null);
  let publicAddress;
  
  useEffect(() => {
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
          }
          )
      }
      )}
      );
    }
  })
  return <div>{!loading && !error && (
    <div>{data.me.nonce}</div>
  )}</div>
};

console.log("hellow")
export default Ape;
