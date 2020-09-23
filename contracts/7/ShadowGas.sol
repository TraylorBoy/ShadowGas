// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;

import "../6/ILGT.sol";

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

// TODO: Add functionality for GST
// TODO: Reduce contract gas usage

contract ShadowGas {

    /*

        State

    */

    address payable possessor;// contract owner
    address constant CHI = 0x0000000000004946c0e9F43F4Dee607b0eF1fA1c; // 1inch Chi Token
    address constant LGT = 0x000000000000C1CB11D5c062901F32D06248CE48; // Liquid Gas Token
    address constant GST = 0x0000000000b3F879cb30FE243b4Dfee438691c04; // Gas Token

    IGasToken chi = IGasToken(CHI);
    IGasToken gst = IGasToken(gst);
    ILGT lgt = ILGT(LGT);

    constructor() {
        possessor = msg.sender;
    }

    receive() external payable {}

/* -------------------------------------------------------------------------- */


    /*

        Modifiers

    */

    modifier shadowPossession() {
        require(msg.sender == possessor, "You do not possess this Shadow");
        _;
    }

    modifier lgtDiscount() {
        uint gasStart = gasleft();
        _;
        uint gasSpent = (gasStart - gasleft() + 55000) / 41300;

        uint buyCost = lgt.getEthToTokenOutputPrice(gasSpent);

        if (buyCost < ((18145 * gasSpent) - 24000) * tx.gasprice) {
            lgt.buyAndFree(gasSpent, block.timestamp, msg.sender);
        }
    }

/* -------------------------------------------------------------------------- */

    /*

        Events

    */

    event LgtRefueled(uint _amount, address _refueler, uint _lgtBalance);
    event LgtEmptied(uint _amount, address _emptier, uint _lgtBalance);
    event ChiRefueled(uint _amount, address _refueler, uint _chiBalance);
    event ChiEmptied(uint _amount, address _emptier, uint _chiBalance);

/* -------------------------------------------------------------------------- */

    /*

        Store

    */

    function tankChi() public view returns (uint) {
        return chi.balanceOf(address(this));
    }


    function tankLgt() public view returns (uint) {
        return lgt.balanceOf(address(this));
    }

    function refuelChi(uint _amount) public shadowPossession returns (bool) {
        require(_amount > 0, "Value may not be 0, (Hint) Chi tokens require 0 decimal places");

        chi.mint(_amount);

        require(chi.balanceOf(address(this)) >= _amount, "Minting chi failed");

        emit ChiRefueled(_amount, msg.sender, chi.balanceOf(address(this)));

        return true;
    }

    function refuelLgt(uint _amount) public shadowPossession returns (bool) {
        require(_amount > 0, "Value may not be 0");

        lgt.mint(_amount);

        require(lgt.balanceOf(address(this)) >= _amount, "Minting lgt failed");

        emit LgtRefueled(_amount, msg.sender, lgt.balanceOf(address(this)));

        return true;
    }


/* -------------------------------------------------------------------------- */


    /*

        Transfer

    */

    function emptyChiTank(uint _amount) public shadowPossession returns (bool) {
        require(chi.balanceOf(address(this)) >= _amount, "Tank does not have that much to empty");
        require(chi.approve(msg.sender, _amount), "Failed to approve chi amount");

        chi.transfer(msg.sender, _amount);

        emit ChiEmptied(_amount, msg.sender, chi.balanceOf(address(this)));

        return true;
    }

    function emptyLgtTank(uint _amount) public shadowPossession returns (bool) {
        require(lgt.balanceOf(address(this)) >= _amount, "Tank does not have that much to empty");
        require(lgt.approve(msg.sender, _amount), "Failed to approve chi amount");

        lgt.transfer(msg.sender, _amount);

        emit LgtEmptied(_amount, msg.sender, lgt.balanceOf(address(this)));

        return true;
    }

    function emptyChiTankTo(uint _amount, address _to) public shadowPossession returns (bool) {
        require(chi.balanceOf(address(this)) >= _amount, "Tank does not have that much to empty");
        require(chi.approve(_to, _amount), "Failed to approve chi amount");

        chi.transfer(_to, _amount);

        return true;
    }

    function emptyLgtTankTo(uint _amount, address _to) public shadowPossession returns (bool) {
        require(lgt.balanceOf(address(this)) >= _amount, "Tank does not have that much to empty");
        require(lgt.approve(_to, _amount), "Failed to approve chi amount");

        lgt.transfer(_to, _amount);

        return true;
    }

/* -------------------------------------------------------------------------- */

    /*

        Trade
        
    */

    // Algorithm 6, Nadler's thesis (Liquid Gas Token) Pg.40
    function lgtTradeInfo(uint _amount) public view returns (uint, uint, bool) {

        uint profit = lgt.getTokenToEthInputPrice(_amount);

        uint gasCost = (39141 + 36224 * _amount + 55000) * tx.gasprice; // 55000 - overhead

        bool isProfitable = false;

        if (profit > gasCost) {
            isProfitable = true;
        }

        return (profit, gasCost, isProfitable);

    }

    // LGT ARBITRAGE
    function lgtArb(uint _amount) public payable shadowPossession {

        lgt.mintToSellTo(_amount, msg.value, block.timestamp, msg.sender);

    }

    // LGT BUY LOW SELL HIGH
    function lgtBuyLow(uint _amount) public payable shadowPossession returns (uint) {

        lgt.mint(_amount);

        return (39141 + 36224 * _amount + 55000) * tx.gasprice;
    }

    function lgtSellHigh(uint _amount, uint initialGasCost) public payable shadowPossession {

        uint profit = lgt.getTokenToEthInputPrice(_amount);

        if (profit > initialGasCost) {
            require(lgt.free(_amount), "Failed freeing amount");
            msg.sender.transfer(address(this).balance);
        }

    } 


    // TODO: Trade Chi & GST 

}