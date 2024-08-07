// controllers/jobController.js
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const jobQueue = [];

const processJobs = async () => {
  if (jobQueue.length > 0) {
    const job = jobQueue.shift();
    try {
      const delay = Math.floor(Math.random() * 60) * 5000;
      console.log("delay ----->", delay)

      setTimeout(async () => {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          params: { query: process.env.CATEGORY },
          headers:{
            Authorization: `Client-ID ${process.env.ACCESS_TOKEN}`
        }        });
        const imageUrl = response.data.urls.full;
        console.log("imageUrl ----->", imageUrl)

        await prisma.job.update({
          where: { id: job.id },
          data: { status: 'completed', result: imageUrl }
        });
      }, delay);
    } catch (error) {
      await prisma.job.update({
        where: { id: job.id },
        data: { status: 'failed' }
      });
    }
  }
};

const startProcessingJobs = () => {
  setInterval(processJobs, 10000);
};

const createJob = async (req, res) => {
  const createdAt = new Date().toISOString();
  const newJob = await prisma.job.create({
    data: { status: 'pending', result: null, createdAt }
  });
  jobQueue.push({ id: newJob.id });
  res.status(201).json({data: { id: newJob.id }});
};

const getJobs = async (req, res) => {
  const jobs = await prisma.job.findMany();
  res.json({data:jobs});
};

const getJobById = async (req, res) => {
  const { jobId } = req.params;
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({data: job});
};

const getJobsByStatus = async (req, res) => {
    const { status } = req.params;
    if(status !== "pending" && status !== "completed"){
        res.json({message: "Invalid status, allowed [pending, completed]"});
        return
    }
    const job = await prisma.job.findMany({ where: { status: status } });
    res.json({data: job});
  };

module.exports = {
  startProcessingJobs,
  createJob,
  getJobs,
  getJobById,
  getJobsByStatus,
};
