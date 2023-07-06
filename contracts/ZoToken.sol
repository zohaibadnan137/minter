// SPDX-License-Identifier: MIT
// Author: @zohaibadnan137

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ZoToken is ERC721 {
    uint256 private _tokenCounter;

    mapping(uint256 => address) private _tokenOwners;
    mapping(address => uint256[]) private _ownedTokens;

    constructor() ERC721("ZoToken", "ZOTO") {
        _tokenCounter = 0;
    }

    function mintToken(address to, uint256 numberOfTokens) external {
        require(
            to != address(0),
            "Error! The address to mint to must not be the zero address."
        );
        require(
            numberOfTokens > 0,
            "Error! The number of tokens to mint must be greater than zero"
        );

        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 tokenId = _tokenCounter;
            _safeMint(to, tokenId);
            _tokenOwners[tokenId] = to;
            _ownedTokens[to].push(tokenId);
            _tokenCounter++;
        }
    }

    function getOwnedTokens(
        address owner
    ) external view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }
}
