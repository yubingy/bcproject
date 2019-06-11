pragma solidity ^0.4.19;

import "./Model.sol";

contract Events is Model {

    event ProductCreated(bytes32 newProductId, address indexed owner);
}
