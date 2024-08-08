// index.js
const express = require('express');
const jobRoutes = require('./src/jobs/jobRoutes');
const jobController = require('./src/jobs/jobController');
const cors = require('cors')
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use('/api', jobRoutes);
app.get('/', (req, res) => {
  res.status(200).json({message: "Hello World!"});
});
jobController.startProcessingJobs();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
