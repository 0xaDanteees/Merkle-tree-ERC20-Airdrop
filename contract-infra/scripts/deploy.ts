import { ethers } from "hardhat";

// Types
import { BITKOINIsERC20 } from "../typechain-types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

// Whitelisted addresses
import { whitelist } from "../utils/whitelist";

async function main() {
  
  let contract: BITKOINIsERC20;
  let merkleTree: StandardMerkleTree<string[]>
  merkleTree = StandardMerkleTree.of(whitelist, ["address"], { sortLeaves: true });

  //let baseURI: string = "ipfs://CID/";

  const [owner] = await ethers.getSigners();                                            //, baseURI
  contract = await ethers.deployContract("BITKOINIsERC20", [owner.address,merkleTree.root]);

  await contract.waitForDeployment();

  console.log(
    `BITKOINIsERC20 deployed to ${contract.target} with merkleRoot ${merkleTree.root}`
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});