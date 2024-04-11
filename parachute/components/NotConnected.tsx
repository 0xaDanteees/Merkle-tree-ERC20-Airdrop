'use client';
import { Alert } from "./ui/alert";
import { SquareArrowUpRight } from 'lucide-react';
const NotConnected = () => {
  return (
    <Alert  variant="destructive" className="bg-black text-red-500 font-bold text-center">
        Please connect your Wallet
        <SquareArrowUpRight className="h-7 w-7 invert"/>
    </Alert>
  )
}

export default NotConnected;