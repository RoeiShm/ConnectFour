const { log } = require('console');
const notifier = require('node-notifier');
let http = require('http');
let url = require('url');
let st = require('./server_tools');

//here the server side start running
http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let path = q.pathname;
    if (path.startsWith("/api")) {
        path = path.substring(4);
        let username = q.query.username;
        let password = q.query.password;
        if (!username || !password) { //if there is no username or no password so 400
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("username and password are required");
            return;
        }
        if (path.startsWith("/signup")) { //signup with a new username
            st.query("INSERT INTO users(username,password) VALUES (?,?)", [username, password], (result, err) => {
                if (err) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("taken"); //this username is already choosen
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("ok");
            });
        } else if (path.startsWith("/login")) { //login with username and password from the database
            validateUser(username, password, (isValid) => {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(isValid ? "ok" : "invalid");
            });
        } else if (path.startsWith("/get_lobby")) {//get a list of all users that are currently waiting in the lobby
            st.query("UPDATE users SET lobby=? WHERE username=? AND NOT lobby=-1", [Date.now(), username], (result, err) => { //-1 is i already been choosed
                if (err) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("error");
                    return;
                }
                st.query("SELECT username FROM users WHERE ? - lobby < 2000", [Date.now()], (result, err) => { //every 2 sec it update the users in the lobby automaticly
                    if (err) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("error");
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                });
            });
        } else if (path.startsWith("/start_game")) {//when user picks up another user from the lobby
            let partner = q.query.partner;
            if (!partner) return;
            st.query("UPDATE users SET lobby = -1 WHERE username IN (?,?) AND ?-lobby<2000", [username, partner, Date.now()], (result, err) => { //-1 means that i already been choosed by someone
                if (err) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("error");
                    return;
                }
                if (result.affectedRows == 2) {
                    st.query("INSERT INTO games(player1,player2) VALUES (?,?)", [username, partner], (result, err) => { //player1 is the one who clicked
                        if (err) {
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end("error");
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end("ok");
                    });
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end("error");
                }
            });
        } else if (path.startsWith("/leave_game")) {
            endGame(username, res, st);
        } else if (path.startsWith("/get_game_id")) { //game id check
            st.query("SELECT id FROM games WHERE (player1=? OR player2=?) AND active=1", [username, username], (result, err) => {
                if (err) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("error");
                    return;
                }
                if (result.length >= 1) {
                    let gameId = result[0].id;
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(gameId + "");
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end("-1");
                }
            });
        } else if (path.startsWith("/get_game_status")) { //status check (players, active or not, and what inside the cells 0 or 1)
            let gameId = q.query.id;
            if (!gameId) return; //if there is gameId
            st.query("SELECT player1,player2,active,cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,cell12,cell13,cell14,cell15,cell16,cell17,cell18,cell19,cell20,cell21,cell22,cell23,cell24,cell25,cell26,cell27,cell28,cell29,cell30,cell31,cell32,cell33,cell34,cell35,cell36,cell37,cell38,cell39,cell40,cell41,cell42 FROM games WHERE id=? AND (player1=? OR player2=?)", [gameId, username, username], (result, err) => {
                if (err) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("error");
                    return;
                }
                if (result.length == 1) {
                    let gameStatus = {
                        id: gameId,
                        player1: result[0].player1,
                        player2: result[0].player2,
                        active: result[0].active[0] == 1,
                        board: [result[0].cell1, result[0].cell2, result[0].cell3, result[0].cell4, result[0].cell5, result[0].cell6, result[0].cell7, result[0].cell8, result[0].cell9, result[0].cell10, result[0].cell11, result[0].cell12, result[0].cell13, result[0].cell14, result[0].cell15, result[0].cell16, result[0].cell17, result[0].cell18, result[0].cell19, result[0].cell20, result[0].cell21, result[0].cell22, result[0].cell23, result[0].cell24, result[0].cell25, result[0].cell26, result[0].cell27, result[0].cell28, result[0].cell29, result[0].cell30, result[0].cell31, result[0].cell32, result[0].cell33, result[0].cell34, result[0].cell35, result[0].cell36, result[0].cell37, result[0].cell38, result[0].cell39, result[0].cell40, result[0].cell41, result[0].cell42]
                    };

                    //check if there is 4 red/yellow coins in column/row/diagonal
                    //column check 1 (red)
                    for (let i = 1; i <= 7; i++) { //upper row
                        let columnCounter1 = 0; //counter how many coins there is together
                        for (let j = i; j <= i + 35; j += 7) { //column
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 7)] && result[0]['cell' + j] == 1 && result[0]['cell' + (j + 7)] == 1) {
                                columnCounter1++; // there is coins togheter
                                if (columnCounter1 >= 3) { //there is 4 coins togheter
                                    onsole.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 1 Won!',
                                        icon: './red.png'
                                    });
                                }
                            } else {
                                columnCounter1 = 0; //the coins are not togheter
                            }
                        }
                    }

                    //row check 1 (red)
                    for (let i = 1; i <= 36; i += 7) { //left column
                        let rowCounter1 = 0; //counter how many coins there is together
                        for (let j = i; j < i + 6; j++) { //row
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 1)] && result[0]['cell' + j] == 1 && result[0]['cell' + (j + 1)] == 1) {
                                rowCounter1++; // there is coins togheter
                                if (rowCounter1 >= 3) { //there is 4 coins togheter
                                    console.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 1 Won!',
                                        icon: './red.png'
                                    });
                                }
                            } else {
                                rowCounter1 = 0; //the coins are not togheter
                            }
                        }
                    }

                    //diagonal to right check 1 (red)
                    for (let i = 1; i <= 4; i++) { //the left side of the upper row
                        let diagonalRightCounter1 = 0; //counter how many coins there is together
                        for (let j = i; j <= i + 42; j += 8) { //diagonal to the right
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 8)] && result[0]['cell' + j] == 1 && result[0]['cell' + (j + 8)] == 1) {
                                diagonalRightCounter1++; // there is coins togheter
                                if (diagonalRightCounter1 >= 3) { //there is 4 coins togheter
                                    console.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 1 Won!',
                                        icon: './red.png'
                                    });
                                }
                            } else {
                                diagonalRightCounter1 = 0; //the coins are not togheter
                            }
                        }
                    }

                    //diagonal to left check 1 (red)
                    for (let i = 4; i <= 7; i++) { //the right side of the upper row
                        let diagonalLeftCounter1 = 0; //counter how many coins there is together
                        for (let j = i; j <= i + 42; j += 6) { //diagonal to the left
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 6)] && result[0]['cell' + j] == 1 && result[0]['cell' + (j + 6)] == 1) {
                                diagonalLeftCounter1++; // there is coins togheter
                                if (diagonalLeftCounter1 >= 3) { //there is 4 coins togheter
                                    console.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 1 Won!',
                                        icon: './red.png'
                                    });
                                }
                            } else {
                                diagonalLeftCounter1 = 0; //the coins are not togheter
                            }
                        }
                    }

                    //column check 2 (yellow)
                    for (let i = 1; i <= 7; i++) { //upper row
                        let columnCounter2 = 0; //counter how many coins there is together
                        for (let j = i; j <= i + 35; j += 7) { //column
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 7)] && result[0]['cell' + j] == 2 && result[0]['cell' + (j + 7)] == 2) {
                                columnCounter2++; // there is coins togheter
                                if (columnCounter2 >= 3) { //there is 4 coins togheter
                                    console.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 2 Won!',
                                        icon: './yellow.png'
                                    });
                                }
                            } else {
                                columnCounter2 = 0; //the coins are not togheter
                            }
                        }
                    }


                    //row check 2 (yellow)
                    for (let i = 1; i <= 36; i += 7) { //left column
                        let rowCounter2 = 0; //counter how many coins there is together
                        for (let j = i; j < i + 6; j++) { //row
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 1)] && result[0]['cell' + j] == 2 && result[0]['cell' + (j + 1)] == 2) {
                                rowCounter2++; // there is coins togheter
                                if (rowCounter2 >= 3) { //there is 4 coins togheter 
                                    console.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 2 Won!',
                                        icon: './yellow.png'
                                    });
                                }
                            } else {
                                rowCounter2 = 0; //the coins are not togheter
                            }
                        }
                    }

                    //diagonal to right check 2 (yellow)
                    for (let i = 1; i <= 4; i++) { //the left side of the upper row
                        let diagonalRightCounter2 = 0; //counter how many coins there is together
                        for (let j = i; j <= i + 42; j += 8) { //diagonal to the right
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 8)] && result[0]['cell' + j] == 2 && result[0]['cell' + (j + 8)] == 2) {
                                diagonalRightCounter2++; // there is coins togheter
                                if (diagonalRightCounter2 >= 3) { //there is 4 coins togheter
                                    console.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 2 Won!',
                                        icon: './yellow.png'
                                    });
                                }
                            } else {
                                diagonalRightCounter2 = 0; //the coins are not togheter
                            }
                        }
                    }

                    //diagonal to left check 2 (yellow)
                    for (let i = 4; i <= 7; i++) { //the right side of the upper row
                        let diagonalLeftCounter2 = 0; //counter how many coins there is together
                        for (let j = i; j <= i + 42; j += 6) { //diagonal to the left
                            if (result[0]['cell' + j] == result[0]['cell' + (j + 6)] && result[0]['cell' + j] == 2 && result[0]['cell' + (j + 6)] == 2) {
                                diagonalLeftCounter2++; // there is coins togheter
                                if (diagonalLeftCounter2 >= 3) { //there is 4 coins togheter
                                    console.log('end');
                                    endGame(username, res, st);
                                    notifier.notify({
                                        title: 'There is a WINNER',
                                        message: 'Player 2 Won!',
                                        icon: './yellow.png'
                                    });
                                }
                            } else {
                                diagonalLeftCounter2 = 0; //the coins are not togheter
                            }
                        }
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(gameStatus));
                }
            });
        } else if (path.startsWith("/play_cell")) {
            let cell = q.query.cell;
            let gameId = q.query.id;
            if (cell && gameId) {
                cell = parseInt(cell);
                gameId = parseInt(gameId);
                if (isNaN(cell) || isNaN(gameId) || cell < 0 || cell > 42) { //check if vaild cell
                    res.end("");
                    return;
                }
                st.query("SELECT player1,player2,cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9,cell10,cell11,cell12,cell13,cell14,cell15,cell16,cell17,cell18,cell19,cell20,cell21,cell22,cell23,cell24,cell25,cell26,cell27,cell28,cell29,cell30,cell31,cell32,cell33,cell34,cell35,cell36,cell37,cell38,cell39,cell40,cell41,cell42 FROM games WHERE id=? AND active=1", [gameId], (result, err) => {
                    if (err) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("error");
                        return;
                    }
                    if (result.length == 1) {
                        let player1 = result[0].player1;
                        let player2 = result[0].player2;
                        if (player1 == username || player2 == username) {
                            let redOrYellow = player1 == username ? 1 : 2;
                            let board = [result[0].cell1, result[0].cell2, result[0].cell3, result[0].cell4, result[0].cell5, result[0].cell6, result[0].cell7, result[0].cell8, result[0].cell9, result[0].cell10, result[0].cell11, result[0].cell12, result[0].cell13, result[0].cell14, result[0].cell15, result[0].cell16, result[0].cell17, result[0].cell18, result[0].cell19, result[0].cell20, result[0].cell21, result[0].cell22, result[0].cell23, result[0].cell24, result[0].cell25, result[0].cell26, result[0].cell27, result[0].cell28, result[0].cell29, result[0].cell30, result[0].cell31, result[0].cell32, result[0].cell33, result[0].cell34, result[0].cell35, result[0].cell36, result[0].cell37, result[0].cell38, result[0].cell39, result[0].cell40, result[0].cell41, result[0].cell42];
                            let countX = 0; //counter to know if its player1 is turn or player2 is turn
                            for (let i = 0; i < 42; i++) { //42 turns max
                                if (board[i] != 0) countX++;
                            }
                            let isRedturn = countX % 2 == 0; //player1 (red) plays in the when the counter is even (0,2,4...)

                            //put the coin in the lower free cell of the column
                            const column = cell % 7; // calculate the column index
                            let i = 0;
                            let row = -1; //invalid value to row index
                            for (let i = 5; i >= 0; i--) { //rows from bottom to top
                                const rowIndex = i * 7 + column; //calculate the index of the cell in this row and column
                                if (board[rowIndex] === 0) { //check if the cell is empty
                                    row = i; //store the row index of the empty cell
                                    break; //exit the loop after finding the first available cell
                                }
                            }
                            if (row !== -1) { //check if a valid empty cell was found
                                const cellNumber = row * 7 + column + 1; //calculate the cell number (1 to 42)
                                if ((isRedturn && redOrYellow === 1) || (!isRedturn && redOrYellow === 2)) {
                                    // update the game state with the player's move
                                    st.query("UPDATE games SET cell" + cellNumber + " = ? WHERE id = ?", [redOrYellow, gameId], (result, err) => {
                                        if (err) {
                                            res.writeHead(200, { "Content-Type": "text/plain" });
                                            res.end("error");
                                        } else {
                                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                                            res.end("ok");
                                        }
                                    });
                                } else {
                                    //this is not the turn of this player
                                    res.end("ooops");
                                }
                            } else {
                                //this cell is already full
                                res.end("column full");
                            }
                        }
                    } else {
                        res.end("ooops");
                        return;
                    }
                });
            } else {
                res.end();
                return;
            }

        }
    } else {//server static files
        st.serveStaticFile(path, res);
    }
}).listen(8080, () => { //the number of the port
    console.log('now listening...');
});

function validateUser(username, password, callback) { //check the username and password, we use this function for login
    st.query("SELECT COUNT(*) AS count FROM users WHERE username=? AND BINARY password=?", [username, password], (result, err) => {
        if (err) {
            callback(false);
            return;
        }
        callback(result[0].count == 1);
    });
}

function endGame(username, res, st) { //end this game, we use this function when someone want to leave game or there is a winner so we have to end this active game
    //how to find my partner?
    //go over all games that I am either player1 or player2
    //from those games, if I am i.e player1, then player2 is my partner
    //if I am player2, then my partner is player1
    st.query("SELECT id,player1,player2 FROM games WHERE (player1=? OR player2=?) AND active=1", [username, username], (result, err) => { //just 1 game is active
        if (err) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("error");
            return;
        }
        if (result.length >= 1) {
            let gameId = result[0].id;
            let partner;
            if (result[0].player1 == username) { //check if I am player1
                partner = result[0].player2; //if I am player1 so my partner is player2
            } else {
                partner = result[0].player1; //if I am not player1 so my partner is player1
            }
            st.query("UPDATE games SET active=0 WHERE id=? AND active=1", [gameId], (result, err) => { //update the game to be not active
                if (err) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("error");
                    return;
                }
                if (result.affectedRows == 1) {
                    //me and the parnter go back to the lobby
                    st.query("UPDATE users SET lobby=0 WHERE username IN (?,?)", [username, partner], (result, err) => {
                        if (err) {
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end("error");
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end("ok");
                    });
                } else if (result.affectedRows == 0) { //i am alone in the game (without my partner)
                    // i go back to the lobby
                    st.query("UPDATE users SET lobby=0 WHERE username = ?", [username], (result, err) => {
                        if (err) {
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end("error");
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end("ok");
                    });
                }
            });
        }
    });
}