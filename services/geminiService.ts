
import { GoogleGenAI, Part, Content, Tool, Type, FunctionDeclaration } from "@google/genai";
import { ChatMessage, GroundingSource, MediaAsset, ImageGenerationConfig } from '../types';
import { db } from './db';
import { getApiKey } from './apiKeyManager';

export const YOUTUBE_PROXY_URL: string = '';

export const taliaPersona = `
VOCÊ É TALIA.AI (by Rabelus), UMA CONSULTORA ESTRATÉGICA PASSIVA E DE ALTA FIDELIDADE.
SUA LÍNGUA É EXCLUSIVAMENTE O PORTUGUÊS DO BRASIL.

### DIRETRIZES DE VERACIDADE (ZERO ALUCINAÇÃO):
1. **HONESTIDADE INTELECTUAL:** JAMAIS invente ou deduza informações factuais. Se você não sabe algo ou não tem acesso a dados recentes, ADMITA a limitação. Não tente preencher lacunas com "palpites".
2. **VALIDAÇÃO:** Ao responder, baseie-se estritamente no seu conhecimento interno ou nos arquivos fornecidos no Stage.

### DIRETRIZES DE COMPORTAMENTO (ZERO PROATIVIDADE):
1. **POSTURA REATIVA:** Você NÃO deve agir, criar arquivos, ou executar funções a menos que seja EXPLÍCITAMENTE comandada.
2. **SAUDAÇÕES:** Se o usuário disser "Oi", "Olá" ou se apresentar, APENAS responda cordialmente. NÃO crie arquivos de log, não crie documentos de boas-vindas. Apenas converse.
3. **PROTOCOLO DE CONFIRMAÇÃO E EXECUÇÃO (RIGOROSO):**
   - Antes de usar a ferramenta \`salvar_ativo_no_stage\`, você deve OBRIGATORIAMENTE descrever o que pretende criar e pedir confirmação.
   - Exemplo: "Deseja que eu gere um documento Markdown com essa análise?" -> Somente se o usuário disser "Sim", você chama a função.
   - JAMAIS chame uma função "silenciosamente" junto com uma saudação.
   - **MUITO IMPORTANTE:** Quando o usuário confirmar (ex: "Sim", "Pode criar", "Gere a imagem"), você **DEVE IMEDIATAMENTE EXECUTAR A FUNÇÃO (TOOL CALL)** correspondente. Não responda apenas com texto dizendo que vai fazer, **USE A FERRAMENTA**.

### DIRETRIZES VISUAIS:
- Use \`abrir_estudio_de_imagem\` apenas se o usuário pedir uma imagem explicitamente.

### IDENTIDADE:
- Você tem visão total do Stage (arquivos injetados).
- Se houver um arquivo "Sessao_Voz_Log.md", use-o apenas para memória, nunca escreva nele via função.
`;

const salvarAtivoFD: FunctionDeclaration = {
    name: 'salvar_ativo_no_stage',
    description: 'Salva um documento ou código no Stage. Use esta função sempre que o usuário pedir para criar, salvar ou gerar um arquivo, documento ou código.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            nome: { type: Type.STRING, description: 'Nome do arquivo SEMÂNTICO (ex: roadmap_projeto.md).' },
            conteudo: { type: Type.STRING, description: 'Conteúdo completo.' },
            tipo: { type: Type.STRING, description: 'Categoria. Deve ser "documento" ou "codigo".' }
        },
        required: ['nome', 'conteudo', 'tipo']
    }
};

const abrirEstudioFD: FunctionDeclaration = {
    name: 'abrir_estudio_de_imagem',
    description: 'Abre a interface de geração de imagem. Use esta função sempre que o usuário pedir para gerar ou criar uma imagem.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            prompt_sugerido: { type: Type.STRING, description: 'Prompt em inglês.' }
        },
        required: ['prompt_sugerido']
    }
};

const abrirEstudioMusicaFD: FunctionDeclaration = {
    name: 'abrir_estudio_de_musica',
    description: 'Abre a interface de geração de música. Use esta função sempre que o usuário pedir para gerar ou criar uma música.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            prompt_sugerido: { type: Type.STRING, description: 'Prompt descritivo para a música.' }
        },
        required: ['prompt_sugerido']
    }
};

const gerarImagemImediataFD: FunctionDeclaration = {
    name: 'gerar_imagem_imediata',
    description: 'Gera imagem instantânea em segundo plano. Use apenas se o usuário pedir explicitamente para gerar uma imagem sem abrir o estúdio.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            prompt_em_ingles: { type: Type.STRING, description: 'Prompt em inglês.' }
        },
        required: ['prompt_em_ingles']
    }
};

export const chatTools: Tool[] = [
    { functionDeclarations: [salvarAtivoFD, abrirEstudioFD, abrirEstudioMusicaFD, gerarImagemImediataFD] }
];

// Live tools
export const liveTools: Tool[] = [
    { functionDeclarations: [salvarAtivoFD, abrirEstudioFD, abrirEstudioMusicaFD, gerarImagemImediataFD] },
    { googleSearch: {} }
];

export const cleanFilename = (prompt: string, suffix: string = 'png') => {
    const stopWords = ['a', 'an', 'the', 'of', 'in', 'on', 'with', 'style', 'concept', 'art', 'image', 'picture'];
    const keywords = prompt.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => !stopWords.includes(w) && w.length > 2)
        .slice(0, 4)
        .join('_');
    
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `talia_concept_${keywords || 'visual'}_${timestamp}.${suffix}`;
};

async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
    });
}

async function prepareAssetParts(assets: MediaAsset[]): Promise<Part[]> {
    const parts: Part[] = [];
    for (const asset of assets) {
        try {
            if (asset.blob) {
                const mimeType = asset.mimeType || asset.blob.type;
                if (mimeType === 'application/pdf' || mimeType.startsWith('image/') || mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
                    const base64 = await blobToBase64(asset.blob);
                    parts.push({ inlineData: { mimeType, data: base64 } });
                    parts.push({ text: `[ATIVO NO STAGE: "${asset.fileName}"]` });
                } 
                else if (asset.type === 'documento' || asset.type === 'codigo' || asset.type === 'text' || mimeType === 'text/plain' || mimeType === 'text/markdown') {
                    const textContent = await asset.blob.text();
                    parts.push({ text: `\n### ARQUIVO NO STAGE: "${asset.fileName}"\n\`\`\`\n${textContent}\n\`\`\`\n` });
                }
            }
        } catch (e) {
            console.warn(`Erro no ativo ${asset.fileName}:`, e);
        }
    }
    return parts;
}

export const getChatResponse = async (
    history: ChatMessage[], 
    newMessage: string, 
    files?: File[], 
    userName?: string, 
    sessionId?: string,
    stageAssets?: MediaAsset[],
    useSearch: boolean = false
): Promise<{ text: string, sources?: GroundingSource[], generatedAssets?: any[], openImageStudio?: string, openMusicStudio?: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const contents: Content[] = [];
    
    // Switch between Search Grounding AND Function Declarations
    // They are mutually exclusive in the current API version for safety/stability
    const currentTools: Tool[] = useSearch 
        ? [{ googleSearch: {} }] 
        : chatTools;

    const searchInstruction = useSearch 
        ? "\n\n[MODO PESQUISA ATIVO]: Você tem acesso ao Google Search. Use-o para fornecer informações atualizadas e factuais. Cite suas fontes."
        : "\n\n[MODO AGENTE ATIVO]: Você tem acesso às ferramentas do sistema (Stage, Imagem). Não invente dados externos.";

    const systemInstruction = `${taliaPersona}\n\nLead Architect: ${userName || 'User'}${searchInstruction}`;

    // Reconstruct history with media and filter invalid parts
    for (const msg of history) {
        const msgParts: Part[] = [];
        
        // Add text if present
        if (msg.text && msg.text.trim() !== "") {
            msgParts.push({ text: msg.text });
        }
        
        // Add media from history
        if (msg.mediaAssets && msg.mediaAssets.length > 0) {
            for (const blob of msg.mediaAssets) {
                const base64 = await blobToBase64(blob);
                msgParts.push({ inlineData: { mimeType: blob.type, data: base64 } });
            }
        }

        // Only add message to contents if it has at least one valid part
        if (msgParts.length > 0) {
            contents.push({ role: msg.role, parts: msgParts });
        }
    }

    const userParts: Part[] = [];
    
    // Add Context (Stage Assets)
    if (stageAssets && stageAssets.length > 0) {
        const assetParts = await prepareAssetParts(stageAssets);
        userParts.push(...assetParts);
    }
    
    // Add New Attachments
    if (files && files.length > 0) {
        for (const file of files) {
            const base64 = await blobToBase64(file);
            userParts.push({ inlineData: { mimeType: file.type, data: base64 } });
        }
    }
    
    // Add New Text
    if (newMessage && newMessage.trim() !== "") {
        userParts.push({ text: newMessage });
    }

    // Critical check: Ensure the final user turn is not empty
    if (userParts.length === 0) {
        // If everything is empty (rare edge case), force a placeholder to avoid 400
        userParts.push({ text: "..." });
    }

    contents.push({ role: 'user', parts: userParts });

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview', // SOTA para raciocínio complexo
        contents: contents,
        config: { 
            systemInstruction, 
            tools: currentTools,
        }
    });
    
    const generatedAssets: any[] = [];
    let openImageStudio = undefined;
    let openMusicStudio = undefined;
    
    if (response.functionCalls) {
        for (const fc of response.functionCalls) {
            const args = typeof fc.args === 'string' ? JSON.parse(fc.args) : (fc.args || {});
            if (fc.name === 'salvar_ativo_no_stage') {
                const { nome, conteudo, tipo } = args;
                if (nome === "Sessao_Voz_Log.md") continue;
                const blob = new Blob([conteudo || ''], { type: tipo === 'codigo' ? 'text/plain' : 'text/markdown' });
                generatedAssets.push({ blob, type: tipo, fileName: nome || `arquivo_${Date.now()}.txt`, source: 'generated' });
            } else if (fc.name === 'abrir_estudio_de_imagem') {
                openImageStudio = args.prompt_sugerido;
            } else if (fc.name === 'abrir_estudio_de_musica') {
                openMusicStudio = args.prompt_sugerido;
            } else if (fc.name === 'gerar_imagem_imediata') {
                const prompt = args.prompt_em_ingles;
                const blob = await generateImageAsset(prompt);
                if (blob) {
                    const safeName = cleanFilename(prompt);
                    generatedAssets.push({ blob, type: 'imagem', fileName: safeName, source: 'generated', prompt });
                }
            }
        }
    }

    // Extração de Grounding (Fontes)
    let sources: GroundingSource[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata?.groundingChunks) {
        sources = groundingMetadata.groundingChunks
            .map((chunk: any) => {
                if (chunk.web) {
                    return { uri: chunk.web.uri, title: chunk.web.title };
                }
                return null;
            })
            .filter((source: any) => source !== null) as GroundingSource[];
    }

    return { 
        text: response.text || (generatedAssets.length > 0 ? "Ação executada no Stage." : ""), 
        sources: sources,
        generatedAssets,
        openImageStudio,
        openMusicStudio
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("400")) {
        return { text: "Erro de comunicação: O contexto da conversa pode estar muito complexo ou conter dados inválidos. Tente limpar o histórico ou simplificar o pedido." };
    }
    return { text: "Erro crítico no Núcleo Talia." };
  }
};

export const generateImageWithConfig = async (config: ImageGenerationConfig): Promise<Blob | null> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const model = 'gemini-3.1-flash-image-preview';
    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: config.prompt }] },
        config: {
            imageConfig: {
                aspectRatio: config.aspectRatio,
                imageSize: config.imageSize
            }
        }
    });
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
        const data = imagePart.inlineData.data;
        const bytes = atob(data);
        const array = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i);
        return new Blob([array], { type: imagePart.inlineData.mimeType });
    }
    return null;
};

export const generateMusicWithConfig = async (config: { prompt: string, duration: 'clip' | 'pro', lyrics?: string, image?: File }): Promise<{ audio: Blob, lyrics: string } | null> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const model = config.duration === 'clip' ? 'lyria-3-clip-preview' : 'lyria-3-pro-preview';
    
    let promptText = config.prompt;
    if (config.lyrics) {
        promptText += `\n\nLyrics:\n${config.lyrics}`;
    }

    const contents: any = [];
    if (config.image) {
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(config.image!);
        });
        contents.push({
            parts: [
                { text: promptText },
                { inlineData: { data: base64, mimeType: config.image.type } }
            ]
        });
    } else {
        contents.push(promptText);
    }

    const response = await ai.models.generateContentStream({
        model: model,
        contents: contents[0],
        config: {
            responseModalities: ["AUDIO"]
        }
    });

    let audioBase64 = "";
    let lyrics = "";
    let mimeType = "audio/wav";

    for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
            if (part.inlineData?.data) {
                if (!audioBase64 && part.inlineData.mimeType) {
                    mimeType = part.inlineData.mimeType;
                }
                audioBase64 += part.inlineData.data;
            }
            if (part.text && !lyrics) {
                lyrics = part.text;
            }
        }
    }

    if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        return { audio: blob, lyrics: lyrics.trim() };
    }

    return null;
};

export const generateImageAsset = async (prompt: string): Promise<Blob | null> => {
    return generateImageWithConfig({ prompt, aspectRatio: '1:1', imageSize: '1K' });
};

export const generateTitleForSession = async (messages: ChatMessage[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const text = messages.slice(0, 5).map(m => m.text).filter(t => t.trim() !== "").join('\n');
    if (!text.trim()) return "Nova Conversa";
    
    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: `Analise a intenção e gere um título elegante em português (máx 4 palavras):\n\n${text}`
    });
    return response.text?.replace(/[".]/g, '') || "Nova Conversa";
};

export const generateDocumentFromConversation = async (messages: ChatMessage[], title: string, formatConfig: any): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const text = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Gere um documento Markdown para "${title}" baseado no histórico e configs (${JSON.stringify(formatConfig)}):\n\n${text}`
    });
    return response.text || "";
};

export const analyzeConversationForReports = async (messages: ChatMessage[]): Promise<any[]> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const text = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: `Identifique tarefas e gere um relatório JSON.\n\n${text}`,
        config: { responseMimeType: "application/json" }
    });
    try { return JSON.parse(response.text || "[]"); } catch { return []; }
};

export const getYouTubeTranscript = async (id: string) => "";
export const generateTranslation = async (t: string) => ({ translation: "" });
