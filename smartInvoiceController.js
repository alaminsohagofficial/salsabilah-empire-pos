const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Digital Smart Invoice Handler with Embedded Gemini AI
const handleCustomerAiQuery = async (req, res) => {
    try {
        const { invoice_no, customer_question, emi_status, product_details } = req.body;

        const prompt = `You are the Salsabilah Empire AI Assistant embedded in digital invoice ${invoice_no}. 
        Product: ${JSON.stringify(product_details)}. 
        EMI Status: ${JSON.stringify(emi_status)}. 
        Customer Question: "${customer_question}". 
        Answer politely, inform them about product specs, quality, price, and remind them of their EMI deadline if overdue. Urge them to pay via bKash/Nagad to keep their appliance running smoothly.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.status(200).json({
            success: true,
            ai_reply: response.text
        });
    } catch (err) {
        console.error('AI Invoice Error:', err.message);
        res.status(500).json({ success: false, error: 'AI Assistant temporarily unavailable.' });
    }
};

// 2. IoT Smart Appliance Status & Payment Check (Kill-Switch Logic)
const checkApplianceIoTStatus = async (req, res) => {
    try {
        const { invoice_no, due_date, is_paid } = req.body;
        const currentDate = new Date();
        const dueDateObj = new Date(due_date);

        let applianceStatus = 'ACTIVE';

        if (!is_paid && currentDate > dueDateObj) {
            applianceStatus = 'LOCKED_BY_SALSABILAH_EMPIRE';
            console.log(`🚨 [IoT Kill-Switch]: Invoice ${invoice_no} EMI overdue! Locking refrigerator compressor / Smart TV.`);
        }

        res.status(200).json({
            success: true,
            invoice_no,
            status: applianceStatus,
            message: applianceStatus === 'LOCKED' ? 'Please pay via bKash/Nagad to unlock your appliance.' : 'Appliance is running normally.'
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'IoT Status Check Failed' });
    }
};

module.exports = { handleCustomerAiQuery, checkApplianceIoTStatus };
