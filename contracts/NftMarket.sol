// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is Ownable, ERC721URIStorage {
    uint256 private _nextTokenId;

    struct Listing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => Listing) private _listings;

    event NFTCreated(uint256 indexed tokenId, address owner, string tokenURI);
    event NFTListed(uint256 indexed tokenId, address seller, uint256 price);
    event NFTSaleCancelled(uint256 indexed tokenId, address seller);

    constructor(address initialOwner) 
        ERC721("NFTMarketplace", "NFTM")
        Ownable(initialOwner)
    {}

    // Mint a new NFT
    function createNFT(string memory tokenURI) public  returns (uint256) {
        uint256 newItemId = _nextTokenId++;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTCreated(newItemId, msg.sender, tokenURI);
        return newItemId;
    }

    // List an NFT for sale
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "You do not own this NFT");
        require(!_listings[tokenId].isListed, "This NFT is already listed");
        require(price > 0, "Price must be greater than zero");

        // Transfer the NFT to the marketplace contract
        transferFrom(msg.sender, address(this), tokenId);

        _listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            isListed: true
        });

        emit NFTListed(tokenId, msg.sender, price);
    }

    // Cancel an NFT listing
    function cancelListing(uint256 tokenId) public {
        require(_listings[tokenId].isListed, "This NFT is not listed for sale");
        require(_listings[tokenId].seller == msg.sender, "You are not the seller");

        // Transfer the NFT back to the seller
        _transfer(address(this), msg.sender, tokenId);

        _listings[tokenId].isListed = false;

        emit NFTSaleCancelled(tokenId, msg.sender);
    }

    // Purchase an NFT
    function buyNFT(uint256 tokenId) public payable  {
        Listing storage listing = _listings[tokenId];
        require(listing.isListed, "This NFT is not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        address payable seller = listing.seller;
        listing.isListed = false;

        // Transfer the NFT to the buyer
        _transfer(address(this), msg.sender, tokenId);
        seller.transfer(msg.value);
    }

    // View all listed NFTs
    function getListedNFTs() public view returns (Listing[] memory) {
        uint256 totalItems = _nextTokenId;
        uint256 listedCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItems; i++) {
            if (_listings[i].isListed) {
                listedCount += 1;
            }
        }

        Listing[] memory items = new Listing[](listedCount);
        for (uint256 i = 0; i < totalItems; i++) {
            if (_listings[i].isListed) {
                items[currentIndex] = _listings[i];
                currentIndex += 1;
            }
        }

        return items;
    }

    // View NFTs owned by a user
    function getUserNFTs(address user) public view returns (uint256[] memory) {
        uint256 totalItems = _nextTokenId;
        uint256 ownedCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItems; i++) {
            if (ownerOf(i) == user) {
                ownedCount += 1;
            }
        }

        uint256[] memory items = new uint256[](ownedCount);
        for (uint256 i = 0; i < totalItems; i++) {
            if (ownerOf(i) == user) {
                items[currentIndex] = i;
                currentIndex += 1;
            }
        }

        return items;
    }

    // Get the listing information for an NFT
    function getListing(uint256 tokenId) public view returns (Listing memory) {
       return _listings[tokenId];
    }
}
