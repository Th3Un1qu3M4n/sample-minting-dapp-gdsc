import { Button, Paper, Stack, Typography } from "@mui/material";
// import * as ethers from "ethers";
// import { Web3Provider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
// const ethers = require("ethers")
import logo from "./assets/thanks.png";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
  }, []);

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await accountsChanged(res[0]);
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountsChanged = async (newAccount) => {
    console.log("Account Changed ", newAccount)
    setAccount(newAccount);
    try {
      // console.log(newAccount)
      setErrorMessage(null);
      // const balance = await window.ethereum.request({
      //   method: "eth_getBalance",
      //   params: [newAccount.toString(), "latest"],
      // });
      // setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const sendRequestToBackend = async () => {
    if(loading){
      return;
    }
    setLoading(true)
    const accountString = account.toString();
    console.log("sending request from ", accountString)

    const data = new FormData();
    data.append("minter", accountString)
    
    // fetch('http://localhost:5500/mintNFT', {
      fetch('https://nftserver.devbyahmed.com/mintNFT', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({minter: accountString}),
      })
      .then(response => response.json())
      .then(data => {
        //handle data
        console.log("Got Data",data);
        alert("NFT Minted")
        setResponseMessage(data);
        setLoading(false);
      })
      .catch(error => {
        //handle error
        console.log(error);
        alert("Some Error see console");
        setLoading(false);
      });
  }

  const chainChanged = () => {
    setErrorMessage(null);
    setAccount(null);
    // setBalance(null);
  };

  return (
    <>
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack spacing={2}>
      <img src={logo} alt="Logo" style={{width: '1024px', alignSelf:'center'}} />
      <Typography variant="h6"> Account: {account?.toString().substring(0,4)}...{account?.toString().substring(account.length-4, account.length)} </Typography>

        <Button onClick={connectHandler}>Connect Account</Button>
        {errorMessage ? (
          <Typography variant="body1" color="red">
            Error: {errorMessage}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
    {account?.length > 0 ? (
        <Button onClick={sendRequestToBackend} disabled={loading}>Mint NFT</Button>
      ) : null}
    {responseMessage ? (
        <>
          <Typography variant="body1" color="blue">
          Token Id: {responseMessage.tokenId}
          </Typography>
          <a href={responseMessage.url}>
          <Typography variant="body1" color="blue">
            View on Opensea
          </Typography>
          </a>
        </>
        ) : null}
    </>
  );
};

export default WalletCard;