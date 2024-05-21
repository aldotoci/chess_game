import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import io from "socket.io-client";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

let socket;

// Dynamically import the Chessboard component, disabling SSR
const Chessboard = dynamic(() => import("chessboardjsx"), { ssr: false });
const Chess = require("chess.js").Chess;

const ChessGame = ({ game }) => {
  console.log('game', game);
  const { data: session, status } = useSession();
  const [fen, setFen] = useState("start");
  const [alert, setAlert] = useState();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [chess] = useState(new Chess());
  
  const router = useRouter();
  
  useEffect(() => {
    socket = io();
    socket.on("move", (move) => {
      chess.move(move);
      setFen(chess.fen());
    });

    return () => {
      socket.off("move");
    };
  }, []);

  if (status === "loading") return null;
  if (status === "unauthenticated") router.push("/api/auth/signin");

  const user = session?.user;
  const role = game.initializer.toString() === user._id.toString() ? game.initializerColor : game.opponentColor;

  const handleSquareClick = (square) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else if (!selectedSquare || (chess.get(square) && chess.get(square).color === role)) {
      const moves = chess.moves({ square, verbose: true });
      setSelectedSquare(square);
      setPossibleMoves(moves.map((move) => move.to));
    } else if (possibleMoves.includes(square)) {
      handleMove(selectedSquare, square);
    } else {
      handleMove(selectedSquare, square);
    }
  };

  const handleMove = (from, to) => {
    try {
      const move = chess.move({ from, to, promotion: "q" });

      if (move) {
        if (chess.turn() !== role) {
          return;
        }

        setFen(chess.fen());
        setSelectedSquare(null);
        setPossibleMoves([]);

        socket.emit("move", move);
        console.log("Sent a move");
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
      
      if (chess.isCheckmate()) {
        setAlert("Checkmate!");
      } else if (chess.isDraw()) {
        setAlert("Draw!");
      } else if (chess.inCheck()) {
        setAlert("Check!");
      }

    } catch (error) {
      console.log('error', error);
      setAlert("Invalid move!");
    }
  };

  const squareStyling = () => {
    const styles = {};
    possibleMoves.forEach((move) => {
      styles[move] = {
        background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
        borderRadius: "50%",
      };
    });
    if (selectedSquare) {
      styles[selectedSquare] = {
        background: "rgba(255, 255, 0, 0.4)",
      };
    }
    return styles;
  };

  return (
    <>
      <Chessboard
        position={fen}
        onDrop={({ sourceSquare, targetSquare }) =>
          handleMove(sourceSquare, targetSquare)
        }
        onSquareClick={handleSquareClick}
        squareStyles={squareStyling()}
      />
      <Snackbar
        open={alert}
        autoHideDuration={2500}
        onClose={() => setAlert(undefined)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {alert && <Alert severity="error">{alert}</Alert>}
      </Snackbar>
    </>
  );
};

export default ChessGame;
