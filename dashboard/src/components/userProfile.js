import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

const UserProfile = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  const formatAddress = (address) => {
    return address;
  };

  return (
    <div>
      <span className="text-sm">{formatAddress(address)}</span>
    </div>
    // <Link to={"/dashboard/profile"}>
    //   {/* <img
    //     src="/images/user-img.png"
    //     className="h-12 w-12 rounded-full"
    //     alt="img"
    //   /> */}
    //   <h1 >Profile</h1>
    // </Link>
  );
};

export default UserProfile;
