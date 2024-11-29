import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PiCopySimpleFill } from "react-icons/pi";
import { useLocation } from "react-router-dom";
import Loader from "../../components/Loader";

import Modal from "../../components/Modal";
import Wrapper from "../../routes/Wrapper";
import UserProfile from "../../components/userProfile";
import { CopyIcon } from "../../assets/Icons";
import WithdrawModal from "../../components/WithdrawModal";
import {
  cont_address,
  cont_abi,
} from "../../components/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiCoinsFill } from "react-icons/pi";
import { GoGraph, GoChecklist } from "react-icons/go";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdAccountBalanceWallet } from "react-icons/md";
import { TiGroupOutline } from "react-icons/ti";
import { BiSolidDiscount } from "react-icons/bi";
import { CiBadgeDollar } from "react-icons/ci";


import Web3 from "web3";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { useAccount, useDisconnect } from "wagmi";
import {
  useContractReads,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
const Main = ({
  loader,
  totalReward,
  totalInvestment,
  Total_withdraw,
  totalEarning,
  directs,
  team,
  set_regAddress,
  regAddress,
  totalRefIncome,
  test,
  minWithdraw,
  maxWithdraw,
}) => {
  const [open, setOpen] = useState(false);
  const [count, set_count] = useState(0);
  const [withdrawAmount, set_withdrawAmount] = useState(0);

  const notify = () => toast("Referral is Copied Successfully!");
  const depositnotify = () => toast("Deposit Address is Copied!");
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const { chain } = useNetwork();

  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const temp_address = params.get("address");
  // alert("hello "+regAddres)

  const { config: claimRewardConfig } = usePrepareContractWrite({
    address: cont_address,
    abi: cont_abi,
    functionName: "withdrawReward",
    args: [Number(withdrawAmount) * 10 ** 18],
  });

  const {
    data: stakeResult_withdrawReward,
    isLoading2_withdrawReward,
    isSuccess2_withdrawReward,
    write: withdrawReward,
  } = useContractWrite(claimRewardConfig);

  const networkId = 293;

  const waitForTransaction4 = useWaitForTransaction({
    hash: stakeResult_withdrawReward?.hash,
    async onSuccess(data) {
      await test();
      await toast("Withdraw Success");
      setOpen(false);
    },
  });

  const {
    chains,
    error,
    isLoading,
    pendingChainId,
    switchNetwork: reward_switch,
  } = useSwitchNetwork({
    chainId: networkId,
    // throwForSwitchChainNotSupported: true,
    onSuccess() {
      withdrawReward?.();
    },
  });

  function withdraw(_amount) {
    set_withdrawAmount(_amount);
    if (isDisconnected) {
      toast("Please connect your wallet");
      return;
    }

    if (_amount < Number(minWithdraw) / 10 ** 18) {
      toast(
        "You can't withdraw less than " +
          Number(minWithdraw) / 10 ** 18 +
          " DCOIN",
      );
      return;
    }
    if (_amount > Number(maxWithdraw) / 10 ** 18) {
      toast(
        "You can't withdraw more than " +
          Number(maxWithdraw) / 10 ** 18 +
          " DCOIN",
      );
      return;
    }
    if (regAddress.toLowerCase() != address.toLowerCase()) {
      toast("Change your account to " + regAddress);
      return;
    }
    if (_amount == 0) {
      toast("Please enter amount!");
      return;
    }

    if (Number(totalEarning) / 10 ** 18 < Number(_amount)) {
      toast("You dont have enough balance");
      return;
    }
    if (chain.id != networkId) {
      reward_switch?.();
    } else {
      withdrawReward?.();
    }
    // console.log(data__unstake);
  }

  const dashboardList = [
    {
      img: <PiCoinsFill className=" text-6xl" />,
      title: "My Validator Staking",
      price: (Number(totalInvestment) / 10 ** 18).toFixed(2),
    },
    {
      img: <GoGraph className=" text-6xl" />,
      title: "Validator Staking Reward",
      price: (Number(totalReward) / 10 ** 18).toFixed(2),
    },
    {
      img: <BiMoneyWithdraw className=" text-6xl" />,
      title: "Total Withdrawal",
      price: (Number(Total_withdraw) / 10 ** 18).toFixed(2),
    },
    {
      img: <MdAccountBalanceWallet className=" text-6xl" />,
      title: "Available Balance",
      price: (Number(totalEarning) / 10 ** 18).toFixed(2),
    },
    {
      img: <TiGroupOutline className=" text-6xl" />,
      title: "Team",
      price: team,
    },
    {
      img: <CiBadgeDollar className=" text-6xl" />,
      title: "Total Earning",
      price: (
        (Number(totalEarning) + Number(Total_withdraw)) /
        10 ** 18
      ).toFixed(2),
    },
  ];

  // const dashboardList = [
  //   {
  //     img: "../images/financial.png",
  //     title: "My Staking",
  //     price: Convert_To_eth(totalInvestment),
  //   },
  //   {
  //     img: "../images/gift.png",
  //     title: "Staking Reward",
  //     price: Convert_To_eth(totalReward),
  //   },
  //   {
  //     img: "../images/cash-withdrawal.png",
  //     title: "Total Withdrawal",
  //     price: Convert_To_eth(Total_withdraw),
  //   },
  //   {
  //     img: "../images/award.png",
  //     title: "Available Balance",
  //     price: Convert_To_eth((totalEarning-Total_withdraw)),
  //   },
  //   {
  //     img: "../images/medal.png",
  //     title: "Direct Reward",
  //     price: Convert_To_eth(totalRefIncome),
  //   },
  //   {
  //     img: "../images/reward.png",
  //     title: "Team",
  //     price: team,
  //   },

  //   {
  //     img: "../images/cashback.png",
  //     title: "Total Directs",
  //     price: directs,
  //   },
  //   {
  //     img: "../images/wallet.png",
  //     title: "Total Earning",
  //     price: Convert_To_eth(totalEarning),
  //   },
  // ];

  // useEffect(()=>{
  //   if(count==0)
  //   {
  //     console.log("hello home ");
  //   set_count(1);

  //   }

  // },[])

  return (
    <Wrapper>
      <div className="lading-page relative">
        <div className="wrap wrapWidth flex">
          <div className="dashboard-box">
            <div className="dashboard-header flex items-center justify-between gap-3">
              <h1 className="heading">Dashboard</h1>
              {/* <UserProfile /> */}
            </div>
            <hr class="w-full border-black" />
            <div className="d-list flex flex-col">
              <div className="grid-wrap grid lg:grid-cols-3 max-md:grid-cols-2 gap-5 max-md:gap-4">
                {dashboardList.map((item, index) => (
                  <div
                    key={index}
                    className="d-box flex flex-col justify-center items-center "
                  >
                    <div className="action flex items-center justify-end w-full">
                      <button
                        className={`btn-withdraw button ${
                          item.title === "Available Balance" ? "show" : ""
                        }`}
                        onClick={(e) => setOpen(true)}
                      >
                        Withdraw
                      </button>
                    </div>
                    {item.img}
                    <h2 className="d-heading">{item.title}</h2>
                    <p className="d-par">{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="d-link mt-10">
                <p className="d-par">
                  Referral Link : {window.location.origin}/auth/register/?ref=
                  {regAddress
                    ? regAddress.slice(0, 4) + "...." + regAddress.slice(38, 42)
                    : "Please connect"}
                </p>
                <CopyToClipboard
                  text={`${window.location.origin}/auth/register/?ref=${regAddress}`}
                >
                  <button className="copy-icon flex items-center justify-center">
                    <PiCopySimpleFill
                      color="white"
                      className=" text-2xl"
                      onClick={notify}
                    />
                  </button>
                </CopyToClipboard>
              </div>
              <div className="d-link mt-2">
                <p className="d-par">
                  Deposit Address : 0xBF88cef66C821B95fb3A1755772908Fa06Ab4346
                </p>
                <CopyToClipboard
                  text={`Deposit Address Copied Successfully!`}
                >
                  <button className="copy-icon flex items-center justify-center">
                    <PiCopySimpleFill
                      color="white"
                      className=" text-2xl"
                      onClick={depositnotify}
                    />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
      {loader && <Loader />}
      <Modal open={open} onClose={() => setOpen(false)}>
        <WithdrawModal withdraw={withdraw} />
      </Modal>
      
    </Wrapper>
  );
};

export default Main;
