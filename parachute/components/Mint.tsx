"use client"

import { useState, useEffect } from "react";
import { contractAddress, contractABI, whitelisted } from "@/utils/constants";
import {
  useAccount, useReadContract,
  type BaseError, useWriteContract,
  useWaitForTransactionReceipt, useBalance
} from "wagmi";

import { formatEther } from "viem";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { Loader } from "lucide-react";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";

const Mint=()=>{

  const {address}=useAccount();
  const [merkleProof, setMerkleProof] = useState<string[]>([]);
  const [merkleError, setMerkleError] = useState<string>('');


  const {data: totalSupply, isLoading: totalSupplyLoading, refetch: refetchTotalSupply}= useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'totalSupply',
    account: address
  })

  const formatSupply= (supply: bigint | undefined)=>{

    if(supply!==undefined){
      return formatEther(supply);
    }
    return "0";
  }

  const {data: hash, error: airdropError, isPending, writeContract}=useWriteContract();

  const getAirdrop= async()=>{
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'mint',
      account: address,
      args: [address, merkleProof]
    });
  }

  const {isLoading: isConfirming, isSuccess: isConfirmed}=useWaitForTransactionReceipt({hash,});

  useEffect(()=>{
    isConfirmed && refetchTotalSupply();
  }, [isConfirmed]);

  useEffect(()=>{

    if(address){
      try{
        const tree= StandardMerkleTree.of(whitelisted, ["address"], {sortLeaves: true});
        const proof= tree.getProof([address]);
        setMerkleProof(proof);
      } catch {
        setMerkleError('Not elegible for airdrop.');
      }
    }
  }, []);

  return (
    <div>
      {totalSupplyLoading? (
        <div>
            <Loader/>
        </div>

      ): (
        <>
          <div className="justify-center">

                  Tokens to redeem: {formatSupply(totalSupply as bigint | undefined)} $TICKER
          </div>

          {merkleError?(
            <Alert variant="destructive" className="bg-black text-gray-200 font-bold text-center">
              {merkleError}
            </Alert>
          ): (
            <>
              {hash && (
                <Alert className="bg-black text-gray-200 font-bold text-center">
                  Hash: {hash}
                </Alert>
              )}
              {isConfirming && (
                <Alert className="bg-black text-gray-200 font-bold text-center">
                  Confirming TX...
                </Alert>
              )}
              {isConfirmed && (
                <Alert className="bg-black text-gray-200 font-bold text-center">
                  Tokens sent, check your wallet.
                </Alert>
              )}
              {airdropError && (
                <Alert variant="destructive" className="bg-black text-gray-200 font-bold text-center">
                  Error {(airdropError as BaseError).shortMessage || airdropError.message}
                </Alert>
              )}
              <Button onClick={()=>getAirdrop()} className="bg-black text-gray-200 font-bold text-center w-full">
                {isPending ? 'Minting...' : 'Mint'}
              </Button>
            </>
          )}
        </>
      )}
    </div>

  )
}

export default Mint;