import express from 'express';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const rooms = [];
let currentUser = '';

app.post('/api/currentUser', (req, res) => {
    const {username} = req.body;
    currentUser = username;
    res.send(`<p>Logged in as: <strong>${username}</strong></p>`);
})

// app.get('/api/currentUser', (req, res) => {
//     res.send(`
//         <input type="hidden" name="creator" 
//                value="${currentUser || ''}"
//                hx-get="/api/currentUser"
//                hx-trigger="load, userChanged from:body"
//                hx-target="this"
//                hx-swap="outerHTML">
//     `);
// });

app.get('/api/rooms', (req, res) => {
    const roomsList = rooms.map(room => {
        return (`<div class="room" id="room-${room.id}">
        ${roomTemplate(room)}
    </div>`);
    }).join('');

    res.send(roomsList);
})

app.post('/api/rooms', (req, res) => {
    const { name, creator } = req.body;
    const room = {
        id: Date.now().toString(),
        name,
        creator: currentUser
    }

    rooms.push(room);

    res.send(`<div class="room" id="room-${room.id}">
        ${roomTemplate(room)}
    </div>`);

    // res.send(roomsList);
});

app.get('/api/rooms/:id/edit', (req, res) => {
    const room = rooms.find(r => r.id === req.params.id);
    if (!room) return res.status(404).send('Room not found');

    res.send(`
        <div class="room-info">
            <form hx-put="/api/rooms/${room.id}" 
                  hx-target="#room-${room.id}">
                <input type="text" name="name" value="${room.name}" required>
                <button type="submit">Save</button>
                <button hx-get="/api/rooms" 
                        hx-target="#room-${room.id}"
                        type="button">
                    Cancel
                </button>
            </form>
        </div>
    `);
});

app.put('/api/rooms/:id', (req, res) => {
    const roomIndex = rooms.findIndex(r => r.id === req.params.id);
    if (roomIndex === -1) return res.status(404).send('Room not found');

    const { name } = req.body;
    if (!name) return res.status(400).send('Room name is required');

    rooms[roomIndex].name = name;

    res.send(roomTemplate(rooms[roomIndex]));
});

app.delete('/api/rooms/:id', (req, res) => {
    const roomIndex = rooms.findIndex(r => r.id === req.params.id);
    if (roomIndex === -1) return res.status(404).send('Room not found');

    if (rooms[roomIndex].creator !== currentUser) {
        return res.status(403).send('Only room creator can delete');
    }

    rooms.splice(roomIndex, 1);
    
    res.send('');
});

const roomTemplate = (room) => {
    const isCreator = currentUser === room.creator;
    return (
        `<div class="room-info">
                    <h3>${room.name}</h3>
                    <p>Created by: ${room.creator}</p>
                </div>
                <div class="room-actions">
                    ${isCreator ? `
                    <button hx-get="/api/rooms/${room.id}/edit" 
                            hx-target="#room-${room.id}"
                            class="edit-btn">
                        Edit
                    </button>
                    <button hx-delete="/api/rooms/${room.id}" 
                            hx-target="#room-${room.id}"
                            hx-confirm="Are you sure you want to delete this room?"
                            class="delete-btn">
                        Delete
                    </button>
                    ` : ''}
                    <button class="join-btn">Join</button>
                </div>`
    )
}

// start server
app.listen('3000', () => {
    console.log('server is listning on port 3000');
})