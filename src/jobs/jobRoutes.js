// routes/jobRoutes.js
const express = require('express');
const jobController = require('../jobs/jobController');

const router = express.Router();

router.post('/jobs',  jobController.createJob);
router.get('/jobs', jobController.getJobs);
router.get('/jobs/:jobId', jobController.getJobById);
router.get('/jobs/status/:status', jobController.getJobsByStatus);


module.exports = router;
