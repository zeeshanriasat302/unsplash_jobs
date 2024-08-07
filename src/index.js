// index.js
const express = require('express');
const jobRoutes = require('./jobs/jobRoutes');
const jobController = require('./jobs/jobController');
const cors = require('cors')
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());
app.use('/api', jobRoutes);

jobController.startProcessingJobs();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
