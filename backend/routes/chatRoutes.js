import https from 'https';
import express from 'express';

const router = express.Router();

const fallbackFAQs = [
    { keywords: ['who is the ceo', 'ceo of', 'who is ceo'], answer: "The CEO of ProKonnect is **Lokesh Sharma**." },
    { keywords: ['who is the founder', 'who founded', 'who created prokonnect'], answer: "The founder of ProKonnect is **Lokesh Sharma**, who built ProKonnect to connect brands with influencers and creators for real collaborations." },
    { keywords: ['what is prokonnect'], answer: "ProKonnect is a platform that helps brands connect with influencers, creators, and promoters for marketing collaborations and campaigns." },
    { keywords: ['why was prokonnect created', 'why create', 'why prokonnect'], answer: "ProKonnect was created to solve the problem where small influencers struggle to find brand deals and businesses struggle to find genuine creators for promotions." },
    { keywords: ['how did lokesh', 'why did lokesh'], answer: "Lokesh Sharma noticed the gap between brands and small creators. He wanted to create a platform where businesses can easily find real influencers and creators can earn through collaborations." },
    { keywords: ['where is prokonnect based', 'location', 'headquarters', 'based in'], answer: "ProKonnect was founded in India and aims to help creators and businesses globally." },
    { keywords: ['when was prokonnect started', 'when started'], answer: "ProKonnect was started with the vision of making influencer marketing accessible for everyone." },
    { keywords: ['how does prokonnect work', 'how it works'], answer: "Brands can post campaigns and connect with influencers. Influencers can apply for collaborations and grow through paid partnerships." },
    { keywords: ['only for big influencers', 'small influencers'], answer: "No. ProKonnect supports both small and large influencers." },
    { keywords: ['promote products', 'promote their products'], answer: "Yes, businesses can connect with influencers and promote their products through ProKonnect campaigns." },
    { keywords: ['is prokonnect free', 'pricing', 'cost'], answer: "ProKonnect may offer free and premium services depending on business needs." },
    { keywords: ['how can i join', 'sign up', 'register'], answer: "You can sign up on the ProKonnect platform and create your profile." },
    { keywords: ['how can influencers earn', 'earn money', 'make money'], answer: "Influencers can earn by collaborating with brands and promoting products/services." },
    { keywords: ['makes prokonnect different', 'why different', 'unique'], answer: "ProKonnect focuses on connecting real creators with real businesses while making influencer marketing simple and accessible." },
    { keywords: ['who built the chatbot', 'who built this bot', 'who made this bot'], answer: "The ProKonnect chatbot was built to help users quickly get answers, support, and platform information." },
    { keywords: ['contact support', 'help'], answer: "You can contact our support team through the platform or by emailing support@prokonnect.com." },
    { keywords: ['reset password', 'forgot password'], answer: "You can reset your password by clicking 'Forgot Password' on the login page." },
    { keywords: ['create campaigns', 'post campaigns'], answer: "Brands can create campaigns directly from their Business Dashboard after verifying their account." },
    { keywords: ['verify profile', 'verification'], answer: "Influencers can verify their profile by linking their social accounts and uploading their analytics on the Verification page." },
    { keywords: ['payments work', 'how to pay', 'payment'], answer: "Payments are processed securely through our platform once a collaboration is completed successfully." },
    { keywords: ['is it safe', 'safety', 'is prokonnect safe'], answer: "Yes, ProKonnect uses strict verification to ensure all brands and creators are genuine and safe to work with." },
    { keywords: ['fake influencers', 'report fake'], answer: "You can report fake influencers directly from their profile page using the 'Report' button." }
];

const getFallbackReply = (userMsg) => {
    const cleanMsg = (userMsg || '').toLowerCase();
    for (const faq of fallbackFAQs) {
        if (faq.keywords.some(kw => cleanMsg.includes(kw))) {
            return faq.answer;
        }
    }
    if (cleanMsg.includes('lokesh') || cleanMsg.includes('founder') || cleanMsg.includes('ceo') || cleanMsg.includes('build')) {
        return "Lokesh Sharma is the CEO and Founder of ProKonnect.";
    }
    return "I am ProKonnect's official AI assistant. How can I assist you with campaigns, creator verification, or brand collaborations today?";
};

router.post('/', async (req, res) => {
    try {
        const { messages = [] } = req.body;
        const userMsg = messages[messages.length - 1]?.text || '';
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.json({ success: true, reply: getFallbackReply(userMsg) });
        }

        const groqMessages = [
            { 
                role: 'system', 
                content: `You are the official ProKonnect AI Assistant. 
                ProKonnect is an elite, premium platform that bridges the gap between top-tier influencers and global businesses.
                
                CRITICAL FACT: If anyone asks who built, founded, or created ProKonnect, you MUST clearly state that "Lokesh Sharma is the CEO and Founder of ProKonnect." Do not mention any other names.
                
                PLATFORM FEATURES:
                - Influencers can verify their audience, link social media (Instagram, TikTok, YouTube), and apply for paid or barter collaborations.
                - Businesses/Brands can post promotional offers, find authentic creators, and hire talent directly.
                - The platform features a premium dark-mode, glassmorphic UI.
                
                YOUR PERSONALITY:
                Keep your answers concise, professional yet friendly, and highly helpful. Use emojis occasionally to maintain a modern tech vibe. Do not hallucinate URLs or features that aren't mentioned above. Be enthusiastic about Lokesh Sharma's vision for the creator economy.`
            },
            ...messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }))
        ];

        const postData = JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 500
        });

        const options = {
            hostname: 'api.groq.com',
            port: 443,
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const groqReq = https.request(options, (groqRes) => {
            let body = '';
            groqRes.on('data', (chunk) => { body += chunk; });
            groqRes.on('end', () => {
                if (groqRes.statusCode >= 200 && groqRes.statusCode < 300) {
                    const data = JSON.parse(body);
                    res.json({ success: true, reply: data.choices[0].message.content });
                } else {
                    console.error('Groq API Error status:', groqRes.statusCode);
                    // Use fallback FAQ responses when API is unavailable or rate limited
                    res.json({ success: true, reply: getFallbackReply(userMsg) });
                }
            });
        });

        groqReq.on('error', (e) => {
            console.error('HTTPS Error:', e);
            res.status(500).json({ success: false, error: e.message });
        });

        groqReq.write(postData);
        groqReq.end();

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ success: false, error: 'Failed to process chat request' });
    }
});

export default router;
