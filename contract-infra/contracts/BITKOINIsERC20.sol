// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract BITKOINIsERC20 is ERC20, Ownable {

    bytes32 public merkleRoot;
    uint256 private constant MINT_AMOUNT = 3*10**18; //3 ethers


    mapping(address=>bool) private hasMinted;

    constructor(address _owner, bytes32 _merkleRoot)
        ERC20("BITKOIN", "TICKER")
        Ownable(_owner)
    {
        merkleRoot= _merkleRoot;
    }


    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot=_merkleRoot;
    }

    function isWhitelisted(address _account, bytes32[] calldata _proof) internal view returns(bool) {

        bytes32 leaf = keccak256(abi.encode(keccak256(abi.encode(_account))));

        return MerkleProof.verify(_proof, merkleRoot, leaf);
    }

    function mint(address _to, bytes32[] calldata _proof) external {
        require(isWhitelisted(msg.sender, _proof), "Not elegible for airdrop.");
        require(!hasMinted[msg.sender], "Airdrop already claimed");

        hasMinted[msg.sender]=true;
        _mint(_to, MINT_AMOUNT);
    }
}



