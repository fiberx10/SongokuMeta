// main.js
//import Web3 from "web3";
//await Moralis.enableWeb3();
//const Web3 = new Web3(Moralis.provider);
const serverUrl = "https://kxzroy7cf4fz.usemoralis.com:2053/server";
const appId = "EsOJBXf8kC6NYyNgVu0jAEstUFjENmX25F6jzBdS";
Moralis.start({ serverUrl, appId });
var wallet = ""
var result = ""
/** Add from here down */

const ABI = [{"inputs":[{"internalType":"contract ERC721","name":"_nft","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyRedeemed","type":"error"},{"inputs":[],"name":"NotOwner","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"claimer","type":"address"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"TransferReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"address","name":"_destAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"TransferSent","type":"event"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deluxeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"ercbalance","outputs":[{"internalType":"uint256","name":"cbalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"executiveAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"hasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_nftlist","type":"uint256[]"}],"name":"isClaimedArray","outputs":[{"internalType":"uint256[]","name":"_unclaimed","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isclaimed","outputs":[{"internalType":"bool","name":"claimednft","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"standardAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"}],"name":"transferERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"villaAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"withrawamount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];



async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "NFT Claim status verification" })
      console.log(user)
      console.log(user.get('ethAddress'))
      wallet = user.get('ethAddress')
   } catch(error) {
     console.log(error)
   }
  }
}
async function authenticate(){
try {
  //web3 = await Moralis.Web3.enable({provider: 'walletconnect'});
  user = await Moralis.Web3.authenticate({signingMessage: "Witlink NFT Check for ERC20 claim", provider: 'metamask'});
  web3 = await Moralis.enableWeb3({provider: 'metamask'});
  const chainId = "0x1"; //Ethereum Mainnet
  const chainIdHex = await Moralis.switchNetwork(chainId);
  document.getElementById("authdiv").style.display = "none";
  document.getElementById("selectNftDiv").style.display = "flex";
  document.getElementById("claimdiv").style.display = "flex";
} catch(error) {
    console.log('authenticate failed', error);
}

}
async function isnftclaimed(){
  var select = document.getElementById("selectNft");
  var _tokenid = select.value;
  console.log(_tokenid);
  const readOptions = {
    contractAddress: "0xab9082a8BBf02cabaA04263Df2063BF314C3b7FA",
    functionName: "isclaimed",
    abi: ABI,
    params: {
      tokenId: _tokenid
    }
  }; 
  nftcheckres = await Moralis.executeFunction(readOptions);
  if (nftcheckres){
    document.getElementById("veriftext").innerText = "WAI TOKEN HAVE BEEN CLAIMED FOR THIS TOKEN";
    document.getElementById("veriftext").style.visibility = "visible";
    document.getElementById("veriftext").style.color = "green";
    document.getElementById("verif").src = "img/true.png";
    document.getElementById("verif").style.visibility = "visible";
  }else{
    document.getElementById("veriftext").innerText = "WAI TOKEN HAVEN'T BEEN CLAIMED FOR THIS TOKEN";
    document.getElementById("veriftext").style.visibility = "visible";
    document.getElementById("veriftext").style.color = "red";
    document.getElementById("verif").src = "img/false.png";
    document.getElementById("verif").style.visibility = "visible";
  }
}

async function logOut() {
  document.getElementById("veriftext").style.visibility = "hidden";
  document.getElementById("statusimg").style.visibility = "hidden";
  document.getElementById("statustxt").style.visibility = "hidden";
  document.getElementById("verif").style.visibility = "hidden";
  await Moralis.User.logOut();
  console.log("logged out");
}
async function main() {
  document.getElementById("verif").style.visibility = "hidden";

  await logOut();
  await authenticate();
}

document.getElementById("auth").onclick = main;
document.getElementById("claimtok").onclick = isnftclaimed;
