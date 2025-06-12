export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Test if the original API is reachable
        const testResponse = await fetch('https://128.140.37.194:5000/generate-letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: "طلب",
                sub_category: "اختبار",
                title: "اختبار الاتصال",
                recipient: "اختبار",
                isFirst: true,
                prompt: "هذا اختبار للتأكد من عمل الخدمة",
                tone: "رسمي"
            }),
            timeout: 10000
        });

        res.status(200).json({
            apiStatus: testResponse.ok ? 'Working' : 'Error',
            statusCode: testResponse.status,
            message: testResponse.ok ? 'API is working properly' : 'API is not responding correctly'
        });
    } catch (error) {
        res.status(200).json({
            apiStatus: 'Down',
            error: error.message,
            message: 'Unable to reach the API server'
        });
    }
}