pragma solidity ^0.4.19;

import "./Helper.sol";
import "./Dictionary.sol";

contract Main is Helper {
        
    using DictionaryBytes32Uint for DictionaryBytes32Uint.Data;
    DictionaryBytes32Uint.Data private dic;    

    function Main() public {
      ownerUser = msg.sender;
    }
    
    function updateOwnerUser(address _newOwnerAddress) public onlyOwner {
        require(_newOwnerAddress != address(0));
        ownerUser = _newOwnerAddress;
    }

    function isUserOwner() external view returns (bool) {
        return ownerUser == msg.sender;
    }

    function createCertification(
        string _name,
        string _imageUrl,
        address _certificationOwner
    ) public returns (bytes32 certificationId) {
    
        bytes32 newCertificationId = keccak256(now, _name, msg.sender);

        var certification = certificationIdToCertificationStruct[newCertificationId];

        certification.certificationId = newCertificationId;
        certification.name = _name;
        certification.imageUrl = _imageUrl;

        certificationIds.push(newCertificationId);

        certifiersAddressToCertificationIds[_certificationOwner == address(0) ? msg.sender : _certificationOwner].push(newCertificationId);

        return newCertificationId;
    }

    function getAllCertificationsIds() external view returns (bytes32[] certificationsIds) {
        return certificationIds;
    }

    function getActorCertificationsIds() external view returns (bytes32[] certificationsIds) {
        return certifiersAddressToCertificationIds[msg.sender];
    }

    function getCertificationById(bytes32 _certificationId) external view returns (string name, string imageUrl) {

        Certification storage certification = certificationIdToCertificationStruct[_certificationId];
        return (certification.name, certification.imageUrl);
    }

    function getVersionHolderById(bytes32 _versionId) external view returns (string holder) {

        ProductVersion storage version = versionIdToVersionStruct[_versionId];
        return (version.holder);
    }

    function createProduct(
      string _name,
      string _description,
      string _selectedCategory,
      string _holder,
      bytes32[] _certificationsIds,
      string _customJsonData
    ) public returns (bytes32 productId) {
    
        // Generate a pseudo-random product ID
        bytes32 newProductId = keccak256(now, msg.sender);

        var product = productIdToProductStruct[newProductId];

        product.productId = newProductId;
        product.latestVersionId = "0"; 
        product.versions = new bytes32[](0); 
        product.archived = false;
        product.owner = msg.sender;

        product.name = _name;
        product.description = _description;
        product.selectedCategory = _selectedCategory;

        product.certificationsIds = _certificationsIds;

        productIds.push(newProductId);
        ownerToProductsId[msg.sender].push(newProductId);
        updateProduct(newProductId, _holder, _customJsonData);

        // Fire an event to announce the creation
        ProductCreated(newProductId, msg.sender);

        return newProductId;
    }

    function updateProduct(
      bytes32 _productId, 
      string _holder,
      string _customJsonData
    ) public productIdExists(_productId) {

        // Get product from storage works like traditional db
        Product storage product = productIdToProductStruct[_productId];

        // Generate a pseudo-random product ID
        bytes32 newVersionId = keccak256(now, msg.sender, _productId);

        var version = versionIdToVersionStruct[newVersionId];

        version.versionId = newVersionId;
        version.creationDate = now;
        version.previousVersionId = product.latestVersionId;
        version.owner = product.owner;

        version.holder = _holder;
        version.customJsonData = _customJsonData;

        productVersionIds.push(newVersionId);
        product.versions.push(newVersionId);

        product.latestVersionId = newVersionId;
    }

    function getProductById(bytes32 _productId, bytes32 specificVersionId) external view productIdExists(_productId)
    returns (string name, string description, string selectedCategory, string _holder, uint versionCreationDate, bytes32[] versions, bytes32[] certificationsIds) {

      Product storage product = productIdToProductStruct[_productId];

      ProductVersion storage requestedVersion;

      if (specificVersionId == "latest") {
        requestedVersion = versionIdToVersionStruct[product.latestVersionId];

      } else {
        requestedVersion = versionIdToVersionStruct[specificVersionId];
      }
      return (product.name, product.description, product.selectedCategory, requestedVersion.holder, requestedVersion.creationDate, product.versions, product.certificationsIds);

    }

    function getProductCustomDataById(bytes32 _productId, bytes32 specificVersionId) external view productIdExists(_productId)
    returns (string customJsonData) {

        Product storage product = productIdToProductStruct[_productId];

        ProductVersion storage requestedVersion;

        if (specificVersionId == "latest") {
          requestedVersion = versionIdToVersionStruct[product.latestVersionId];

        } else {
          requestedVersion = versionIdToVersionStruct[specificVersionId];
        }

        return (requestedVersion.customJsonData);

    }


    function getOwnerProducts() external view returns (bytes32[] productsIds) {

        bytes32[] memory ownedProductsIds = ownerToProductsId[msg.sender];
        bytes32[] memory activeProducts = new bytes32[](ownedProductsIds.length);

        for (uint i = 0; i < ownedProductsIds.length; ++i) {
            if (!productIdToProductStruct[ownedProductsIds[i]].archived) {
                activeProducts[i] = ownedProductsIds[i];
            }
        }

        return activeProducts;
    }
    
}
