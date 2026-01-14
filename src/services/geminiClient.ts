import * as vscode from 'vscode';

type GeminiPart = { text?: string };
type GeminiCandidate = {
    content?: { parts?: GeminiPart[] };
};
type GeminiResponse = {
    candidates?: GeminiCandidate[];
};

export function extractResponse(data:GeminiResponse[]){
    if (!Array.isArray(data) || data.length === 0){
        throw new Error("empty data");
    }
    const candidateTexts:string[] = [];
    for (const response of data){
        const candidates = response.candidates;

        if (!Array.isArray(candidates)){ continue;}

        for (const candidate of candidates) {
            const parts = candidate.content?.parts;

            if (!Array.isArray(parts)) {continue;}

            const text = parts
                .map(p => p.text)
                .filter((t): t is string => Boolean(t))
                .join('\n\n');

            if (text) {
                candidateTexts.push(text);
            }
        }
    }
    if (candidateTexts.length === 0) {
        throw new Error('No text found in Gemini candidates');
    }

    return candidateTexts.join('\n\n---\n\n');
}


export async function explainWithGemini(code:string,apiKey:string): Promise<string> {
    const MODEL_ID = "gemini-2.5-flash";
    const GEMINI_API_KEY = apiKey;
    const response  = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:streamGenerateContent?key=${GEMINI_API_KEY}`,
        {
            method:"POST",
            headers: {'Content-Type':"application/json"},
            body: JSON.stringify({
                contents:[{
                    parts:[{
                        text:`Explain the following code:\n\n${code}`
                    }]
                }]
            })
        }
    );

    const raw_response = await response.text();
    const data = JSON.parse(raw_response) as GeminiResponse[];
    return extractResponse(data);
}


