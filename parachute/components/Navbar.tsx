"use client"

import React from 'react';
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';


const Navbar = () => {

    return (
        <div className="z-10 bg-background fixed top-0 flex items-center w-full p-4 border-b shadow-sm">
        
            <div className="container flex max-w-screen items-center justify-between px-2 py2">
                <Link href="/" className="cursor-pointer text-xl flex items-center p-3 font-extrabold">
                    Parachute
                </Link>
                
                    <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                       <ConnectButton/>
                    </div>
            </div>
       
        </div>
    );
};

export default Navbar;
