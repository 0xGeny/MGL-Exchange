import { Button,Row,Col } from 'antd';
import {useEffect,useState} from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import axios from 'axios';
import '../../utils/translate.js';
import Nav from "../component/Nav"
import PairCardButton from "../component/PairCardButton";
import Main from "../views/Main";
import MarketTrend from "../views/MarketTrend";
import TouchCard from"../views/TouchCard";
import Mark from "../views/Mark";
import Footer from "../component/Footer";
import Advertisment from "../views/Advertisment";
import Step from "../views/Step";
import Roadmap from "../views/Roadmap";
import {SERVER_URL} from "../../constants/env";
import ReconnectingWebSocket from "reconnecting-websocket";

const pair=[
    {name:"BTC",percent:3.19763724,price:57832.47921786725},
    {name:"ETH",percent:3.19763724,price:57832.47921786725},
    {name:"BTC",percent:3.19763724,price:57832.47921786725},
    {name:"BTC",percent:3.19763724,price:57832.47921786725},
    {name:"BTC",percent:3.19763724,price:57832.47921786725},
    {name:"BTC",percent:3.19763724,price:57832.47921786725},
    
  ]
function Home() {

  const {t,i18n} = useTranslation();
  const [coinData,setCoinData] = useState(pair);
  let interval = undefined;
  
  const stepData = [
    {picUrl:"/assets/img/step1.png",step:t("Step1"),subtitle:t("Get Started")},
    {picUrl:"/assets/img/step2.png",step:t("Step2"),subtitle:t("Confirmation")},
    {picUrl:"/assets/img/step3.png",step:t("Step3"),subtitle:t("Identify Verification")},
    {picUrl:"/assets/img/step4.png",step:t("Step4"),subtitle:t("Buy Cryptocurrency")},
    {picUrl:"/assets/img/step5.png",step:t("Step5"),subtitle:t("Sell Cryptocurrency")},
    {picUrl:"/assets/img/step6.png",step:t("Step6"),subtitle:t("Send and Receive")},
  ]

  const establishWebSocketConnection = () => {
    //***************************************
    // Set the options for the connection
    // detail on what they mean can be found here:
    // https://www.npmjs.com/package/reconnecting-websocket
    const wsOptions = {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      connectionTimeout: 5000,
      minUptime: 5000,
      maxRetries: 999999999999,
      reconnectionDelayGrowFactor: 1.3,
      debug: false,
    };
    //***************************************
    // Establish connection to the live feed
    const url = "wss://ws-feed.exchange.coinbase.com";
    const wsClient = new ReconnectingWebSocket(url, [], wsOptions);
    //***************************************
    // add an event listener to run code
    // when the connection opens
    wsClient.addEventListener("open", () => {
      console.log("Connection Established ...");
      wsClient.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["BTC-USD", "ETH-USD"],
          channels: ["ticker"],
        })
      );
    });
    //****************************************
    // add an event listener to run code when
    // a message is received from the server
    wsClient.addEventListener("message", (e) => {
      // parse the data from server
      let data = JSON.parse(e.data);
      // extract the Ethereum index and
      // update in local state
      let index = -1;
      if (data.product_id === "BTC-USD") {
        index = 0;
      } else if (data.product_id === "ETH-USD") {
        index = 1;
      }

      if (index >= 0 && index < coinData.length) {
        pair[index].price = data.price;
        pair[index].percent =
          ((data.price - data.open_24h) / data.open_24h) * 100;
      }
    });
  };

  const fetchData = async ()=>{
     try {
        // axios.get(SERVER_URL+'wallets/gettoptokens')
        //   .then((response)=>{
        //     if(response.data.response && response.data.data.length>0){
        //       let data = response.data.data;
        //       console.log(data);
        //       let initCoinData = [];
        //       for(var i=0;i<6;i++)
        //         initCoinData.push({
        //           name:data[i].symbol,
        //           price:data[i].price,
        //           percent:data[i].daily_percent
        //         });

        //       setCoinData(initCoinData);
        //     }
        //     else{

        //     }
        // })

        establishWebSocketConnection();

        interval = setInterval(() => {
          setCoinData([...pair]);
        }, 1000);

    } catch (error) {
        console.log(error);
    }
  }
  useEffect(()=>{
    fetchData();
  },[])
  return (

    <div>
      <Main coinData={coinData}/>
      <Mark />
      <Advertisment />
      <Step />
      <Roadmap />
      <Footer />
      
    </div>
  );
}

export default Home;
