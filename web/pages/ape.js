import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Header from "../partials/Header";
import "tailwindcss/tailwind.css";

// var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider);


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

const Ape = () => {
  const {data, loading, error} = useQuery(NONCE);
  useEffect(() => {
    if(!loading && !error) {
      return new Promise((resolve, reject) => web3.eth.personal.sign(
        web3.utils.fromUtf8(data.me.nonce),
        '0x6551a57CF40b3e0206B9b3D044f2b2830Ff83b17',
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
        ));
    }
  })
  return <div>{!loading && !error && (<div>{data.me.nonce}</div>)}</div>
};

console.log("hellow")
export default Ape;
