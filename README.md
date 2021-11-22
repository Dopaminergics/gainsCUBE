**初心 gainsCUBE 初心**                        
b-cube.ai => gains.trade signals bot              
--------------------------------------------------------------------------------
BETA: ENSURE ADDRESS IS APPROVED FOR DAI ON GAINS.TRADE. THIS WILL BE BUILT IN FOR FULL RELEASE. 
BETA:   PLEASE MONITOR THE BOT AND POSITIONS AT THIS STAGE.    
Please leave dev_fee as 1% or greater. Signals worth > 350 EUR/mo. Consider 2% 

- **MAX 50 DAI PER POSITION SUGGESTED AT PRESENT. E.G. 100 DAI on account and set capital per position to 45-50 (this is a percentage).**

 - The server runs on heroku - during beta any downtime will result in no further positons being opened. 
 - Currently signals should only open for SOL and XRP                                                     
 - Refer to BCUBE Website: SOL Positional Bot.                                                            
 - Refer to BCUBE Website: XRP Short Term Bot.                                                            
 - Default dev_fee 2%                                                                                                                   

## Structure of heartbeat
- pair: The relevant crypto pair.
- direction: Whether it is a long or short strategby.
- e.g. {pair: 'btc' , direction: 'long'}

## Structure of signal
- pair: The relevant crypto pair.
- opentrade: If a trade is to be opened, true. If a trade is to be closed, false.
- direction: If a trade is being opened, it will say the strategy, long or shiort. Closed trades do not have a direction.
e.g. {pair: 'btc', opentrade: 'true', direction: 'short'} for opening a short trade on btc
e.g. {pair: 'eth', opentrade: 'false'} for closing ANY trade on eth.


## Prior to running: 
1. Create a .env file using the example supplied in .env-example and fill in variables

## Where to start
- If you are running this locally, you need to download nodejs, and I suggest Visual Studio Code as well.
- Navigate to the folder you saved these files in and type "node bot" into the console.
