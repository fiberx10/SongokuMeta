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
      user = await Moralis.authenticate({ signingMessage: "Witlink NFT Check for ERC20 claim" })
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
} catch(error) {
    console.log('authenticate failed', error);
}

}
async function isnftclaimed(_tokenids){
  const readOptions = {
    contractAddress: "0xab9082a8BBf02cabaA04263Df2063BF314C3b7FA",
    functionName: "isClaimedArray",
    abi: ABI,
    params: {
      _nftlist: _tokenids
    }
  }; 
  nftcheckres = await Moralis.executeFunction(readOptions);
  return nftcheckres;
}

async function claimtoken() {
  //var select = document.getElementById("selectNft");
  var selected = [];
  let out = "[";
    for (var option of document.getElementById("selectNft").options)
    {
        if (option.selected) {
            selected.push(option.value);
            out+= "'"+option.value+"'";
        }
    }
    out = "]";
  //const output = selected.map(i => i.int());
  let selectedstr = selected.toString().replaceAll(`"`, ``);
  //selectedstr = '['+selectedstr+']';
  console.log(selectedstr);
  const sendOptions = {
    chain: "eth",
    contractAddress: "0xab9082a8BBf02cabaA04263Df2063BF314C3b7FA",
    functionName: "transferERC20",
    abi: ABI,
    params: {
      token:"0x5281a43403B9a537520Bcb67e98A717c6ff13eA2" ,tokenId: selected
    },
  };
  const transaction = await Moralis.executeFunction(sendOptions);
  console.log(transaction.hash);
    // Wait until the transaction is confirmed
  //await transaction.wait();
  //console.log("ERC20 Token sent")
  document.getElementById("veriftext").innerText = "TOKEN SENT TO YOUR WALLET ADDRESS";
  document.getElementById("veriftext").style.visibility = "visible";
  document.getElementById("claimdiv").style.display = "none";
  document.getElementById("selectNftDiv").style.display = "none";
  document.getElementById("claimanotherdiv").style.display = "flex";
  document.getElementById("transactionlink").href= "https://etherscan.io/tx/"+transaction.hash;
  document.getElementById("transactionlink").style.visibility = "visible";
  await transaction.wait();
}

async function getNFTs() {
  const options = { chain: "eth", address: wallet, token_address: "0xbfce321046aaf5879c74cc4555db8fd9629fde92" };
  const polygonNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
  result = polygonNFTs;
  //const unclaimednfts = [];
  if (result.total > 0) {
    document.getElementById("veriftext").style.visibility = "visible";
    document.getElementById("veriftext").style.color = "green";
    document.getElementById("verif").src = "img/true.png";
    document.getElementById("verif").style.visibility = "visible";
    document.getElementById("authdiv").style.display = "none";
    document.getElementById("claimdiv").style.display = "flex";
    document.getElementById("selectNftDiv").style.display = "flex";
    console.log(result.result.map(a => a.token_id))
    unclaimednfts = await isnftclaimed(result.result.map(a => a.token_id))
    
    var select = document.getElementById("selectNft");
    for(var i = 0; i < unclaimednfts.length; i++) {
      if(unclaimednfts[i]!=0){
        
        var opt = unclaimednfts[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
  }
    
    
    //const transaction = await Moralis.executeFunction(sendOptions);
    //console.log(transaction.hash);
    // Wait until the transaction is confirmed
    //await transaction.wait();
    
    // Read new value
    //const message = await Moralis.executeFunction(readOptions);
    //console.log(message);
  } else {
    document.getElementById("veriftext").innerText = "ACCESS DENIED";
    document.getElementById("veriftext").style.visibility = "visible";
    document.getElementById("veriftext").style.color = "red";
    document.getElementById("verif").src = "img/false.png";
    document.getElementById("verif").style.visibility = "visible";
  }
  //console.log(polygonNFTs);
  //console.log("Number of nfts: "+result.total);
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
  await getNFTs();
}

document.getElementById("auth").onclick = main;
document.getElementById("claimtok").onclick = claimtoken;
