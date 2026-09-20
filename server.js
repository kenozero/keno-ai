const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// جلب المفتاح من ملف .env أو استخدام القيمة الاحتياطية المباشرة
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAeTnEQmRvrXqocPQZeB4rPpr6dCJhoq3A";

// مسار فحص حالة السيرفر
app.get('/api/status', (req, res) => {
    res.json({ 
        status: "success", 
        message: "KENO_ZERO API is running online",
        version: "1.0.0" 
    });
});

// مسار معالجة المحادثة والذكاء الاصطناعي
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, error: "حقل الرسالة مطلوب" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.json({ success: true, reply: reply });
        } else {
            return res.status(500).json({ success: false, error: data.error?.message || "فشل استخراج الاستجابة" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KENO API active on port ${PORT}`));
