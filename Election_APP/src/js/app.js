//var Web3JP = require('web3');
//const toChecksumAddress = require("to-checksum-address");
//var Web3Utils = require('web3-utils');
//const { toChecksumAddress } = require('ethereum-checksum-address')
App = {
  web3Provider: null,
  web3Providerjp: null,
  contracts: {},
  web3 :null,
  web3jp :null,
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
    $.getJSON('../proposals.json', function(data) {
      var proposalsRow = $('#proposalsRow');
      var proposalTemplate = $('#proposalTemplate');

      for (i = 0; i < data.length; i ++) {
        proposalTemplate.find('.panel-title').text(data[i].name);
        proposalTemplate.find('img').attr('src', data[i].picture);
        proposalTemplate.find('.btn-vote').attr('data-id', data[i].id);

        proposalsRow.append(proposalTemplate.html());
        App.names.push(data[i].name);
      }
    });
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      //App.web3Providerjp = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
      //App.web3Providerjp = new Web3JP.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);
    //web3jp = new Web3JP(App.web3Providerjp);

    ethereum.enable();
    App.web3 = web3;
    //App.web3jp = web3jp;
    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Election.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    console.log("dati contract=>", voteArtifact);
    App.contracts.vote = TruffleContract(voteArtifact);
    //App.contracts.vote = new web3.eth.Contract(voteArtifact.abi, '0x9E948099fEA01769f24Faa04006DDb15b672fDC2');

    // Set the provider for our contract
    App.contracts.vote.setProvider(App.web3Provider);
    
    App.getChairperson();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.handleVote);
    $(document).on('click', '#win-count', App.handleWinner);
    $(document).on('click', '#register', function(){
       var ad = $('#enter_address').val();
       console.log("addressse à enregistrer =>", ad);
       web3 = new Web3(App.web3Provider);
       var add = web3.utils.toChecksumAddress(ad);
       console.log("web3 from app Web3Utils=>",add);
      // Web3JPTry = new Web3JP(App.url);
     //  var adCheckSum = App.web3jp.utils.toChecksumAddress(ad);
     ad ='0x520bEd8F50963296761220F966660F1e6EAEA213';
     //  console.log("adCheckSum =>", adCheckSum);
      //var add =  web3.utils.toChecksumAddress(ad);
      //console.log("addressse à enregistrer checksum =>", add);
        App.handleRegister(ad); });
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement);  
        }
      });
    });
  },

  getChairperson : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      console.log("chairman dati");
     // console.log(result);
     // console.log(result.constructor);
      console.log(result.constructor.currentProvider);
      console.log("select address");
      console.log(result.constructor.currentProvider.selectedAddress);
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
      web3.eth.getCoinbase((err, coinbase) => {
       
        App.currentAccount = coinbase;
        console.log("App.chairPerson ",App.chairPerson);
        console.log("App.currentAccounto ",App.currentAccount);
        if(App.chairPerson != App.currentAccount){
          jQuery('#address_div').css('display','none');
          jQuery('#register_div').css('display','none');
        }else{
          jQuery('#address_div').css('display','block');
          jQuery('#register_div').css('display','block');
        }
     }) ; 
    })
  },

  handleRegister: function(addr){
   console.log("addr from handleRegister ", addr);
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      console.log("voteInstance => ", voteInstance);
      return voteInstance.register(addr,  { from:  App.chairPerson});
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " registration done successfully")
            else
            alert(addr + " registration not done successfully due to revert")
        } else {
            alert(addr + " registration failed")
        }
        
        if(err)
        {
          console.log("errore completo => ", err);
        }
    });
},

  handleVote: function(event) {
    event.preventDefault();
    var proposalId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.vote(proposalId, {from: account});
      }).then(function(result, err){
            if(result){
                console.log(result.receipt.status);
                if(parseInt(result.receipt.status) == 1)
                alert(account + " voting done successfully")
                else
                alert(account + " voting not done successfully due to revert")
            } else {
                alert(account + " voting failed")
            }   
        });
    });
  },

  handleWinner : function() {
    console.log("To get winner");
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.reqWinner();
    }).then(function(res){
    console.log(res);
      alert(App.names[res] + "  is the winner ! :)");
    }).catch(function(err){
      console.log(err.message);
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
