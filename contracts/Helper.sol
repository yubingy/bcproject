pragma solidity ^0.4.19;

import "./Events.sol";

contract Helper is Events {

    modifier productIdsExist(bytes32[] _productIds) {
        bool allIdsExist = true;
        for (uint i = 0; i < _productIds.length; i++) {
            if (!productIdToProductStruct[_productIds[i]].exists) {
                allIdsExist = false;
                break;
            }
        }
        require(allIdsExist);
        _;
    }

    modifier productIdExists(bytes32 _productId) {
        require(productIdToProductStruct[_productId].exists);
        _;
    }

    modifier ownerOf(bytes32 _productId) {
        require(msg.sender == productIdToProductStruct[_productId].owner);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == ownerUser);
        _;
    }
    
    // request to transfer ownership
    function requestOwnershipTransfer(bytes32 _productId, address _newOwnerAddress) public {
        require(msg.sender == productIdToProductStruct[_productId].owner);
        productIdToProductStruct[_productId].nextAuthorizedOwnerAddress = _newOwnerAddress;
    }

    // accept ownership transfer
    function acceptOwnershipTransfer(bytes32 _productId) public {
        require(newOwnerStruct.accountAddress == productIdToProductStruct[_productId].nextAuthorizedOwnerAddress);
        Actor storage newOwnerStruct = actorAddressToActorStruct[msg.sender];
        productIdToProductStruct[_productId].nextAuthorizedOwnerAddress = 0;
        productIdToProductStruct[_productId].owner = newOwnerStruct.accountAddress;
    }
}
