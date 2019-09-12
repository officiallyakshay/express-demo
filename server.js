const express = require('express');
const path = require('path');
const app = express();

const db = require('./db')('./users.json', (item, items) => {
  if (!item.name) {
    return 'name is required';
  }
  if (items.map( i => i.name ).includes(item.name)) {
    return 'name must be unique';
  }
});

app.use((req, res, next) => {
  console.log(`you called ${req.url} as a ${req.method}`)
  next();
})
app.use(express.json());

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await db.findAll());
  }
  catch(ex) {
    next(ex);
  }
})

app.post('/api/users', async (req, res, next) => {
  try {
    res.send(await db.create(req.body));
  }
  catch(ex) {
    next(ex);
  }
});

app.delete('/api/users/:id', async (req, res, next) => {
  try {
    await db.destroy(req.params.id);
    res.sendStatus(204);
  }
  catch(ex) {
    next(ex)
  }
});

//error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: err.message });
})

app.listen(3000, () => console.log('listening on port 3000'));