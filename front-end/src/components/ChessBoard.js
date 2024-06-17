import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import io from "socket.io-client";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { set } from "mongoose";

// Dynamically import the Chessboard component, disabling SSR
const Chessboard = dynamic(() => import("chessboardjsx"), { ssr: false });
const Chess = require("chess.js").Chess;

const ChessGame = ({ game }) => {
  const { data: session, status } = useSession();
  const [fen, setFen] = useState("start");
  const [alert, setAlert] = useState();
  const [infoAlert, setInfoAlert] = useState();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const chess = useRef(new Chess());
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);

  const socketRef = useRef();

  const router = useRouter();

  console.log('game', game)
  
  useEffect(() => {
    if (!session) return;

    socketRef.current = io("http://localhost:8080");
    socketRef.current.on("move", (move) => {
      chess.current.move(move);
      setFen(chess.current.fen());
      
    });

    socketRef.current.on("gameOver", (result) => {
      if (result === "checkmate") {
        setAlert("Checkmate!");
      } else if (result === "draw") {
        setAlert("Draw!");
      }
    });

    socketRef.current.on("playerJoined", ({ roomId, user }) => {
      console.log('roomId', roomId, 'user', user,);
      const playerId = user._id;

      if (roomId === game._id && playerId === game.opponent._id) {
        setInfoAlert(`Opponent ${user.username} joined the game!`);
        setWaitingForOpponent(false);
      }
    });

    // When the opponent disconnects
    socketRef.current.on("opponentDisconnected", () => {
      setAlert("Opponent disconnected!");
    });

    socketRef.current.emit("join", {game, user: session?.user});
    socketRef.current.on("opponentDisconnected", () => {
      setAlert("Opponent disconnected!");
    });

    // Cleanup function to disconnect the socket
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [game._id, session?.user._id]);

  if (status === "loading") return null;
  if (status === "unauthenticated") router.push("/api/auth/signin");

  const user = session?.user;
  const role = (() => {
    if(game.initializer === user._id.toString())
      return game.initializerColor
    if(game.opponent === user._id.toString())
      return game.opponentColor
    return null
  })()

  const handleSquareClick = (square) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else if (!selectedSquare || (chess.current.get(square) && chess.current.get(square).color === role)) {
      const moves = chess.current.moves({ square, verbose: true });
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
      console.log('chess.turn() !== role', chess.current.turn(), role)
      if (chess.current.turn() !== role) {
        return;
      }
      const move = chess.current.move({ from, to, promotion: "q" });
      if (move) {
        setFen(chess.current.fen());

        // Emit the move to the opponent
        socketRef.current.emit("move", game._id, {
          from,
          to,
          promotion: "q",
        });

        setSelectedSquare(null);
        setPossibleMoves([]);

      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
      
      if (chess.current.isCheckmate()) {
        setAlert("Checkmate!");

        

      } else if (chess.current.isDraw()) {
        setAlert("Draw!");
      } else if (chess.current.inCheck()) {
        setAlert("Check!");
      }
    } catch (error) {
      console.log('error', error);
      // setAlert("Invalid move!");
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
        orientation={role === "w" ? "white" : "black"}
      />
      <Snackbar
        open={alert}
        autoHideDuration={2500}
        onClose={() => setAlert(undefined)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {alert && <Alert severity="error">{alert}</Alert>}
      </Snackbar>
      <Snackbar
        open={infoAlert}
        autoHideDuration={2500}
        onClose={() => setInfoAlert(undefined)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {infoAlert && <Alert severity="success">{infoAlert}</Alert>}
      </Snackbar>
      <Snackbar
        open={waitingForOpponent && game.opponent._id !== user._id}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="info">Waiting for opponent...</Alert>
      </Snackbar>
    </>
  );
};

export default ChessGame;
