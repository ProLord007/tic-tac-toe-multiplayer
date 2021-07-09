import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { db } from "../../firebase";
import useRoom from "../../hooks/useRoom";
import { BoardCover, Game, Row, Reset, Container } from "../../styles";
const Board = () => {
  const { id } = useParams();
  const { processing, room } = useRoom(id);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  if (processing) return <h1>Loading Room...</h1>;
  if (!room) return <h1>Room Not Found..</h1>;
  if (loading) return <h1>Resetting the Game...</h1>;
  const { board, gameDone, message, turnCount, playerTurn } = room;

  const sendBoard = async (id, newRoom) => {
    await db.collection("rooms").doc(id).set(newRoom);
  };
  const setSquare = (index) => {
    const newBoard = [...board];
    newBoard[index] = playerTurn;
    let newTurnCount,
      newGameDone = false,
      newMessage = null,
      newPlayerTurn = playerTurn === "X" ? "O" : "X";
    if (!board[index] && !gameDone) {
      // setBoard(newBoard);
      if (turnCount >= 4) {
        if (playerTurn === "X") {
          if (
            (newBoard[0] === "X" &&
              newBoard[1] === "X" &&
              newBoard[2] === "X") ||
            (newBoard[3] === "X" &&
              newBoard[4] === "X" &&
              newBoard[5] === "X") ||
            (newBoard[6] === "X" &&
              newBoard[7] === "X" &&
              newBoard[8] === "X") ||
            (newBoard[0] === "X" &&
              newBoard[4] === "X" &&
              newBoard[8] === "X") ||
            (newBoard[6] === "X" && newBoard[4] === "X" && newBoard[2] === "X")
          ) {
            newMessage = "X Wins!!";
            newGameDone = true;
          }
        } else {
          if (
            (newBoard[0] === "O" &&
              newBoard[1] === "O" &&
              newBoard[2] === "O") ||
            (newBoard[3] === "O" &&
              newBoard[4] === "O" &&
              newBoard[5] === "O") ||
            (newBoard[6] === "O" &&
              newBoard[7] === "O" &&
              newBoard[8] === "O") ||
            (newBoard[0] === "O" &&
              newBoard[4] === "O" &&
              newBoard[8] === "O") ||
            (newBoard[6] === "O" && newBoard[4] === "O" && newBoard[2] === "O")
          ) {
            newMessage = "O Wins !!";
            newGameDone = true;
          }
        }
        if (turnCount === 9) {
          newMessage = "Draw";
          newGameDone = true;
        }
      }
      // setIsX(!isX);
      newTurnCount = turnCount + 1;
      const newRoom = {
        board: newBoard,
        message: newMessage,
        turnCount: newTurnCount,
        gameDone: newGameDone,
        playerTurn: newPlayerTurn,
      };
      sendBoard(id, newRoom);
    }
  };
  const handleReset = async (id) => {
    setLoading(true);
    await db
      .collection("rooms")
      .doc(id)
      .set({
        board: ["", "", "", "", "", "", "", "", ""],
        message: null,
        gameDone: false,
        playerTurn: playerTurn === "X" ? "O" : "X",
        turnCount: 0,
      })
      .then(() => setLoading(false));
  };
  return (
    <BoardCover>
      <h1>Tic-Tac-Toe Room {id}</h1>
      <h3>{message ? message : `Player Turn - ${playerTurn}`}</h3>
      <Game>
        <Row>
          <Container onClick={() => setSquare(0)}>{board[0]}</Container>
          <Container onClick={() => setSquare(1)}>{board[1]}</Container>
          <Container onClick={() => setSquare(2)}>{board[2]}</Container>
        </Row>
        <Row>
          <Container onClick={() => setSquare(3)}>{board[3]}</Container>
          <Container onClick={() => setSquare(4)}>{board[4]}</Container>
          <Container onClick={() => setSquare(5)}>{board[5]}</Container>
        </Row>
        <Row>
          <Container onClick={() => setSquare(6)}>{board[6]}</Container>
          <Container onClick={() => setSquare(7)}>{board[7]}</Container>
          <Container onClick={() => setSquare(8)}>{board[8]}</Container>
        </Row>
      </Game>
      <Reset onClick={() => handleReset(id)}>Reset</Reset>
      <Reset onClick={() => history.push("/")}>Exit</Reset>
    </BoardCover>
  );
};

export default Board;