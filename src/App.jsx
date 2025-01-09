import React, { useState, useEffect } from 'react';
import './App.css';

const shuffleDeck = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = [
    'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A',
  ];

  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ value, suit });
    });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

const calculateScore = (card) => {
  const order = {
    K: 13,
    Q: 12,
    J: 11,
    '10': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    A: 1,
  };

  return order[card.value];
};

const App = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [log, setLog] = useState([]);
  const [roundCards, setRoundCards] = useState({ player: null, bot: null });

  useEffect(() => {
    const shuffledDeck = shuffleDeck();
    setDeck(shuffledDeck);
    setPlayerHand(shuffledDeck.slice(0, 7));
    setBotHand(shuffledDeck.slice(7, 14));
  }, []);

  const playRound = (playerCardIndex) => {
    if (playerHand.length === 0 || botHand.length === 0) {
    // ประกาศผลเมื่อเกมจบ
    if (playerScore > botScore) {
      setLog((prev) => [...prev, '🎉 Player wins the game!']);
    } else if (playerScore < botScore) {
      setLog((prev) => [...prev, '🥺 Bot wins the game!']);
    } else {
      setLog((prev) => [...prev, 'It\'s a draw!']);
    }
    return;
  }

    const playerCard = playerHand[playerCardIndex];
    const botCard = botHand[0];

    const playerCardValue = calculateScore(playerCard);
    const botCardValue = calculateScore(botCard);

    setRoundCards({ player: playerCard, bot: botCard });

    setTimeout(() => {
      let newLogEntry = '';
      if (playerCardValue > botCardValue) {
        setPlayerScore((prev) => prev + 1);
        setLog((prev) => [...prev, `😀 Player wins this round with ${playerCard.value} vs ${botCard.value}`]);
      } else if (playerCardValue < botCardValue) {
        setBotScore((prev) => prev + 1);
        setLog((prev) => [...prev, `🤖 Bot wins this round with ${playerCard.value} vs ${botCard.value}`]);
      } else {
        setLog((prev) => [...prev, `Draw this round with ${playerCard.value} vs ${botCard.value}`]);
        setPlayerHand((prev) => [...prev, deck[playerHand.length + botHand.length]]);
        setBotHand((prev) => [...prev, deck[playerHand.length + botHand.length + 1]]);
      }

      setLog((prev) => {
        const updatedLog = [...prev, newLogEntry];
  
        // เช็คว่าเกมจบหรือยัง
        if (playerHand.length === 1 && botHand.length === 1) {
          if (playerScore > botScore) {
            updatedLog.push('🎉 Player wins the game!');
          } else if (playerScore < botScore) {
            updatedLog.push('🥺 Bot wins the game!');
          } else {
            updatedLog.push('It\'s a draw!');
          }
        }
  
        return updatedLog;
      });

      setPlayerHand((prev) => prev.filter((_, index) => index !== playerCardIndex));
      setBotHand((prev) => prev.slice(1));
    }, 1000);
  };

  const restartGame = () => {
    const shuffledDeck = shuffleDeck();
    setDeck(shuffledDeck);
    setPlayerHand(shuffledDeck.slice(0, 7));
    setBotHand(shuffledDeck.slice(7, 14));
    setPlayerScore(0);
    setBotScore(0);
    setLog([]);
    setRoundCards({ player: null, bot: null });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Big-Small Game</h1>
      <h1 className='text-xl mb-5'> {log[log.length-1]} </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Player</h2>
          <div className="flex gap-2 flex-wrap">
            {playerHand.map((card, index) => (
              <div
                key={index}
                className="bg-blue-500 text-center p-2 rounded shadow-md cursor-pointer hover:bg-blue-700"
                onClick={() => playRound(index)}
              >
                {card.value} {card.suit}
              </div>
            ))}
          </div>
          <h3 className="text-lg font-medium mt-4">Score: {playerScore}</h3>
        </div>

        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Bot</h2>
          <div className="flex gap-2 flex-wrap">
            {botHand.map((_, index) => (
              <div key={index} className="bg-red-500 text-center p-2 rounded shadow-md">?</div>
            ))}
          </div>
          <h3 className="text-lg font-medium mt-4">Score: {botScore}</h3>
        </div>
      </div>

      <div className="bg-gray-200 p-4 mt-6 rounded-lg shadow-md w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Round</h3>
        <div className="flex gap-4 justify-center items-center">
          {roundCards.player && (
            <div className="bg-green-500 text-center p-4 rounded shadow-md">
              {roundCards.player.value} of {roundCards.player.suit}
            </div>
          )}
          {roundCards.bot && (
            <div className="bg-yellow-500 text-center p-4 rounded shadow-md">
              {roundCards.bot.value} of {roundCards.bot.suit}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={restartGame}
          className="bg-green-600 px-4 py-2 rounded shadow-md hover:bg-green-700"
        >
          Restart Game
        </button>
      </div>

      <div className="bg-gray-200 p-4 mt-6 rounded-lg shadow-md w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Log</h3>
        <div className="list-disc list-inside">
          {log.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
