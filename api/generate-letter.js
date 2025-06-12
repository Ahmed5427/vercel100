export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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

        const response = await fetch('https://128.140.37.194:5000/generate-letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
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
}