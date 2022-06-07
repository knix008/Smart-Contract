pragma solidity ^0.5.0;
contract valueChecker
{
    uint price=10;
    event valueEvent(bool returnValue);

    function Matcher (uint8 x) public returns (bool)
    {
        if (x>=price)
        {
            emit valueEvent(true);
            return true;
        }
    }
}

