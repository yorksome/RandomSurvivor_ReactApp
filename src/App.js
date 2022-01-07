import { useEffect, useState } from 'react'; //check Metamask 
import './App.css';
import { ethers } from 'ethers';
import { abis, addresses } from './contracts/index';


function App() {

  // 账户信息
  const [currentAccount, setCurrentAccount] = useState(null);

  // 合约交互相关
  const [scBalance, depositNum] = useState(null);


  // 连接钱包按钮UI渲染
  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  // 购买STAR COIN的按钮UI渲染
  const buyStarCoinButton = () => {
    return (
      <button onClick={buyStarCoinHandler} className='buyStarCoinBtn'>
        Buy
      </button>
    )
  }

  // 统计StarCoin的UI渲染
  const starCoinAmount = () => {
    return (
      <label>Star Coin Amount: {scBalance ? scBalance : 0}</label>
    )
  }

  // Survive按钮的UI渲染
  const checkSurvivorButton = () => {
    return (
      <button onClick={checkSurvivorHandler} className='cta-button survive-button'>
        Survive
      </button>
    )
  }

  // ----------------------------------- 以下是需要跟合约交互的部分 ------------------------------//

    // 检查钱包是否连接
    const checkWalletIsConnected = async () => { 
      const { ethereum } = window;
  
      if(!ethereum) {
        console.log("no metamask installed");
        return;
      } else {
        console.log("metamask found");
      }
  
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized accound found.");
      }
    }
  
    // 连接钱包的handler
    const connectWalletHandler = async () => { 
      const { ethereum } = window;
  
      if(!ethereum) {
        alert("Please install Metamask!")
      }
  
      try{
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (err) {
        console.log(err);
      }
  
    }

  // Step1: 购买STAR COIN的handler
  const buyStarCoinHandler = async () => {
    try{
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const starcoinContract = new ethers.Contract(addresses.starcoin, abis.starcoin, signer);


      } else {

      }


    } catch(err){
      console.log(err);
    }
  }

  // Step2. 捕获质押的数量
  const handleChange = () => {

  }

  // Step3. 提交质押的StarCoin数量到合约
  const handleSubmit = () => {

  }

  // Step4. 跟lottery合约交互，拿到是否存活的结果，并在前端显示
  const checkSurvivorHandler = () => {

  }


  // --------------------------------------------------------------------------------------------//



  const deposit = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input type="number" value={depositNum} onChange={handleChange} />
        <input type="submit" value="Deposit"/>
      </form>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Random Survivor</h1>
      <p>
        {currentAccount ? currentAccount : "User: not connected"} 
      </p>
      <div>
        {currentAccount ? starCoinAmount() : ""}
        {currentAccount ? buyStarCoinButton() : ""}
      </div>
      <div>
        {currentAccount ? deposit() : connectWalletButton()}
      </div>
      <div>
        {currentAccount ? checkSurvivorButton() : ""}
      </div>
    </div>
  )
}

export default App;