import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, assert } from "chai";
import {ethers} from "hardhat";

import { BITKOINIsERC20 } from "../typechain-types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {StandardMerkleTree} from "@openzeppelin/merkle-tree";

import { whitelist } from "../utils/whitelist";
import 'solidity-coverage';

describe("BITKOINIsERC20 Tests", function(){

  let contract: BITKOINIsERC20;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress; //This aint wl'd

  let merkleTree: StandardMerkleTree<string[]>

  async function deployContractFixture() {
    const [owner, addr1,addr2]= await ethers.getSigners();

    merkleTree=StandardMerkleTree.of(whitelist, ["address"], {sortLeaves: true});

    const contractFactory= await ethers.getContractFactory("BITKOINIsERC20");

    const contract = await contractFactory.deploy(owner.address, merkleTree.root);

    return {contract, merkleTree, owner, addr1, addr2}
  }

  describe("Deployment", function(){
    it('should deploy smart contract', async function(){
      const {contract, merkleTree, owner, addr1, addr2}= await loadFixture (deployContractFixture);

      let contractMerkleTreeRoot= await contract.merkleRoot();

      assert(contractMerkleTreeRoot===merkleTree.root);
      let contractOwner= await contract.owner();

      assert(contractOwner===owner.address);
    })
  })

  describe("Mint", function(){
    it('should mint ONLY IF whitlisted', async function(){
      const {contract, merkleTree, owner, addr1,addr2}= await loadFixture(deployContractFixture);

      try {
        const proof= merkleTree.getProof([addr2.address]);
        expect.fail("Expected an error 'Error: Leaf is not in tree' but none was thrown.");
      } catch(error){
        const err= error as Error;
        expect(err.message).to.include('Leaf is not in tree');
      }
    })

    it('shouldnt mint if addy not in WL', async function(){
      const {contract,merkleTree, owner,addr1,addr2}=await loadFixture(deployContractFixture);
      const proof: string[]= [];
      await expect(contract.connect(addr2).mint(addr2.address,proof)).to.be.revertedWith('Not elegible for airdrop.');
    } )

    it("shouldnt mint tokens if claimed already", async function(){

      const {contract,merkleTree, owner,addr1,addr2}=await loadFixture(deployContractFixture);
      const proof= merkleTree.getProof([addr1.address]);

      await contract.connect(addr1).mint(addr1.address,proof);

      await expect(contract.connect(addr1).mint(addr1.address,proof)).to.be.revertedWith('Airdrop already claimed');
    })

    it("should mit if user is WL and hasnt not claim", async function(){
      const {contract,merkleTree, owner,addr1,addr2}=await loadFixture(deployContractFixture);
      const proof= merkleTree.getProof([addr1.address]);
      await contract.connect(addr1).mint(addr1.address,proof);

      let balance= await contract.balanceOf(addr1.address);
      let expectedBalance= ethers.parseEther('3');

      assert(balance===expectedBalance);

    })
  })


  describe("setMerkleRoot", function(){
    it('should not set merkle root if caller is not owner', async function(){
      const {contract,merkleTree, owner,addr1,addr2}=await loadFixture(deployContractFixture);
      
      await expect(contract.connect(addr1)
      .setMerkleRoot(merkleTree.root))
      .to.be.revertedWithCustomError(contract,"OwnableUnauthorizedAccount")
      .withArgs(addr1.address)
    })

    it('should set root if caller is owner', async function(){

      const {contract,merkleTree, owner,addr1,addr2}=await loadFixture(deployContractFixture);
      let newMerkleRoot= "0x6f81d219b2c7a655d6b202f0a3b4cde5a885f9d619ef2913b09a83e35f08624d";
      await contract.setMerkleRoot(newMerkleRoot);

      let contractMerkleRoot= await contract.merkleRoot();
      assert(newMerkleRoot===contractMerkleRoot);
    })
  })
})