require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = 3000;

// ✅ CORS Setup to allow React frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend URL
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json());

// ✅ Initialize OpenAI for DeepSeek
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_API_URL, // Example: "https://api.deepseek.com/v1"
});

// ✅ Endpoint to handle search
app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a historical touriest gide in tamilnadu india, give the the touries {place},list the touriest in nextline remove wunwanted symbols like#,@*,,do not use this 1 in fist print2 in secondline ' },
        { role: 'user', content: prompt },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('DeepSeek error:', error);
    res.status(500).json({ error: 'Something went wrong with DeepSeek API.' });
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
