const GameItem = artifacts.require("GameItem");

module.exports = function (deployer) {
  deployer.deploy(GameItem);
};