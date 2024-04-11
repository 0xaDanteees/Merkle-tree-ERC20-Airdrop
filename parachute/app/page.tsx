"use client"
import Mint from "@/components/Mint";
import NotConnected from "@/components/NotConnected";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { useAccount } from "wagmi";

function Home() {

  const { address, isConnected } = useAccount();


  return (
    <div className="py-6 w-full">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 xl:gap-12">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Based Protocol Airdrop</h1>
            <div className="space-y-2 text-sm sm:text-base">
              <dl className="grid grid-cols-2 gap-1">
                <div className="font-medium">Token Name</div>
                <div className="text-right">BITKOIN</div>
                <div className="col-span-2">
                  <hr className="h-0.5 bg-gray-100 dark:bg-gray-800" />
                </div>
                <div className="font-medium">Token Symbol</div>
                <div className="text-right">TICKER</div>
              </dl>
            </div>
            <form className="grid gap-4 md:gap-8">
              
              {isConnected ? (
                
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="wallet">
                    Redeem now
                  </Label>
                  <Mint/>
                </div>
              ) : (
                
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="wallet">
                    Connect to redeem
                  </Label>
                  <NotConnected />
                </div>
              )}
                
    
            </form>
          </div>
          <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
            <div className="p-2">
              <img
                alt="Airdrop"
                className="aspect-[16/9] overflow-hidden rounded-xl object-cover object-center"
                Fill
                src="/airdrop.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;