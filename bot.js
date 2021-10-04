// ------------------------------------
// 1. DEPENDENCIES
// ------------------------------------

require("dotenv").config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const Web3 = require("web3");
const fetch = require("node-fetch");
const io = require("socket.io-client");
const socket = io(process.env.PRICES_URL);
const socketSignals = io(process.env.SIGNALS_URL);
const util = require('util');

let prices= [];

socketSignals.on("signals", async (p) => {

    console.log(p)
}

);

// // -----------------------------------------
// // 2. GLOBAL VARIABLES
// // -----------------------------------------

 const TRADING_ABI = [{"inputs":[{"internalType":"address","name":"_gov","type":"address"},{"internalType":"address","name":"_dev","type":"address"},{"internalType":"contractNftInterfaceV4[5]","name":"_nft","type":"address[5]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"value","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"ChainlinkCallbackFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userTradesIndex","type":"uint256"},{"indexed":false,"internalType":"bool","name":"tp","type":"bool"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TpSlUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"slippageP","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"openPrice","type":"uint256"}],"name":"TradeCanceledMarket","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userTradesIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"bool","name":"buy","type":"bool"},{"indexed":false,"internalType":"uint256","name":"positionSizeToken","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"leverage","type":"uint256"},{"indexed":false,"internalType":"int256","name":"pnlToken","type":"int256"},{"indexed":false,"internalType":"uint256","name":"tokenPriceUsd","type":"uint256"}],"name":"TradeClosedMarket","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"}],"name":"TradeLimitCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userTradesIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"nftHolder","type":"address"},{"indexed":false,"internalType":"uint256","name":"orderType","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"bool","name":"buy","type":"bool"},{"indexed":false,"internalType":"uint256","name":"leverage","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"positionSizeToken","type":"uint256"},{"indexed":false,"internalType":"int256","name":"pnlToken","type":"int256"},{"indexed":false,"internalType":"uint256","name":"rewardToken","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenPriceUsd","type":"uint256"}],"name":"TradeLimitExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"}],"name":"TradeLimitOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":true,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userTradesIndex","type":"uint256"},{"indexed":false,"internalType":"bool","name":"buy","type":"bool"},{"indexed":false,"internalType":"uint256","name":"leverage","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"positionSizeToken","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"positionSizeUsd","type":"uint256"}],"name":"TradeOpenedMarket","type":"event"},{"inputs":[],"name":"devFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"devFund","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"govFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"govFund","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"lp","outputs":[{"internalType":"contractIUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nft","outputs":[{"internalType":"contractNftInterfaceV4","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftLastSuccess","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"openLimitOrders","outputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"positionSizeToken","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairTraders","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairTradersId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingMarketCloseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingMarketOpenCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingOrderIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"pool","outputs":[{"internalType":"contractGFarmPoolInterfaceV4","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"priceAggregator","outputs":[{"internalType":"contractPriceAggregatorInterfaceV4","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"reqID_pendingNftOrder","outputs":[{"internalType":"address","name":"nftHolder","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"},{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"userTradesIndex","type":"uint256"},{"internalType":"uint256","name":"orderType","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"token","outputs":[{"internalType":"contractTokenInterfaceV4","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokensBurned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokensMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"traders","outputs":[{"internalType":"uint256","name":"leverageUnlocked","type":"uint256"},{"internalType":"address","name":"referral","type":"address"},{"internalType":"uint256","name":"referralRewardsTotal","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tradesPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userOpenLimitOrderId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userTrades","outputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"userTradesIndex","type":"uint256"},{"internalType":"uint256","name":"positionSizeToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeUsd","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"tpLastUpdated","type":"uint256"},{"internalType":"uint256","name":"slLastUpdated","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userTradesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_token","type":"uint256"},{"internalType":"uint256","name":"_usd","type":"uint256"}],"name":"setReservesLp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_gov","type":"address"}],"name":"setGovFund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"setToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_lp","type":"address"}],"name":"setLp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"setPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"setPriceAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenPriceUsd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"hasOpenLimitOrder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"bool","name":"_buy","type":"bool"},{"internalType":"uint256","name":"_positionSizeToken","type":"uint256"},{"internalType":"uint256","name":"_leverage","type":"uint256"},{"internalType":"uint256","name":"_spreadReductionId","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_slippageP","type":"uint256"},{"internalType":"uint256","name":"_tpP","type":"uint256"},{"internalType":"uint256","name":"_slP","type":"uint256"},{"internalType":"bool","name":"_limit","type":"bool"},{"internalType":"address","name":"_referral","type":"address"}],"name":"openTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_spreadP","type":"uint256"}],"name":"openTradeMarketCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"cancelOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_userTradesIndex","type":"uint256"},{"internalType":"uint256","name":"_newSl","type":"uint256"}],"name":"updateSl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_userTradesIndex","type":"uint256"},{"internalType":"uint256","name":"_newTp","type":"uint256"}],"name":"updateTp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_userTradesIndex","type":"uint256"}],"name":"closeTradeMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"closeTradeMarketCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_orderType","type":"uint256"},{"internalType":"address","name":"_a","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_userTradesIndex","type":"uint256"},{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"uint256","name":"_nftType","type":"uint256"}],"name":"executeNftOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_spreadP","type":"uint256"}],"name":"executeNftOpenOrderCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"executeNftCloseOrderCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"}],"name":"marketOrderCallbackFailed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairTradersArray","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"openLimitOrdersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"pendingOrderIdsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"order","type":"uint256"}],"name":"reqID_pendingMarketOrder_get","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true}];
 const AGGREGATOR_ABI = [{"inputs":[{"internalType":"address","name":"_gov","type":"address"},{"internalType":"contractTradingInterfaceV4","name":"_trading","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"a","type":"address"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"NodeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"a","type":"address"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"NodeRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"decimals","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"from","type":"string"},{"indexed":false,"internalType":"string","name":"to","type":"string"}],"name":"PairAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"from","type":"string"},{"indexed":false,"internalType":"string","name":"to","type":"string"}],"name":"PairRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"paused","type":"bool"}],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"request","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"order","type":"uint256"},{"indexed":false,"internalType":"address","name":"node","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referencePrice","type":"uint256"}],"name":"PriceReceived","type":"event"},{"inputs":[],"name":"currentOrder","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"devOpenFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"gov","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"govOpenFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"lpCloseFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"lpLiqFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxDeviationFromFeed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxGainP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxPosTokenIncreaseP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxPosTokenP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxTradesPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"minAnswers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"minLimitOrderSlippageP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"minPosUsd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftLimitOrderFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftLinkFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftLiqFeeP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftSuccessTimelock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nodes","outputs":[{"internalType":"address","name":"a","type":"address"},{"internalType":"uint256","name":"fee","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"orderAnswers","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairs","outputs":[{"internalType":"string","name":"from","type":"string"},{"internalType":"string","name":"to","type":"string"},{"internalType":"uint256","name":"spreadP","type":"uint256"},{"internalType":"uint256","name":"openInterestToken","type":"uint256"},{"internalType":"uint256","name":"maxOpenInterestToken","type":"uint256"},{"internalType":"contractAggregatorV3Interface","name":"feed","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"pairsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"referralP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"requests","outputs":[{"internalType":"uint256","name":"orderId","type":"uint256"},{"internalType":"uint256","name":"orderType","type":"uint256"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"bool","name":"initiated","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"spreadReductionsP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"trading","outputs":[{"internalType":"contractTradingInterfaceV4","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_gov","type":"address"}],"name":"setGov","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trading","type":"address"}],"name":"setTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minAnswers","type":"uint256"}],"name":"setMinAnswers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxDeviationFromFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"address","name":"_a","type":"address"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"replaceNode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"addNode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_from","type":"string"},{"internalType":"string","name":"_to","type":"string"},{"internalType":"bytes32[20]","name":"_jobs","type":"bytes32[20]"},{"internalType":"uint256","name":"_spreadP","type":"uint256"},{"internalType":"uint256","name":"_maxOpenInterestToken","type":"uint256"},{"internalType":"contractAggregatorV3Interface","name":"_feed","type":"address"}],"name":"addPair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairJobs","outputs":[{"internalType":"bytes32[20]","name":"","type":"bytes32[20]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_spreadP","type":"uint256"}],"name":"updateSpread","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_jobIndex","type":"uint256"},{"internalType":"bytes32","name":"_newJob","type":"bytes32"}],"name":"updateJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_newMaxOpenInterest","type":"uint256"}],"name":"updateMaxOpenInterest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"contractAggregatorV3Interface","name":"_newFeed","type":"address"}],"name":"updateFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"paused","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minPos","type":"uint256"}],"name":"setMinPosUsd","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxPosLp","type":"uint256"}],"name":"setMaxPosTokenP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxIncrease","type":"uint256"}],"name":"setMaxPosTokenIncreaseP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocks","type":"uint256"}],"name":"setNftSuccessTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_govFee","type":"uint256"},{"internalType":"uint256","name":"_devFee","type":"uint256"},{"internalType":"uint256","name":"_lpFee","type":"uint256"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftLiqFee","type":"uint256"},{"internalType":"uint256","name":"_lpLiqFee","type":"uint256"}],"name":"setLiqFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftLimitOrderFeeP","type":"uint256"}],"name":"setNftLimitOrderFeeP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxTradesPerBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxGainP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_1","type":"uint256"},{"internalType":"uint256","name":"_2","type":"uint256"},{"internalType":"uint256","name":"_3","type":"uint256"},{"internalType":"uint256","name":"_4","type":"uint256"},{"internalType":"uint256","name":"_5","type":"uint256"}],"name":"setSpreadReductionsP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_min","type":"uint256"}],"name":"setMinLimitOrderSlippageP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"setNftLinkFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_orderType","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"fulfill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_positionSizeToken","type":"uint256"},{"internalType":"uint256","name":"_leverage","type":"uint256"}],"name":"canOpenTrade","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_positionSizeToken","type":"uint256"},{"internalType":"uint256","name":"_leverage","type":"uint256"}],"name":"increaseOpenInterest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_positionSizeToken","type":"uint256"},{"internalType":"uint256","name":"_leverage","type":"uint256"}],"name":"decreaseOpenInterest","outputs":[],"stateMutability":"nonpayable","type":"function"}];
 const NFT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];
 const LINK_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
const TOKEN_ABI = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address","name":"childChainManager","type":"address"},{"internalType":"address","name":"trading","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"uint256","name":"canceled","type":"uint256"}],"name":"GrantRequestCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32[]","name":"roles","type":"bytes32[]"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"uint256","name":"block","type":"uint256"}],"name":"GrantRequestInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"address payable","name":"relayerAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"functionSignature","type":"bytes"}],"name":"MetaTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BURNER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEPOSITOR_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ERC712_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_GRANT_REQUEST_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"cancelGrantRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes","name":"depositData","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"executeGrantRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"bytes","name":"functionSignature","type":"bytes"},{"internalType":"bytes32","name":"sigR","type":"bytes32"},{"internalType":"bytes32","name":"sigS","type":"bytes32"},{"internalType":"uint8","name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getDomainSeperator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"grantRequestInitiated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"roles","type":"bytes32[]"},{"internalType":"address","name":"account","type":"address"}],"name":"initiateGrantRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]


 let allowedLink = false, selectedProvider = null, eventSubscription = null,
 	providers = [], web3 = [], openTrades = [], pairs = [], nfts = [], nftsBeingUsed = [], ordersTriggered = [],
 	tokenContract, nftTimelock, tradingContract, aggregatorContract, nftContract1, nftContract2, nftContract3, nftContract4, nftContract5, linkContract;

// --------------------------------------------
// 3. INIT: CHECK ENV VARS & LINK ALLOWANCE
// --------------------------------------------

console.log("Welcome to the Gains.farm NFT bot!");
if(!process.env.WSS_URLS || !process.env.PRICES_URL || !process.env.TRADING_ADDRESS
|| !process.env.AGGREGATOR_ADDRESS || !process.env.NFT1_ADDRESS || !process.env.NFT2_ADDRESS
|| !process.env.NFT3_ADDRESS || !process.env.NFT4_ADDRESS || !process.env.NFT5_ADDRESS
|| !process.env.LINK_ADDRESS || !process.env.PRIVATE_KEY || !process.env.PUBLIC_KEY
|| !process.env.EVENT_CONFIRMATIONS_SEC || !process.env.TRIGGER_TIMEOUT){
	console.log("Please fill all parameters in the .env file.");
	process.exit();
}

// -----------------------------------------
// 4. WEB3 PROVIDER
// -----------------------------------------

const WSS_URLS = process.env.WSS_URLS.split(",");

function selectProvider(n){
	if(eventSubscription !== null && eventSubscription.id !== null){
		eventSubscription.unsubscribe();		
	}

	eventSubscription = null;
	selectedProvider = n;
	tradingContract = new web3[n].eth.Contract(TRADING_ABI, process.env.TRADING_ADDRESS);
	aggregatorContract = new web3[n].eth.Contract(AGGREGATOR_ABI, process.env.AGGREGATOR_ADDRESS);
	nftContract1 = new web3[n].eth.Contract(NFT_ABI, process.env.NFT1_ADDRESS);
	nftContract2 = new web3[n].eth.Contract(NFT_ABI, process.env.NFT2_ADDRESS);
	nftContract3 = new web3[n].eth.Contract(NFT_ABI, process.env.NFT3_ADDRESS);
	nftContract4 = new web3[n].eth.Contract(NFT_ABI, process.env.NFT4_ADDRESS);
	nftContract5 = new web3[n].eth.Contract(NFT_ABI, process.env.NFT5_ADDRESS);
	linkContract = new web3[n].eth.Contract(LINK_ABI, process.env.LINK_ADDRESS);
    tokenContract = new web3[n].eth.Contract(TOKEN_ABI, process.env.TOKEN_ADDRESS);

    updateBalance();

}

const getProvider = (wssId) => {
	const provider = new Web3.providers.WebsocketProvider(WSS_URLS[wssId], {clientConfig:{keepalive:true,keepaliveInterval:30*1000}});

	provider.on('close', () => {
		setTimeout(() => {
			if(!provider.connected){
				console.log(WSS_URLS[wssId]+' closed: trying to reconnect...');

				let connectedProvider = -1;
				for(var i = 0; i < WSS_URLS.length; i++){
					if(providers[i].connected){
						connectedProvider = i;
						break;
					}
				}
				if(connectedProvider > -1 && selectedProvider === wssId){
					selectProvider(connectedProvider);
					console.log("Switched to WSS " + WSS_URLS[selectedProvider]);
				}else if(connectedProvider === -1 && selectedProvider === wssId){
					console.log("No WSS to switch to...");
				}

				providers[wssId] = getProvider(wssId);
				web3[wssId] = new Web3(providers[wssId]);
			}
		}, 5*1000);
	});

	provider.on('connect', () => {
		setTimeout(() => {
			if(provider.connected){
				console.log('Connected to WSS '+WSS_URLS[wssId]+'.');

				let connectedProvider = -1;
				for(var i = 0; i < WSS_URLS.length; i++){
					if(providers[i].connected && i !== wssId){
						connectedProvider = i;
						break;
					}
				}
				if(connectedProvider === -1 || selectedProvider === null){
					selectProvider(wssId);
					console.log("Switched to WSS " + WSS_URLS[selectedProvider]);
					// checkLinkAllowance();
				}else{
					console.log("No need to switch WSS, already connected to " + WSS_URLS[selectedProvider]);
				}
			}
		}, 5*1000);
	});
	provider.on('error', () => console.log("WSS "+WSS_URLS[wssId]+" error"));
	return provider;
};

for(var i = 0; i < WSS_URLS.length; i++){
	const provider = getProvider(i);
	providers.push(provider);
	web3.push(new Web3(provider));
}

setInterval(async () => {
	let promises = [];
	for(var i = 0; i < WSS_URLS.length; i++){
		(function(index) {
			web3[index].eth.net.isListening().then(async () => {
				promises.push(web3[index].eth.getBlockNumber());
				if(promises.length === WSS_URLS.length){ compareBlocks(promises); }
			}).catch(() => {
				promises.push(null);
				if(promises.length === WSS_URLS.length){ compareBlocks(promises); }
			});
		})(i);
	}
}, 20*1000);

function compareBlocks(promises){
	Promise.all(promises).then((b) => {
		for(var i = 0; i < WSS_URLS.length; i++){
			if(b[i] > b[selectedProvider]){
				console.log("Switched to WSS " + WSS_URLS[i] + " (block #" + b[i] + " vs #" + b[selectedProvider]);
				selectProvider(i);
				break;
			}
		}
	});
}

setInterval(() => {
	console.log("Current WSS: " + WSS_URLS[selectedProvider]);
}, 120*1000);


// ---------------------------------------------
// 4. FETCH CURRENT PRICES & CHECK USER GFARM2 BALANCE
//  ---------------------------------------------

socket.on("prices", async (p) => {

    prices.splice(0, 21, p.lastPrices);
    
});

//Prepare balance before signal arrives

let tokenBalance = 0;


async function updateBalance() {
    _tokenBalance = await tokenContract.methods.balanceOf(process.env.PUBLIC_KEY).call();
    console.log("The GFARM2 token balance is:" + web3[selectedProvider].utils.fromWei(_tokenBalance, "ether" ));
    tokenBalance = parseInt(_tokenBalance);
}


// ---------------------------------------------
// 5. TRIGGER ORDERS
//  ---------------------------------------------


// Active Positions Array
activePositions = [];

socketSignals.on("signals", async (signal) => {
	
    p = signal.pair;
    openTrade = signal.opentrade;
    if (signal.long === true) {
        long = web3[selectedProvider].utils.toHex(1);
    } else {
        long = web3[selectedProvider].utils.toHex(0);
    }

    let __pairIndex;

    if (p === 4) {__pairIndex = 19 } else return;

    if (openTrade === true) {

    if (tokenBalance < web3[selectedProvider].utils.toWei("0.04", "ether") || tokenBalance > web3[selectedProvider].utils.toWei("9.5", "ether")) {
        
        console.log("Token balance is not in the range 0.04 to 9.5");
        return};

    if (activePositions[p] === true) { 

        console.log("There is already an active position on this pair.");
        return;
    }    

    console.log(prices);
    console.log(prices[0][19]);

    console.log(prices[0][__pairIndex]);

    console.log(
        web3[selectedProvider].utils.toHex(__pairIndex), // Pair index
        long, //buy 
        web3[selectedProvider].utils.toHex(tokenBalance), //positionSizetoken
        web3[selectedProvider].utils.toHex(process.env.LEVERAGE_AMOUNT),
        web3[selectedProvider].utils.toHex(process.env.SPREAD_REDUCTION_ID),
        web3[selectedProvider].utils.toHex(parseInt((prices[0][__pairIndex])*10e10)),
        web3[selectedProvider].utils.toHex(process.env.SLIPPAGE_P*10e10),
        web3[selectedProvider].utils.toHex(parseInt(process.env.TAKE_PROFIT)*10e9),
        web3[selectedProvider].utils.toHex(parseInt(process.env.STOP_LOSS)*10e9),
        0,
        "0x41f4C1E74bdEeeF44f2A371Be932b729f329AAbB")

    var tx = {
        from: process.env.PUBLIC_KEY,
        to : process.env.TRADING_ADDRESS,
        data : tradingContract.methods.openTrade(
            web3[selectedProvider].utils.toHex(__pairIndex), // Pair index
        long, //buy 
        web3[selectedProvider].utils.toHex(tokenBalance), //positionSizetoken
        web3[selectedProvider].utils.toHex(process.env.LEVERAGE_AMOUNT),
        web3[selectedProvider].utils.toHex(process.env.SPREAD_REDUCTION_ID),
        web3[selectedProvider].utils.toHex(parseInt((prices[0][__pairIndex])*10e10)),
        web3[selectedProvider].utils.toHex(process.env.SLIPPAGE_P*10e10),
        web3[selectedProvider].utils.toHex(parseInt(process.env.TAKE_PROFIT)*10e9),
        web3[selectedProvider].utils.toHex(parseInt(process.env.STOP_LOSS)*10e9),
        0,
        "0x41f4C1E74bdEeeF44f2A371Be932b729f329AAbB").encodeABI(),
        gasPrice: web3[selectedProvider].utils.toHex("400000000000"),
        gas: web3[selectedProvider].utils.toHex("2000000")
            };

    } else {


        var tx = {
            from: process.env.PUBLIC_KEY,
            to : process.env.TRADING_ADDRESS,
            data : tradingContract.methods.closeTradeMarket(
                web3[selectedProvider].utils.toHex(__pairIndex), // Pair index
                web3[selectedProvider].utils.toHex(0) //userTradesIndex 
                ).encodeABI(),
            gasPrice: web3[selectedProvider].utils.toHex("400000000000"),
            gas: web3[selectedProvider].utils.toHex("2000000")
                };
    }



	            web3[selectedProvider].eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
				    web3[selectedProvider].eth.sendSignedTransaction(signed.rawTransaction)
				    .on('receipt', () => {
                        if (openTrade === true) {
                        console.log("Triggered open position on pair: " + p + ". Direction was long:" + long)
                        activePositions.splice(p, 1, true);
                        console.log("Active position at pair " + p + "? " + activePositions[p])
                    } else 
                        { console.log("Triggered close position on pair: " + p)
                        activePositions.splice(p, 1, false);
                        console.log("Active position at pair " + p + "? " + activePositions[p])
                    }
						
				    }).on('error', (e) => {
				    	console.log("Failed to trigger on pair: " + p + ". Attempt was open: " + openTrade);
						console.log("Tx error (" + e + ")");

                        if (openTrade === true) {
                            console.log("Triggered open position on pair: " + p + ". Direction was long:" + long)
                            activePositions.splice(p, 1, false);
                            console.log("Active position at pair " + p + "? " + activePositions[p])
                        } else 
                            { console.log("Triggered close position on pair: " + p)
                            activePositions.splice(p, 1, true);
                            console.log("Active position at pair " + p + "? " + activePositions[p])
                        }

				    	
				    });
				}).catch(e => {
					console.log("Failed to trigger (order type: " + orderInfo.name + ", nft id: "+orderInfo.nftId+")");
					console.log("Tx error (" + e + ")");

                    if (openTrade === true) {
                        console.log("Triggered open position on pair: " + p + ". Direction was long:" + long)
                        activePositions.splice(p, 1, false);
                        console.log("Active position at pair " + p + "? " + activePositions[p])
                    } else 
                        { console.log("Triggered close position on pair: " + p)
                        activePositions.splice(p, 1, true);
                        console.log("Active position at pair " + p + "? " + activePositions[p])
                    }

			    
				});

    updateBalance();

}

);

// // -------------------------------------------------
// 11. CREATE SERVER (USEFUL FOR CLOUD PLATFORMS)
// -------------------------------------------------

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
