import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import remix_abi from '../../../contracts/storage_1.json';
import './home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const contractAddress = '0x6E20a03FBfF403200c2A9C7235Cd5a7C9a50d617';

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connectButton, setConnectButton] = useState('Connect Wallet');

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [amount, setAmount] = useState(null);

  const [provider, setProvider] = useState(null);
  const [singer, setSinger] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallerHandler = () => {
    if (window.ethereum) {
      try {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((result) => {
            accountChangeHanlder(result[0]);
            toast.success(
              'Congratulations! You connected your wallet, Toto would be proud',
              {
                autoClose: 4000,
                theme: 'colored',
              }
            );
            setConnectButton('Wallet Connected');
          });
      } catch {
        setErrorMessage('Error');
        console.log(errorMessage);
      }
    } else {
      setErrorMessage('Need to install MetaMask');
      console.log(errorMessage);
      toast.error(
        'Error, please check if you have MetaMask installed, or try on another browser.',
        {
          autoClose: 5000,
          theme: 'colored',
        }
      );
    }
  };

  const accountChangeHanlder = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSinger(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      remix_abi,
      tempSigner
    );
    setContract(tempContract);
  };

  const getCurrentVal = async () => {
    try {
      let val = await contract.retrieve();
      setCurrentContractVal(hexToDec(val));
      console.log(hexToDec(val));
    } catch (res) {
      console.log(res);
      toast.error(
        'Please connect your wallet before trying to get the last value submitted. You`d get Toto angry',
        {
          autoClose: 4000,
          theme: 'colored',
        }
      );
    }
  };

  const setHandler = (event) => {
    try {
      event.preventDefault();
      contract.store(parseInt(event.target.setText.value));
      toast.info(
        'The transaction is being made, plase wait. Don`t be as impatient as Toto',
        {
          autoClose: 4000,
          theme: 'colored',
        }
      );
      setConnectButton('Wallet Connected');
    } catch {
      toast.error(
        'Please connect your wallet before trying to do a transaction. You`d get Toto angry',
        {
          autoClose: 4000,
          theme: 'colored',
        }
      );
    }
  };

  function hexToDec(hexString) {
    return parseInt(hexString, 16);
  }
  return (
    <>
      <div className="homeContainer">
        <h3>{'Get/Set Interaction with contract'}</h3>
        <button
          disabled={connectButton === 'Wallet Connected'}
          className="connectWalletButton"
          onClick={connectWallerHandler}
        >
          {connectButton}
        </button>
        <div className="addressDiv">Address: {defaultAccount}</div>

        <form onSubmit={setHandler}>
          <div style={{ fontStyle: 'italic' }}>
            Plase submit a number from 1 to 10
          </div>
          <input
            onChange={(value) => setAmount(value)}
            className="ammountInput"
            id="setText"
            type="number"
            min={1}
            max={9}
          ></input>
          <button disabled={!amount} className="submitbutton" type={'submit'}>
            Submit value
          </button>
        </form>
        <ToastContainer />

        <div className="currentValueContainer">
          <button className="currentValueButton" onClick={getCurrentVal}>
            Get current value
          </button>
          <h4 className="currentValue">{currentContractVal}</h4>
        </div>
        {errorMessage}
      </div>
    </>
  );
};
export default withRouter(Home);
