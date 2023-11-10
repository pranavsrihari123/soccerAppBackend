const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.json());

// Set up routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
