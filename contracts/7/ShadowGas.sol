// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;

interface IGasToken {
    function name (  ) external view returns ( string memory);
    function freeFromUpTo ( address from, uint256 value ) external returns ( uint256 freed );
    function approve ( address spender, uint256 value ) external returns ( bool success );
    function totalSupply (  ) external view returns ( uint256 supply );
    function transferFrom ( address from, address to, uint256 value ) external returns ( bool success );
    function decimals (  ) external view returns ( uint8 );
    function freeFrom ( address from, uint256 value ) external returns ( bool success );
    function freeUpTo ( uint256 value ) external returns ( uint256 freed );
    function balanceOf ( address owner ) external view returns ( uint256 balance );
    function symbol (  ) external view returns ( string memory);
    function mint ( uint256 value ) external;
    function transfer ( address to, uint256 value ) external returns ( bool success );
    function free ( uint256 value ) external returns ( bool success );
    function allowance ( address owner, address spender ) external view returns ( uint256 remaining );
}

contract ShadowGas {

    /*

        State

    */

    IGasToken chi = IGasToken(0x0000000000004946c0e9F43F4Dee607b0eF1fA1c); // include gst1/gst2?

    address payable possessor;// contract owner
    mapping(uint => uint) purchaseHistory; // stores amount of tokens purchased and gas price at time of purchase (for trading)
    uint[] gasPriceAtPurchase;
    uint totalPurchases;

    constructor() {
        possessor = msg.sender;
        totalPurchases = 0;
    }

/* -------------------------------------------------------------------------- */


    /*

        Modifiers

    */

    modifier shadowPossession() {
        require(msg.sender == possessor, "You do not possess this Shadow");
        _;
    }

    // allows contract to burn chi
    modifier useGas() {
        uint gasStart = gasleft();
        _;
        uint gasSpent = 21000 + gasStart - gasleft() + 16 * msg.data.length;
        chi.freeFromUpTo(address(this), (gasSpent + 14154) / 41947);
    }

    //TODO: Control history by transaction number
    function updateHistory(uint _value, uint price) internal shadowPossession {

        // store purchase price and amount of tokens that were purchased
        gasPriceAtPurchase.push(price);
        purchaseHistory[gasPriceAtPurchase[totalPurchases]] += _value;
        totalPurchases++;

    }

    // uses gas tokens bought at higher prices first
    function removeFromHistory(uint amount, uint price) internal shadowPossession {
        require(purchaseHistory[gasPriceAtPurchase[price]] >= amount, "Not enough tokens purchased at price to remove amount from");

        if (purchaseHistory[gasPriceAtPurchase[price]] == amount) {
            delete purchaseHistory[gasPriceAtPurchase[price]];
            delete gasPriceAtPurchase[price];
            
            totalPurchases--;
        }

        if (purchaseHistory[gasPriceAtPurchase[price]] > amount) {
            purchaseHistory[gasPriceAtPurchase[price]] -= amount;
        }

    }

    function emptyHistory() internal shadowPossession {

        for (uint i = 0; i < totalPurchases; i++) {
            delete purchaseHistory[gasPriceAtPurchase[i]];
            delete gasPriceAtPurchase[i];
        }

        totalPurchases = 0;
    }

    /*

        TODO: Events

    */

/* -------------------------------------------------------------------------- */

    /*

        Tank Info
        ---------------------
        Gas Token Efficiencies
        y = 15000 * x / (20065 + 5065 * x) // GST1
        y = 24000 * x / (35974 + 6689 * x) // GST2
        y = 24000 * x / (35678 + 6053 * x) // CHI
    
    */

    // chi balance
    function tankAmount() public view returns (uint) {
        return chi.balanceOf(address(this));
    }

/* -------------------------------------------------------------------------- */


    /*

        Transfer

    */

    // transfer chi `_amount` back to possessor
    function emptyTank(uint _amount, uint price) public shadowPossession {
        require(chi.balanceOf(address(this)) >= _amount, "Tank does not have that much to empty");
        require(chi.approve(msg.sender, _amount), "Failed to approve chi amount");

        if (chi.balanceOf(address(this)) == _amount) {

            emptyHistory();

            chi.transfer(msg.sender, _amount);
        } else {

            removeFromHistory(_amount, price);

            chi.transfer(msg.sender, _amount);
        }

    }

    // transfer chi `_amount` to `address`
    // does not modify purchaseHistory
    function emptyTankTo(uint _amount, address to) public shadowPossession {
        require(chi.balanceOf(address(this)) >= _amount, "Tank does not have that much to empty");
        require(chi.approve(to, _amount), "Failed to approve chi amount");

        chi.transfer(to, _amount);
    }

/* -------------------------------------------------------------------------- */


    /*

        Store

    */

    // mint chi and store in contract
    function refuel(uint _value) public shadowPossession {
        require(_value > 0, "Value may not be 0, (Hint) Chi tokens require 0 decimal places");

        updateHistory(_value, tx.gasprice);

        chi.mint(_value);
    }

    // mint chai and transfer
    // does not modify purchaseHistory
    function refuelAt(uint _value, address to) public shadowPossession {
        require(_value > 0, "Value may not be 0, (Hint) Chi tokens require 0 decimal places");

        chi.mint(_value);
        emptyTankTo(_value, to);
    }



/* -------------------------------------------------------------------------- */

    /*

        TODO: Trade

    */

    // retrieves purchaseHistory
    function getFullHistory() public view shadowPossession returns (uint[] memory, uint[] memory) {

        uint[] memory amountBought = new uint[](totalPurchases);

        for (uint i = 0; i < totalPurchases; i++) {
            amountBought[i] = purchaseHistory[gasPriceAtPurchase[i]];
        }

        return (gasPriceAtPurchase, amountBought);

    }

}