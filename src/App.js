import { useEffect, useState } from 'react'; //check Metamask 
import './App.css';
import { ethers } from 'ethers';
import { abis, addresses } from './contracts/index';


function App() {

  // 账户信息
  const [currentAccount, setCurrentAccount] = useState(null);

  // 合约交互相关
  const [scBalance, setscBalance] = useState(null);
  const [depositNum, setDepositNum] = useState(null);
  const [buyNum, setBuyNum] = useState(null);
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const starcoinContract = new ethers.Contract(addresses.starcoin, abis.starcoin, signer);
  const lotteryContract = new ethers.Contract(addresses.lottery, abis.lottery, signer);
  
  
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
    //页面load触发
    const onLoadHandle = async () => { 
	
		if(!ethereum) {
			console.log("no metamask installed");
			return;
		  } else {
			console.log("metamask found");
		  }
	  
		  const accounts = await ethereum.request({ method: 'eth_accounts' });
		  if(accounts.length !== 0) {
				console.log("Found an authorized account: ", accounts[0]);
				setCurrentAccount(accounts[0]);
				console.log('currentAccount'+currentAccount);
				try{
						//console.log(starcoinContract.address);
						console.log(starcoinContract.interface);
						//console.log(await starcoinContract.name());
						//console.log(await starcoinContract.totalSupply());
						//console.log(await starcoinContract.decimals());
						
						let balance=await starcoinContract.balanceOf(accounts[0]);
						setscBalance(balance.toNumber());
						
						console.log(lotteryContract.address);
						console.log(lotteryContract.interface);
						console.log(await lotteryContract.getLotteryId());
						let lotteryOpen = await lotteryContract.getLotteryOpen();
						console.log(lotteryOpen===true?"开局"+(await lotteryContract.getPool()):"未开或已结束");

						console.log(await lotteryContract.manager());
					} catch(err){
					  console.log(err);
					}			
			  } else {
				  connectWalletHandler();
				console.log("No authorized accound found.");
			  }
    }


    // 连接钱包的handler
    const connectWalletHandler = async () => { 

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
      if (ethereum) {
		console.log(starcoinContract.address);
		console.log(starcoinContract.interface);
		console.log(await starcoinContract.name());
		console.log(await starcoinContract.totalSupply());
		console.log(await starcoinContract._mint(currentAccount,buyNum,0));
		let balance=await starcoinContract.balanceOf(currentAccount);
		setscBalance(balance.toNumber());
      } else {

      }
    } catch(err){
      console.log(err);
    }
  }

  // Step2. 捕获质押的数量
  const handleChange = evt => {
    // 可以直接捕获value
    try{
      setDepositNum(evt.target.value);
	  setBuyNum(evt.target.value);
    }catch(err){
      console.log(err);
    }
  }

  // Step3. 提交质押的StarCoin数量到合约
  const handleSubmit = async (evt) => {
	
    try{
		let lotteryOpen = await lotteryContract.getLotteryOpen();
		console.log(lotteryOpen===true?"开局":"结束或未开始");
		let enterTransaction=await lotteryContract.enter(1);
		console.log((enterTransaction).hash);
    }catch(err){
      console.log(err);
    }

    evt.preventDefault();
  }

  // Step4. 跟lottery合约交互，拿到是否存活的结果，并在前端显示
  const checkSurvivorHandler =  async () => {
		lotteryContract.on("AnnounceWinner", (_winner, _id, _amount, event) => {
			console.log('_winner:'+_winner);
			console.log('_id'+_id);
			console.log('_amount'+_amount);
			// 查看后面的事件触发器  Event Emitter 了解事件对象的属性
			console.log(event.blockNumber);
			// 4115004
		});
  }


  // --------------------------------------------------------------------------------------------//



  const deposit = () => {
    return (
      <form onSubmit={handleSubmit}>
        {/* <input type="number" value={depositNum} onChange={handleChange} /> */}
        <input type="number" min="0"  max="6" onChange={handleChange} />
        <input type="submit" value="Deposit"/>
      </form>
    )
  }

  useEffect(() => {
    //checkWalletIsConnected();
	onLoadHandle();
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
	  <div>
	  MATIC : StarCoin = 1 : 1
	  </div>
    </div>
  )
}

export default App;