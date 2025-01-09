import React, { useState, useEffect } from 'react';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Helper functions
const createDeck = () => {
  const deck = [];
  for (let suit of SUITS) {
    for (let rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const getCardValue = (rank) => {
  const rankOrder = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
  };
  return rankOrder[rank];
};

const CardGame = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [centerPile, setCenterPile] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [gameLog, setGameLog] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);

  const initGame = () => {
    const deck = shuffleDeck(createDeck());
    const newPlayerHand = deck.slice(0, 7);
    const newBotHand = deck.slice(7, 14);
    
    setPlayerHand(newPlayerHand);
    setBotHand(newBotHand);
    setCenterPile([]);
    setPlayerScore(0);
    setBotScore(0);
    setGameLog([]);
    setIsGameOver(false);
    setPlayerTurn(true);
  };

  const addToGameLog = (message) => {
    setGameLog(prevLog => [...prevLog, message]);
  };

  const botPlay = () => {
    const botCard = botHand[0];
    setBotHand(prevHand => prevHand.slice(1));
    setCenterPile(prevPile => [...prevPile, { card: botCard, player: 'bot' }]);
    addToGameLog(`Bot played ${botCard.rank}${botCard.suit}`);
  
    const playerCard = centerPile.length > 0 ? centerPile[centerPile.length - 1].card : null;
  
    if (playerCard === null) {
      addToGameLog('No card in the center pile for comparison.');
      setPlayerTurn(true);
      return;
    }
  
    if (getCardValue(botCard.rank) > getCardValue(playerCard.rank)) {
      setBotScore(prev => prev + 1);
      addToGameLog('Bot wins the round');
    } else if (getCardValue(botCard.rank) < getCardValue(playerCard.rank)) {
      setPlayerScore(prev => prev + 1);
      addToGameLog('Player wins the round');
    } else {
      addToGameLog('Tie!');
    }
  
    if (botHand.length <= 1) {
      setIsGameOver(true);
    }
  
    setPlayerTurn(true);
  };
  

  const playCard = (card, index) => {
    if (!playerTurn || isGameOver) return;

    setPlayerHand(prevHand => {
      const newHand = [...prevHand];
      newHand.splice(index, 1);
      return newHand;
    });

    setCenterPile(prevPile => [...prevPile, { card, player: 'player' }]);
    addToGameLog(`Player played ${card.rank}${card.suit}`);
    setPlayerTurn(false);

    setTimeout(botPlay, 1000);
  };

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>Player Score: {playerScore}</div>
        <div>Bot Score: {botScore}</div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Center Pile</h3>
        <div className="flex gap-2">
          {centerPile.map((pile, index) => (
            <div key={index} className="border rounded p-2">
              {pile.card.rank}{pile.card.suit}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Bot's Hand</h3>
        <div className="flex gap-2">
          {botHand.map((_, index) => (
            <div key={index} className="border rounded p-2 bg-blue-500 text-white">
              ?
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Your Hand</h3>
        <div className="flex gap-2">
          {playerHand.map((card, index) => (
            <button
              key={index}
              onClick={() => playCard(card, index)}
              disabled={!playerTurn || isGameOver}
              className="border rounded p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              {card.rank}{card.suit}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Game Log</h3>
        <div className="h-32 overflow-y-auto border p-2">
          {gameLog.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>

      {isGameOver && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">
            Game Over! {playerScore > botScore ? 'Player Wins!' : playerScore < botScore ? 'Bot Wins!' : 'It\'s a Tie!'}
          </h2>
          <button 
            onClick={initGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default CardGame;