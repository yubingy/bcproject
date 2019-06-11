pragma solidity ^0.4.19;


contract Model {
    mapping (bytes32 => Product) public productIdToProductStruct; // access a product struct directly from an ID
    bytes32[] public productIds; // access all product IDs

    mapping (bytes32 => ProductVersion) public versionIdToVersionStruct; // access a version struct from a version ID
    bytes32[] public productVersionIds; // access all version IDs

    mapping (address => bytes32[]) public ownerToProductsId; // access an account's products

    mapping (address => Actor) public actorAddressToActorStruct; // access an struct from its Eth address
    address[] public actorAddresses; // access all addresses

    mapping (bytes32 => Certification) public certificationIdToCertificationStruct; // access a version struct from a version ID
    bytes32[] public certificationIds; // access all version IDs

    
    address public ownerUser;
    address[] public certifingUsers;

    mapping (address => bytes32[]) certifiersAddressToCertificationIds; // Certifing Actors to their certifications IDs

    struct ProductVersion {
        bytes32 versionId;
        bytes32 previousVersionId;
        uint creationDate;
        address owner; // used to keep track of who owned the product at that version
        string holder;
        string customJsonData;
    }
    
    struct Product {
        bool exists; // used to check if the product exists
        bool archived; 

        bytes32 productId;
        bytes32 latestVersionId;
        bytes32[] versions;
        bytes32[] certificationsIds;
        
        address owner;
        address nextAuthorizedOwnerAddress;

        string name;
        string description;
        string selectedCategory;

    }

    struct Certification {
        bytes32 certificationId;
        string name;
        string imageUrl;
    }

    struct Actor {
        bytes32 actorId;
        string name;
        address accountAddress; // Ethereum address
        string physicalAddress; // Physical address, may be separated (more costly)
    }

    
}
