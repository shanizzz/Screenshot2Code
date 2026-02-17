import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Store uploads in memory (base64 for API)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PNG, JPEG, and WebP images are allowed'));
  },
});

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are an expert UI developer. Convert this screenshot into HTML/CSS that looks PIXEL-PERFECT - as close to the original as possible.

CRITICAL - Match the design EXACTLY:
1. COLORS: Extract exact hex codes from the image. Use background colors, text colors, border colors precisely. Don't approximate - #f3f4f6 is not the same as #f5f5f5.
2. TYPOGRAPHY: Match font families, sizes (px/rem), weights (400, 500, 600, 700), line heights. Add Google Fonts link if the design uses custom fonts.
3. SPACING: Replicate padding, margins, gaps exactly. Pay attention to the proportions between elements.
4. BORDERS & SHADOWS: Match border-radius, border widths, box-shadows, and any subtle depth effects.
5. LAYOUT: Preserve the exact structure - flex/grid alignments, element widths, heights. Center things that are centered.
6. CONTENT: Copy all visible text, labels, placeholders exactly as shown.
7. ICONS: Use heroicons, lucide, or similar CDN if icons are present. Match icon style and size.

TECHNICAL:
- Return ONLY the raw HTML code. No markdown, no \`\`\`html\`\`\`, no explanation before or after.
- Use Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- For colors/spacing Tailwind can't match exactly, use inline style="" for precision.
- Include <meta name="viewport" content="width=device-width, initial-scale=1"> for proper scaling.
- Make the output a complete, self-contained HTML document that renders correctly.`;

app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key not configured. Add GEMINI_API_KEY to your .env file.',
      });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      imagePart,
    ]);

    const response = result.response;
    let html = response.text()?.trim() || '';

    // Strip markdown code blocks if present
    html = html.replace(/^```(?:html)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

    res.json({ html });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      error: error.message || 'Failed to convert image',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
