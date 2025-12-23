import React, { useState, useEffect } from 'react';
import "./Card.css";

const Card = ({ suit, name, isFaceDown }) => {
    const isRed = suit === "Hearts" || suit === "Diamonds";
    const suitSymbol = { Hearts: "♥", Diamonds: "♦", Clubs: "♣", Spade: "♠" }[suit];

    return (
        <div className={`playing-card ${isFaceDown ? 'back' : isRed ? 'red' : 'black'}`}>
            {isFaceDown ? "?" : (
                <>
                    <div className="card-corner top-left">
                        <div>{name}</div>
                        <div>{suitSymbol}</div>
                    </div>
                    <div className="card-center">{suitSymbol}</div>
                    <div className="card-corner bottom-right">
                        <div>{name}</div>
                        <div>{suitSymbol}</div>
                    </div>
                </>
            )}
        </div>
    );
};

const Game = () => {
    // 1. Move all Hooks to the top
    const [player1Cards, setPlayer1Cards] = useState([]);
    const [player2Cards, setPlayer2Cards] = useState([]);
    const [message, setMessage] = useState("Click Draw to Start!");
    const [lastPlayedP1, setLastPlayedP1] = useState(null);
    const [lastPlayedP2, setLastPlayedP2] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);

    const SUITS = ["Hearts", "Diamonds", "Clubs", "Spade"];
    const RANKS = [
        { name: "A", value: 1 }, // Adjusted A to be high for War
        { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 },
        { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 },
        { name: "8", value: 8 }, { name: "9", value: 9 }, { name: "10", value: 10 },
        { name: "J", value: 11 }, { name: "Q", value: 12 }, { name: "K", value: 13 },
    ];

    const createDeck = () => {
        const newDeck = [];
        SUITS.forEach(suit => {
            RANKS.forEach(rank => {
                newDeck.push({ ...rank, suit, id: `${rank.name}-${suit}-${Math.random()}` });
            });
        });
        return newDeck;
    };

    const shuffleDeck = (deckToShuffle) => {
        const shuffled = [...deckToShuffle];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startNewGame = () => {
        const randomizedDeck = shuffleDeck(createDeck());
        setPlayer1Cards(randomizedDeck.slice(0, 26));
        setPlayer2Cards(randomizedDeck.slice(26, 52));
        setMessage("Game Reset! Click Draw to play.");
        setLastPlayedP1(null);
        setLastPlayedP2(null);
        setIsGameOver(false);

    };

    const playRound = () => {
        if (isGameOver) {
            return;
        }

        let p1Deck = [...player1Cards];
        let p2Deck = [...player2Cards];
        let currentPot = [];
        let roundMessage = "";

        

        const resolveBattle = () => {
            if (p1Deck.length === 0 || p2Deck.length === 0) return null;

            const card1 = p1Deck.shift();
            const card2 = p2Deck.shift();
            currentPot.push(card1, card2);

            // Update UI cards for this specific battle
            setLastPlayedP1(card1);
            setLastPlayedP2(card2);

            if (card1.value > card2.value) {
                roundMessage = `P1 wins round! (${card1.name} vs ${card2.name})`;
                return 'P1';
            } else if (card2.value > card1.value) {
                roundMessage = `P2 wins round! (${card2.name} vs ${card1.name})`;
                return 'P2';
            } else {
                (card1.value === card2.value)
                roundMessage = `P1 And P2 draw round! War Start! (${card1.name} vs ${card2.name})`;
                if (p1Deck.length < 3 || p2Deck.length < 3) {
                     return p1Deck.length > p2Deck.length ? 'P1' : 'P2';
                }
                // Add face-down cards
                for (let i = 0; i < 3; i++) {
                    currentPot.push(p1Deck.shift());
                    currentPot.push(p2Deck.shift());
                }
                return resolveBattle();
            }
        };

        const winner = resolveBattle();


        if (winner === 'P1') {
            p1Deck.push(...shuffleDeck(currentPot));
        } else if (winner === 'P2') {
            p2Deck.push(...shuffleDeck(currentPot));
        }

        setPlayer1Cards(p1Deck);
        setPlayer2Cards(p2Deck);

        if (p1Deck.length === 0 || p2Deck.length === 0) {
            setIsGameOver(true);
            setMessage(p1Deck.length === 0 ? "Congrats PLAYER 2 WINS THE GAME!" : " Congrats PLAYER 1 WINS THE GAME!");
        } else {
            setMessage(roundMessage);
        }
    };

    const shuffleCurrentDecks = () => {
        if (player1Cards.length > 0 && player2Cards.length > 0) {
            setPlayer1Cards(shuffleDeck([...player1Cards]));
            setPlayer2Cards(shuffleDeck([...player2Cards]));
            setMessage("Hidden decks shuffled!");
        }
    };

    useEffect(() => {
        startNewGame();
    }, []);

    return (
        <div style={{ padding: '20px', background: '#2d5a27', minHeight: '100vh', textAlign: 'center', color: 'white' }}>
            <h1>Holiday Card Game</h1>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={startNewGame} style={btnStyle}>New Game</button>
                <button onClick={playRound} style={{ ...btnStyle, background: '#ffcc00' }}>Draw / Fight!</button>
                <button onClick={shuffleCurrentDecks} style={btnStyle}>Shuffle Decks</button>
            </div>

            <h2 style={{ height: '40px' }}>{message}</h2>

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '40px' }}>
                <div>
                    <h3>Player 1 ({player1Cards.length})</h3>
                    {lastPlayedP1 && <Card suit={lastPlayedP1.suit} name={lastPlayedP1.name} isFaceDown={false} />}
                </div>
                <div>
                    <h3>Player 2 ({player2Cards.length})</h3>
                    {lastPlayedP2 && <Card suit={lastPlayedP2.suit} name={lastPlayedP2.name} isFaceDown={false} />}
                </div>
            </div>
        </div>
    );
};

const btnStyle = { padding: '10px 20px', background: '#5bc0de', border: 'none', margin: '5px', cursor: 'pointer', borderRadius: '5px' };

export default Game;