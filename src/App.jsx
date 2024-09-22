import React, { useState, useRef, useEffect } from "react";
import { useWallet } from "@thirdweb-dev/react";

const App = () => {
  const wallet = useWallet();
  const [balance, setBalance] = useState(0);
  const [tapCurrent, setTapCurrent] = useState(5000);
  const [tapTotal] = useState(5000);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const tapPopupRef = useRef(null);
  const coinRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleTap = (e) => {
    if (tapCurrent === 0) {
      return alert("You have reached today's limit");
    }
    setBalance((prevBalance) => prevBalance + 1);
    setTapCurrent((prevTapCurrent) => {
      const newTapCurrent = prevTapCurrent - 1;
      const newProgressPercentage =
        ((tapTotal - newTapCurrent) / tapTotal) * 100;
      setProgressPercentage(
        newProgressPercentage > 100 ? 100 : newProgressPercentage
      );
      return newTapCurrent;
    });

    const tapPopup = tapPopupRef.current;
    tapPopup.innerText = `+1`;
    tapPopup.style.left = `${e.clientX}px`;
    tapPopup.style.top = `${e.clientY - 50}px`;
    tapPopup.style.opacity = 1;
    tapPopup.style.transform = "translate(-50%, -50%) scale(1.5)";


    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      tapPopup.style.opacity = 0;
      tapPopup.style.transform = "translate(-50%, -50%) scale(1)";
    }, 1000);

    const coin = coinRef.current;
    if (coin) {
      coin.classList.add("animate");
      setTimeout(() => {
        coin.classList.remove("animate");
      }, 200);
    }
  };

  const connectToWallet = async (typeOfWallet) => {
    if (!wallet?.connected) {
      try {
        await wallet?.connect(typeOfWallet);
      } catch (error) {
        console.error("Failed to connect to wallet:", error);
      }
    }
  };

  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="balance">{balance}</div>
      <div className="gold-status">Gold</div>
      <div className="coin" id="tap" onClick={handleTap}>
        <div className="tap-popup" ref={tapPopupRef} aria-live="polite">
          +1
        </div>
      </div>
      <div className="nav">
        <span>{tapCurrent}</span>/<span>{tapTotal}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="wallet">
        {wallet?.connected ? (
          <div>Connected: {wallet.address}</div>
        ) : (
          <div>
            <button onClick={() => connectToWallet("injected")}>
              Connect MetaMask
            </button>
            <button onClick={() => connectToWallet("walletconnect")}>
              Connect WalletConnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
