const ConvertLib = artifacts.require("ConvertLib");
const MyCoin = artifacts.require("MyCoin");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MyCoin);
  deployer.deploy(MyCoin);
};
