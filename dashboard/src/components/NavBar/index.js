import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { IoIosHome } from "react-icons/io";
import { BsCoin } from "react-icons/bs";
import { MdHistory } from "react-icons/md";

const NavBar = () => {
  const navBarItems = [
    { lbl: "Dashboard", slug: "/dashboard/home", img: <IoIosHome /> },
    {
      lbl: "Investment",
      slug: "/dashboard/stacking",
      img: <BsCoin />,
    },
    {
      lbl: "Transaction History",
      slug: "/dashboard/history",
      img: <MdHistory />,
    },
  ];
  return (
    <div className="nav-comp flex">
      <div className="wrap flex w-full">
        <div className="nav-links flex items-center w-full">
          {navBarItems.map((item, index) => (
            <div
              key={index}
              className={`nav-item flex items-center justify-center `}
            >
              <NavLink
                to={item.slug}
                className="icon flex items-center justify-center text-white"
              >
                {item.img}
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
