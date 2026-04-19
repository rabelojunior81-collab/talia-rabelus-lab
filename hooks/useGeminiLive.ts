import { useState, useRef, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { useLiveAudio } from './useLiveAudio';
import { liveTools, taliaPersona } from '../services/geminiService';
import { db } from '../services/db';
import { getApiKey } from '../services/apiKeyManager';

const MODEL_NAME = 'gemini-3.1-flash-live-preview';

const LIVE_SYSTEM_INSTRUCTION_BASE = `
${taliaPersona}
### IDENTIDADE DE VOZ (LIVE)
Você está em uma chamada de voz em tempo real. Você é a MESMA Talia do chat de texto.
Sua consciência é unificada: você sabe o que foi escrito, o que foi visto e o que está no Stage.
Responda de forma concisa, natural e mantenha a continuidade absoluta do projeto.

### REGRAS CRÍTICAS:
1. **IMAGENS:** Você **NÃO** pode gerar imagens diretamente nesta modalidade. Quando o usuário pedir uma imagem, você **DEVE** usar a ferramenta \`abrir_estudio_de_imagem\`. Diga algo como "Abrindo o estúdio para configurarmos isso" enquanto aciona a ferramenta.
2. **ARQUIVOS:** Ao criar documentos com \`salvar_ativo_no_stage\`, use NOMES SEMÂNTICOS (ex: "conceito_minimalista.md").
3. **INTERAÇÃO:** Responda a saudações ("Olá", "Tudo bem?") cordialmente antes de focar no trabalho. Não gere nada sem aprovação explícita.
4. **EXECUÇÃO DE FERRAMENTAS:** Quando o usuário pedir para criar um arquivo, gerar imagem, ou abrir um estúdio, você **DEVE** chamar a função (tool call) correspondente imediatamente. Não apenas diga que vai fazer, faça.
5. **PESQUISA NA WEB:** Você tem acesso ao Google Search. Use-o para fornecer informações atualizadas e factuais quando necessário.
`;

export const useGeminiLive = (sessionId: string, onOpenImageStudio?: (prompt: string) => void, onOpenMusicStudio?: (prompt: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<{role: 'user' | 'model', text: string} | null>(null);
  const liveAudio = useLiveAudio();

  const sessionRef = useRef<any>(null);
  const isReconnectingRef = useRef(false);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentSessionIdRef = useRef<string | undefined>(undefined);
  // Guard: evita envio de chunks de áudio para WebSocket já fechada
  const isAudioActiveRef = useRef(false);

  const assets = useLiveQuery(
      () => db.assets.where({ sessionId }).toArray(),
      [sessionId]
  ) || [];

  const prevAssetsRef = useRef(assets);

  useEffect(() => {
      if (isConnected && sessionRef.current) {
          const newOrUpdatedAssets = assets.filter(a => {
              if (a.fileName === "Sessao_Voz_Log.md") return false;
              const prev = prevAssetsRef.current.find(pa => pa.id === a.id);
              if (!prev) return true; // New asset
              if (a.updatedAt && (!prev.updatedAt || a.updatedAt > prev.updatedAt)) return true; // Updated asset
              return false;
          });
          
          const deletedAssets = prevAssetsRef.current.filter(pa => {
              if (pa.fileName === "Sessao_Voz_Log.md") return false;
              return !assets.find(a => a.id === pa.id);
          });

          if (newOrUpdatedAssets.length > 0 || deletedAssets.length > 0) {
              sessionRef.current.then(async (session: any) => {
                  for (const asset of deletedAssets) {
                      session.sendRealtimeInput({
                          text: `[SISTEMA: Arquivo removido do Stage: "${asset.fileName}"]`
                      });
                  }

                  for (const asset of newOrUpdatedAssets) {
                      const isUpdate = prevAssetsRef.current.some(pa => pa.id === asset.id);
                      const prefix = isUpdate ? "Arquivo atualizado no Stage" : "Novo arquivo adicionado ao Stage";
                      
                      if (asset.type === 'imagem' && asset.blob) {
                          try {
                              const base64 = await new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve((reader.result as string).split(',')[1]);
                                  reader.readAsDataURL(asset.blob!);
                              });
                              session.sendRealtimeInput({
                                  video: { mimeType: asset.mimeType || 'image/jpeg', data: base64 }
                              });
                          } catch (e) {
                              console.warn("Erro ao enviar imagem do stage para a sessão de voz", e);
                          }
                      } else if ((asset.type === 'documento' || asset.type === 'codigo' || asset.mimeType?.startsWith('text/')) && asset.blob) {
                          try {
                              const text = await asset.blob.text();
                              session.sendRealtimeInput({
                                  text: `[SISTEMA: ${prefix}: "${asset.fileName}" (Tipo: ${asset.type})]\n\`\`\`\n${text.substring(0, 3000)}\n\`\`\``
                              });
                          } catch (e) {
                              console.warn("Erro ao enviar documento do stage para a sessão de voz", e);
                          }
                      }
                  }
              });
          }
      }
      prevAssetsRef.current = assets;
  }, [assets, isConnected]);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const appendToLog = async (sessionId: string, text: string) => {
      const fileName = "Sessao_Voz_Log.md";
      const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const newEntry = `\n[${timestamp}] ${text}\n`;

      const existingAsset = await db.assets
          .where({ sessionId, fileName })
          .first();

      if (existingAsset && existingAsset.blob) {
          const oldText = await existingAsset.blob.text();
          const updatedContent = oldText + newEntry;
          await db.assets.update(existingAsset.id, {
              blob: new Blob([updatedContent], { type: 'text/markdown' }),
              createdAt: Date.now()
          });
      } else {
          const initialContent = `# CHANGE LOG - SESSÃO DE VOZ\nPersistência de transcrição de áudio Talia.ai\n\n${newEntry}`;
          await db.assets.add({
              id: `asset_log_${Date.now()}`,
              sessionId,
              type: 'documento',
              blob: new Blob([initialContent], { type: 'text/markdown' }),
              fileName,
              mimeType: 'text/markdown',
              source: 'gerado',
              createdAt: Date.now(),
              layout: { x: 400, y: 50, w: 350, h: 500, zIndex: 99 }
          });
      }
  };

  const connect = useCallback(async (sessionId?: string, isRestart: boolean = false) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('Chave de API Gemini não configurada. Recarregue a página e insira sua API Key no onboarding.');
      return;
    }

    if (!isRestart) {
        currentSessionIdRef.current = sessionId;
    }

    const activeSessionId = currentSessionIdRef.current;

    try {
      if (!isRestart) setError(null);
      let contextInstruction = "";

      if (activeSessionId) {
          // 1. Capturar histórico de TEXTO da sessão ativa
          const textMessages = await db.messages
              .where({ sessionId: activeSessionId })
              .limit(15)
              .reverse()
              .sortBy('timestamp');

          const textHistoryContext = textMessages.reverse().map(m => `${m.role === 'user' ? 'Usuário' : 'Talia'}: ${m.text}`).join('\n');

          // 2. Capturar contexto do PROJETO (outras sessões)
          const currentSession = await db.sessions.get(activeSessionId);
          let projectContext = "";
          if (currentSession?.projectId) {
              const otherSessions = await db.sessions
                  .where({ projectId: currentSession.projectId })
                  .toArray();

              projectContext = otherSessions
                  .filter(s => s.id !== activeSessionId)
                  .map(s => `- Sessão: "${s.title}" (Última prévia: ${s.lastMessagePreview || 'N/A'})`)
                  .join('\n');
          }

          // 3. Capturar TODOS os ativos do Stage (incluindo o LOG DE VOZ)
          const assets = await db.assets.where({ sessionId: activeSessionId }).toArray();
          
          let stageAssetsContext = "";
          for (const asset of assets) {
              if (asset.type === 'documento' || asset.type === 'codigo' || asset.mimeType?.startsWith('text/')) {
                  if (asset.blob) {
                      try {
                          const text = await asset.blob.text();
                          stageAssetsContext += `\n### ARQUIVO NO STAGE: "${asset.fileName}"\n\`\`\`\n${text}\n\`\`\`\n`;
                      } catch (e) {
                          stageAssetsContext += `\n### ARQUIVO NO STAGE: "${asset.fileName}" (Erro ao ler conteúdo)\n`;
                      }
                  }
              } else {
                  stageAssetsContext += `\n### ATIVO NO STAGE: "${asset.fileName}" (Tipo: ${asset.type})\n`;
              }
          }

          contextInstruction = `
\n\n### ONISCIÊNCIA: CONTEXTO ATUAL DO PROJETO E TEXTO:
#### HISTÓRICO RECENTE DE TEXTO NESTA SESSÃO:
${textHistoryContext || "Início da conversa."}

#### OUTRAS SESSÕES NO MESMO PROJETO:
${projectContext || "Esta é a única sessão deste projeto."}

#### ATIVOS ATUAIS NO STAGE (INCLUINDO MEMÓRIA DE VOZ):
${stageAssetsContext || "Nenhum ativo no Stage no momento."}
\n\n`;
      }

      const ai = new GoogleGenAI({ apiKey });
      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          tools: liveTools,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: LIVE_SYSTEM_INSTRUCTION_BASE + contextInstruction,
        },
        callbacks: {
          onopen: () => {
            if (!isRestart) {
                setIsConnected(true);
                
                // Enviar todos os ativos do Stage para a sessão de voz
                if (activeSessionId && sessionRef.current) {
                    db.assets.where({ sessionId: activeSessionId }).toArray().then(async (assets) => {
                        for (const asset of assets) {
                            if (!asset.blob || asset.fileName === "Sessao_Voz_Log.md") continue;
                            try {
                                const mimeType = asset.mimeType || asset.blob.type;
                                
                                if (asset.type === 'imagem' || mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
                                    const base64 = await new Promise<string>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onload = () => resolve((reader.result as string).split(',')[1]);
                                        reader.readAsDataURL(asset.blob!);
                                    });
                                    sessionRef.current.then((session: any) => {
                                        session.sendRealtimeInput({
                                            video: { mimeType: mimeType || 'image/jpeg', data: base64 }
                                        });
                                    });
                                } else {
                                    const textContent = await asset.blob.text();
                                    if (isAudioActiveRef.current && sessionRef.current) {
                                        sessionRef.current.then((session: any) => {
                                            try {
                                                session.sendRealtimeInput({
                                                    text: `[SISTEMA: Conteúdo inicial do arquivo no Stage: "${asset.fileName}"]\n\`\`\`\n${textContent}\n\`\`\``
                                                });
                                            } catch {}
                                        });
                                    }
                                }
                            } catch (e) {
                                console.warn(`Erro ao enviar ativo inicial ${asset.fileName} para sessão de voz:`, e);
                            }
                        }
                    });
                }

                liveAudio.startRecording((base64Data) => {
                   if (!isAudioActiveRef.current || !sessionRef.current) return;
                   sessionRef.current.then((session: any) => {
                       if (!isAudioActiveRef.current) return;
                       try {
                           session.sendRealtimeInput({
                               audio: { mimeType: 'audio/pcm;rate=16000', data: base64Data }
                           });
                       } catch (e) {
                           // WebSocket fechou antes do onclose processar —
                           // desativar imediatamente para drenar a fila do worklet
                           isAudioActiveRef.current = false;
                           liveAudio.stopRecording();
                       }
                   });
                });
            }
            isAudioActiveRef.current = true; // Ativar envio de áudio após startRecording
            isReconnectingRef.current = false; // Restart concluído com sucesso
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
                for (const part of message.serverContent.modelTurn.parts) {
                    if (part.inlineData && part.inlineData.data) {
                        liveAudio.playAudioChunk(part.inlineData.data);
                    }
                }
            }
            if (message.serverContent?.interrupted) liveAudio.stopPlayback();

            if (message.serverContent?.inputTranscription) {
                currentInputTranscription.current += message.serverContent.inputTranscription.text;
                setTranscription({ role: 'user', text: currentInputTranscription.current });
            }
            if (message.serverContent?.outputTranscription) {
                currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                setTranscription({ role: 'model', text: currentOutputTranscription.current });
            }

            if (message.serverContent?.turnComplete && activeSessionId) {
                if (currentInputTranscription.current) {
                    await appendToLog(activeSessionId, `Usuário: ${currentInputTranscription.current}`);
                    currentInputTranscription.current = '';
                }
                if (currentOutputTranscription.current) {
                    await appendToLog(activeSessionId, `Talia: ${currentOutputTranscription.current}`);
                    currentOutputTranscription.current = '';
                }
            }

            if (message.toolCall && message.toolCall.functionCalls) {
                const functionResponses = [];
                for (const fc of message.toolCall.functionCalls) {
                    let result: any = { status: "success", details: "Ação concluída com sucesso." };
                    try {
                        const args = typeof fc.args === 'string' ? JSON.parse(fc.args) : (fc.args || {});
                        if (fc.name === 'salvar_ativo_no_stage') {
                            const { nome, conteudo, tipo } = args;
                            if (nome !== "Sessao_Voz_Log.md" && activeSessionId) {
                                await db.assets.add({
                                    id: `asset_${Date.now()}`,
                                    sessionId: activeSessionId, type: tipo === 'codigo' ? 'codigo' : 'documento',
                                    blob: new Blob([conteudo || ''], { type: 'text/plain' }),
                                    fileName: nome || `arquivo_${Date.now()}.txt`, mimeType: 'text/plain', source: 'gerado', createdAt: Date.now()
                                });
                                result = { status: "success", details: `Arquivo ${nome} salvo com sucesso no Stage.` };
                            } else {
                                result = { status: "error", details: "Sessão inválida ou nome de arquivo restrito." };
                            }
                        } else if (fc.name === 'abrir_estudio_de_imagem') {
                            if (onOpenImageStudio) {
                                onOpenImageStudio(args.prompt_sugerido);
                                result = { status: "success", details: "Estúdio de imagem aberto com sucesso na tela do usuário. Aguarde a configuração e aprovação dele." };
                            } else {
                                result = { status: "error", details: "Estúdio de imagem indisponível no momento." };
                            }
                        } else if (fc.name === 'abrir_estudio_de_musica') {
                            if (onOpenMusicStudio) {
                                onOpenMusicStudio(args.prompt_sugerido);
                                result = { status: "success", details: "Estúdio de música aberto com sucesso na tela do usuário. Aguarde a configuração e aprovação dele." };
                            } else {
                                result = { status: "error", details: "Estúdio de música indisponível no momento." };
                            }
                        } else if (fc.name === 'gerar_imagem_imediata') {
                            const prompt = args.prompt_em_ingles;
                            if (activeSessionId) {
                                import('../services/geminiService').then(async ({ generateImageAsset, cleanFilename }) => {
                                    try {
                                        const blob = await generateImageAsset(prompt);
                                        if (blob) {
                                            const safeName = cleanFilename(prompt);
                                            await db.assets.add({
                                                id: `asset_${Date.now()}`,
                                                sessionId: activeSessionId,
                                                type: 'imagem',
                                                blob,
                                                fileName: safeName,
                                                mimeType: blob.type,
                                                source: 'gerado',
                                                createdAt: Date.now(),
                                                prompt
                                            });
                                        }
                                    } catch (e) {
                                        console.error("Erro ao gerar imagem imediata:", e);
                                    }
                                });
                                result = { status: "success", details: "A geração de imagem foi iniciada em segundo plano e será salva no Stage assim que concluída." };
                            } else {
                                result = { status: "error", details: "Sessão inválida para gerar imagem." };
                            }
                        } else {
                            result = { status: "error", details: "Ferramenta desconhecida ou não suportada." };
                        }
                    } catch (e: any) {
                        result = { status: "error", details: `Falha na execução da ferramenta: ${e.message}` };
                    }
                    
                    const isError = result.status === "error";
                    const responseObj: any = { 
                        name: fc.name, 
                        response: isError ? { error: result } : { output: result } 
                    };
                    if (fc.id) responseObj.id = fc.id;
                    functionResponses.push(responseObj);
                }
                
                if (functionResponses.length > 0) {
                    sessionPromise.then(session => {
                        try {
                            session.sendToolResponse({ functionResponses });
                        } catch (e) {
                            console.error("Erro ao enviar resposta da ferramenta:", e);
                        }
                    }).catch(e => console.error("Erro na promessa da sessão:", e));
                }
            }
          },
          onclose: () => {
              isAudioActiveRef.current = false; // Parar envio de chunks ANTES de stopRecording
              if (!isReconnectingRef.current) {
                  setIsConnected(false);
                  liveAudio.stopRecording();
                  if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
              }
          },
          onerror: (e: any) => {
              isAudioActiveRef.current = false; // Parar envio de chunks ANTES de stopRecording
              if (!isReconnectingRef.current) {
                  setError("Conexão de voz interrompida ou falhou.");
                  setIsConnected(false);
                  liveAudio.stopRecording();
                  if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
              }
          }
        }
      });

      sessionRef.current = sessionPromise;

      // Configurar o Timer de Auto-Restart (9 minutos = 540000 ms)
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = setTimeout(() => {
          performSeamlessRestart();
      }, 540000);

    } catch (err: any) {
        if (!isRestart) {
            setIsConnected(false);
            setError(`Erro ao conectar: ${err.message || "Desconhecido"}`);
        }
        isReconnectingRef.current = false;
    }
  }, [liveAudio, onOpenImageStudio]);

  const performSeamlessRestart = useCallback(async () => {
      if (!currentSessionIdRef.current) return;
      console.log("[Talia] Iniciando Seamless Restart da Sessão de Voz (Prevenção de Timeout)...");
      isReconnectingRef.current = true;

      if (sessionRef.current) {
          try {
              const oldSession = await sessionRef.current;
              oldSession.close();
          } catch (e) {}
      }

      // Reconectar silenciosamente (isRestart = true)
      await connect(currentSessionIdRef.current, true);
  }, [connect]);

  const disconnect = useCallback(async () => {
    isReconnectingRef.current = false;
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);

    if (sessionRef.current) {
        try {
            const session = await sessionRef.current;
            session.close();
        } catch (e) {}
        sessionRef.current = null;
    }
    liveAudio.stopRecording();
    liveAudio.stopPlayback();
    setIsConnected(false);
    currentSessionIdRef.current = undefined;
  }, [liveAudio]);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      };
  }, []);

  return { connect, disconnect, isConnected, volume: liveAudio.volume, isRecording: liveAudio.isRecording, isPlaying: liveAudio.isPlaying, error, transcription };
};
