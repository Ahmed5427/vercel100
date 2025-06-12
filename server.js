const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API Routes
app.post('/api/generate-letter', async (req, res) => {
    try {
        // Validate required fields
        const { category, sub_category, title, recipient, isFirst, prompt, tone } = req.body;
        
        if (!category || !title || !recipient || !prompt || !tone) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: 'category, title, recipient, prompt, and tone are required'
            });
        }

        // Prepare the request body for the external API
        const requestBody = {
            category,
            sub_category: sub_category || '',
            title,
            recipient,
            isFirst: isFirst !== undefined ? isFirst : true,
            prompt,
            tone
        };

        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://128.140.37.194:5000/generate-letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            agent: false,
            rejectUnauthorized: false
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Return the letter data with consistent field names
        res.status(200).json({
            letter: data.Letter || data.letter,
            title: data.Title || data.title || title
        });
    } catch (error) {
        console.error('Error calling generate-letter API:', error);
        res.status(500).json({ 
            error: 'Failed to generate letter',
            details: error.message 
        });
    }
});

app.post('/api/archive-letter', async (req, res) => {
    try {
        // For demo purposes, just return success
        // In a real app, this would save to a database
        console.log('Archiving letter:', req.body);
        res.status(200).json({ success: true, message: 'Letter archived successfully' });
    } catch (error) {
        console.error('Error archiving letter:', error);
        res.status(500).json({ 
            error: 'Failed to archive letter',
            details: error.message 
        });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/create-letter', (req, res) => {
    res.sendFile(path.join(__dirname, 'create-letter.html'));
});

app.get('/review-letter', (req, res) => {
    res.sendFile(path.join(__dirname, 'review-letter.html'));
});

app.get('/archive-letters', (req, res) => {
    res.sendFile(path.join(__dirname, 'archive-letters.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

