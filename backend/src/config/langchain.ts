import { ChatOpenAI } from '@langchain/openai';
import { VALIDATION_CONFIG } from '@/types/shared';

export const createOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required');
  }

  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: VALIDATION_CONFIG.aiConfig.model,
    temperature: VALIDATION_CONFIG.aiConfig.temperature,
    maxTokens: VALIDATION_CONFIG.aiConfig.maxTokens,
  });
};

export const validationPrompt = `
You are an expert CV validation assistant. Your task is to compare form data with CV content and determine if they match.

CV Content:
{cvText}

Form Data:
- Full Name: {fullName}
- Email: {email}
- Phone: {phone}
- Years of Experience: {yearsExperience}
- Skills: {skills}

Validation Rules:
1. Names: Case-insensitive exact match required, allow partial matches (e.g., "Manohar Sai" matches "Phani Manohar Sai")
2. Email: Exact match required
3. Phone: Exact match if provided in form
4. Experience: Calculate total years from all work experience entries. Handle edge cases:
   - "Present", "Current", "Now" = current date
   - "01/2023-" or "01/2023" = from Jan 2023 to present
   - "2023-Present" = from 2023 to present
   - "2023-2024" = 1 year
   - "Jan 2023 - Dec 2024" = 1 year 11 months
   - "2023 to Present" = from 2023 to present
   - Calculate months and convert to years (e.g., 18 months = 1.5 years)
   - ±0.5 years tolerance for comparison
5. Skills: Semantic matching (React.js = ReactJS = React)

Please analyze each field and provide:
1. Is each field a match? (true/false)
2. Confidence score (0.0-1.0)
3. Extracted value from CV (if found)
4. Reason for mismatch (if applicable)

For experience calculation:
- Extract all job durations from CV
- Convert to total years (including months)
- Compare with form years with ±0.5 tolerance
- If CV shows "Present" or "Current", calculate up to current date

Respond in JSON format:
{
  "name": {
    "isMatch": boolean,
    "confidence": number,
    "cvValue": string,
    "reason": string
  },
  "email": {
    "isMatch": boolean,
    "confidence": number,
    "cvValue": string,
    "reason": string
  },
  "phone": {
    "isMatch": boolean,
    "confidence": number,
    "cvValue": string,
    "reason": string
  },
  "experience": {
    "isMatch": boolean,
    "confidence": number,
    "cvValue": number,
    "reason": string
  },
  "skills": {
    "isMatch": boolean,
    "confidence": number,
    "cvValue": string[],
    "reason": string
  },
  "overallConfidence": number,
  "summary": string
}
`;

export const createValidationChain = () => {
  const llm = createOpenAIClient();
  return llm;
}; 