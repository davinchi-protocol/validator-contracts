import React, { useState,useEffect } from "react";

import Modal from "../../components/Modal";
import Wrapper from "../../routes/Wrapper";
import { CopyIcon } from "../../assets/Icons";
import WithdrawModal from "../../components/WithdrawModal";
import SendModal from "../../components/SendModal";



import Web3 from "web3";
import {useNetwork,  useSwitchNetwork } from 'wagmi'
import { useAccount, useDisconnect } from 'wagmi'
import { cont_address,cont_abi } from "../../components/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { PiCoinsFill } from "react-icons/pi";
import { GoGraph, GoChecklist } from "react-icons/go";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdAccountBalanceWallet } from "react-icons/md";
import { TiGroupOutline } from "react-icons/ti";
import { BiSolidDiscount } from "react-icons/bi";
import { CiBadgeDollar } from "react-icons/ci";

const Main = () => {
  const [open, setOpen] = useState(false);
  const [openSend, setOpenSend] = useState(false);


  const [totalwithdraw, set_totalwithdraw] = useState(0);
  const [contract_DuBalance, set_contract_DuBalance] = useState(0);
  const [owner_DuBalance, set_owner_DuBalance] = useState(0);
  const [total_users, set_total_users] = useState(0);
  const [TotalStaked, set_TotalStaked] = useState(0);
  const [withdraw_amount, set_withdraw_amount] = useState(0);
  const [send_amount, set_send_amount] = useState(0);

  const [owner, set_owner] = useState("");

  const { address,isConnected, isConnecting ,isDisconnected} = useAccount()
  let count=0



  useEffect(()=>{
    if((count==0 ))
    {
      count++;
  
        test();
    }
  
  },[address,contract_DuBalance])
  
  const { config:withdrawFunds } = usePrepareContractWrite({
    address: cont_address,
    abi: cont_abi,
    functionName: 'withdrawFunds',
    args: [Number(withdraw_amount * 10 ** 18)],
  })
  const { config:sendFunds } = usePrepareContractWrite({
    address: cont_address,
    abi: cont_abi,
    functionName: 'addBalance',
    value: (Number(send_amount)*10**18).toString()
  })
    const { data:Result_withdrawFunds, isLoading2_withdrawFunds1, isSuccess2_withdrawFunds1, write:withdrawFunds1 } = useContractWrite(withdrawFunds)
    const { data:Result_sendFunds, isLoading2_sendFunds, isSuccess2_sendFunds, write:sendFunds1 } = useContractWrite(sendFunds)

    const waitForTransaction4 = useWaitForTransaction({
      hash: Result_withdrawFunds?.hash,
      async onSuccess(data) {
        await test();
        await toast("Withdraw Success");
        setOpen(false)
      },
    });

    const waitForTransaction5 = useWaitForTransaction({
      hash: Result_sendFunds?.hash,
      async onSuccess(data) {
        await test();
        await toast("Funding Success");
        setOpenSend(false)
      },
    });



  
    async function test(){
      const web3= new Web3(new Web3.providers.HttpProvider("https://rpc-mainnet.davinci.bz"));
    
                
      const contract=new web3.eth.Contract(cont_abi,cont_address);
      let contract_DuBalance = await web3.eth.getBalance(cont_address);
      contract_DuBalance= web3.utils.fromWei(contract_DuBalance,"ether")    
      let owner = await contract.methods.owner().call();  

      let TotalStaked = await contract.methods.totalbusiness().call();  
      TotalStaked= web3.utils.fromWei(TotalStaked.toString(),"ether")    

      let Totalwithdraw = await contract.methods.totalwithdraw().call();  
      Totalwithdraw= web3.utils.fromWei(Totalwithdraw.toString(),"ether")  

      let totalusers = await contract.methods.totalusers().call();  
      let owner_DuBalance;    
try{
   owner_DuBalance = await web3.eth.getBalance(address);
   owner_DuBalance= web3.utils.fromWei(owner_DuBalance.toString(),"ether")  

}catch(e){

}
    
      set_TotalStaked(TotalStaked)
      set_total_users(totalusers)
      set_owner_DuBalance(owner_DuBalance)
      set_contract_DuBalance(contract_DuBalance)
      set_totalwithdraw(Totalwithdraw)
      set_owner(owner)
  
    }  
  
  function check1()
  {
    if(!isConnected)
    {
      alert("kindly connect your owner wallet")
      return;
    }
    
    if(owner.toLowerCase()!=address.toLowerCase())
    {
      alert("only owner can withdraw the funds")
      return;
    }
    if(withdraw_amount==0 || withdraw_amount=="")
    {
      alert("kindly write amount")
      return;
    }
    withdrawFunds1?.()

  }
  function check()
  {

    if(!isConnected)
    {
      alert("kindly connect your owner wallet")
      return;
    }
    if(owner_DuBalance<send_amount)
    {
      alert("you have insufficient funds")
      return;
    }
    if(owner.toLowerCase()!=address.toLowerCase())
    {
      alert("only owner can send the funds")
      return;
    }
    if(send_amount==0 || send_amount=="")
    {
      alert("kindly write amount to send")
      return;
    }
    sendFunds1?.()

  }



  const dashboardList = [
    {
      img:  <PiCoinsFill className=" text-6xl" />,
      title: "Total Staked Validator",
      price: Number(TotalStaked).toFixed(2),
    },
    {
      img: <BiMoneyWithdraw className=" text-6xl" />,
      title: "Total Withdraw",
      price: Number(totalwithdraw).toFixed(2),
    },
    {
      img: <CiBadgeDollar className=" text-6xl" />,
      title: "Contract Balance",
      price: Number(contract_DuBalance).toFixed(2),
    },
    {
      img: <TiGroupOutline className=" text-6xl" />,
      title: "Total Stakers",
      price: total_users,
    },
    {
      img: <MdAccountBalanceWallet className=" text-6xl" />,
      title: "My Balance",
      price: Number(owner_DuBalance).toFixed(2),
    },

  ];
  return (
    <Wrapper>
      <div className="lading-page relative">
        <div className="wrap wrapWidth flex">
          <div className="dashboard-box">
            <div className="dashboard-header flex items-center justify-between gap-3">
              <h1 className="heading">Dashboard</h1>
            </div>
            <hr class="w-full border-black" />

            <div className="d-list flex ">
              <div className="flex flex-col items-center w-full">
                <div className="grid-wrap w-full grid lg:grid-cols-3 max-md:grid-cols-2 gap-5 max-md:gap-4">
                  {dashboardList.map((item, index) => (
                    <div
                      key={index}
                      className="d-box flex flex-col justify-center items-center "
                    >
                      
                      {item.img}
                      <h2 className="d-heading">{item.title}</h2>
                      <p className="d-par">{item.price}</p>
                      <div className="action flex items-center justify-end w-full gap-2">
                        <button
                          className={`btn-withdraw button ${
                            item.title === "Contract Balance" ? "show" : ""
                          }`}
                          onClick={(e) => setOpen(true)}
                        >
                          Withdraw
                        </button>
                        <button
                          className={`btn-withdraw button ${
                            item.title === "Contract Balance" ? "show" : ""
                          }`}
                          onClick={(e) => setOpenSend(true)}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div className="flex items-start">
                  <div className="d-link mt-10">
                    <p className="d-par">Referral Link : JQiwougLM2309A5</p>
                    <div
                      className="Icon"
                      onClick={() =>
                        navigator.clipboard.writeText("JQiwougLM2309A5")
                      }
                    >
                      <CopyIcon />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open}  onClose={() => setOpen(false)}>
        <WithdrawModal check1={check1} withdraw_amount={withdraw_amount} set_withdraw_amount={set_withdraw_amount}/>
      </Modal>
      <Modal open={openSend} onClose={() => setOpenSend(false)}>
        <SendModal check={check} send_amount={send_amount} set_send_amount={set_send_amount}/>
      </Modal>
      <ToastContainer />
    </Wrapper>
  );
};

export default Main;
