const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer();
const env = require('dotenv')

const dotenv = env.config()


const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log(`Received message:`, message);
    });

    socket.on('notify', (data) => {
        console.log("notifying", data)
        io.to(data.id).emit('addNotifications', {id: data.id, senderID: data.senderID})
        io.to(data.id).emit('refetch', data.id)
    });
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
    socket.on('join', (roomID) => {
        socket.join(roomID)
    })
    socket.on('leave', (roomID) => {
        console.log("left room " + roomID)
        socket.leave(roomID)
    })
});


//db password: AW23wdaw!

const con = mysql.createPool({
    host: dotenv.parsed.DB_HOST,
    database: dotenv.parsed.DB_DATABASE,
    user: dotenv.parsed.DB_USERNAME,
    password: dotenv.parsed.DB_PASSWORD
})
con.getConnection(function (err) {
    if (err) throw err;
    console.log("Connected!");
})

app.use(bodyParser.json());
app.use(express.static('../build'));


app.post('/api/login', function (req, res) {
    let email = req.body.email
    let password = req.body.password
    let query = `SELECT *
                 FROM users
                 WHERE email = ?
                 AND password = ?`
    con.query(query, [email, password], function (err, result) {
        if (err) throw err;
        res.json(result);
    });
})
app.post('/get-chats', function (req, res) {
    let userID = req.body.id
    let query = `SELECT id, name, image, updated_at
                 FROM chats
                 WHERE id in (SELECT chat_id FROM chat_participants WHERE chats.id = chat_id AND user_id = ?)`;
    con.query(query, [userID], function (err, result) {
        if (err) {
            res.end("error")
            throw err;
        }
        if (result.length === 0) {
            res.json([{name: "No Results", phone: ""}])
            return
        }
        res.json(result);
    });
})
app.post("/create-chat", function (req, res) {
    let userID = req.body.userID
    let chatName = req.body.chatName
    let chatImage = req.body.image
    let chatID = req.body.chatID
    let participants = req.body.participants
    participants.push({id: parseInt(userID), name: req.body.userName, image: req.body.userImage})

    if (participants.length === 0) {
        res.send({success: "false"})
        return
    }

    participants = participants.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
    console.log(participants)
    let query = `INSERT INTO chats (id, name, image, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?)`
    con.query(query, [chatID, chatName, chatImage, getDate_yyyy_mm_dd_HH_MM_SS(), getDate_yyyy_mm_dd_HH_MM_SS()], function (err) {
        if (err) {
            console.log("error", err)
            return;
        }
        for (let i = 0; i < participants.length; i++) {
            query = `INSERT INTO chat_participants (chat_id, user_id)
                     VALUES (?, ?)`
            con.query(query, [chatID, participants[i].id], function (err) {
                if (err) {
                    console.log("error", err)
                }
            })
        }
        res.send({success: "true"})
    })
})

app.post('/get-contact', function (req, res) {
    let userInput = req.body.input
    let query = `SELECT id, name, phone, image
                 FROM users
                 WHERE name LIKE ?
                    or phone LIKE ?`
    con.query(query, [`%${userInput}%`, `%${userInput}%`], function (err, result) {
        if (err) {
            res.end("error")
            throw err;
        }
        if (result.length === 0) {
            res.json([{name: "No Results", phone: ""}])
            return
        }
        res.json(result);
    });
})

app.post('/get-messages', function (req, res) {
    let chatID = req.body.chatID
    let query = `SELECT messages.message, users.name as sender, messages.created_at, messages.user_id
                 FROM messages
                          INNER JOIN users ON messages.user_id = users.id
                 WHERE chat_id = ?
                 ORDER BY messages.created_at ASC`
    con.query(query, [chatID], function (err, result) {
        if (err) {
            console.log("error", err)
            return;
        }
        if (result.length === 0) {
            res.json([{
                user_id: "system", sender: "System", message: "No Messages", created_at: getDate_yyyy_mm_dd_HH_MM_SS()
            }])
            return
        }
        res.json(result);
    });
})

app.post('/send-message', function (req, res) {
    let chatID = req.body.chatID
    let userID = req.body.userID
    let message = req.body.message
    let query = `INSERT INTO messages (chat_id, user_id, message, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?)`
    con.query(query, [chatID, userID, message, getDate_yyyy_mm_dd_HH_MM_SS(), getDate_yyyy_mm_dd_HH_MM_SS()], function (err) {
        if (err) {
            console.log("error", err)
            return;
        }
        res.send({success: "true"})
    })
})
app.get('/', function (req, res) {
    //send back index.html file
    res.sendFile(path.resolve('../build/index.html'));
})

app.get('/chat', function (req, res) {
    //send back index.html file
    res.sendFile(path.resolve('../build/index.html'));
});

app.get('/home', function (req, res) {
    //send back index.html file
    res.sendFile(path.resolve('../build/index.html'));
});


app.listen(3000, function () {
    console.log('Server running at http://localhost:3000');
});


function getDate_yyyy_mm_dd_HH_MM_SS() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

}