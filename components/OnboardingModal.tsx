
import React, { useState } from 'react';
import { Send, Link as LinkIcon, Database, Sparkles, ChevronRight, Eye, EyeOff, Check } from './icons/Icons';
import { setApiKey, hasApiKey } from '../services/apiKeyManager';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
  onKeySelected: () => void;
  hasKeyInitial: boolean;
  currentName: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onKeySelected, hasKeyInitial, currentName }) => {
  const [name, setName] = useState(currentName);
  const [step, setStep] = useState(currentName ? 1 : 0);
  const [apiKey, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(hasKeyInitial);
  const [keyError, setKeyError] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(1);
    }
  };

  const handleNativeAccess = () => {
    onComplete(name);
  };

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed.startsWith('AIza') || trimmed.length < 30) {
      setKeyError('Chave inválida. Deve começar com "AIza" e ter pelo menos 30 caracteres.');
      return;
    }
    setKeyError('');
    setApiKey(trimmed);
    setKeySaved(true);
    onKeySelected();
    // Avança automaticamente após salvar
    setTimeout(() => onComplete(name), 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveKey();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fade-in">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,59,0.03),transparent_70%)]"></div>
      
      <div className="w-full max-w-lg p-12 text-center bg-[#050507] border border-white/5 shadow-2xl relative z-10">
        <div className="mb-12">
           <h1 className="text-6xl font-serif font-bold tracking-tight text-white mb-1">
            talia<span className="text-talia-red">.</span>ai
          </h1>
          <p className="text-[9px] font-bold tracking-[0.4em] text-gray-600 uppercase">
            PROTOCOLO DE ATIVAÇÃO
          </p>
        </div>

        {step === 0 ? (
          <form onSubmit={handleNameSubmit} className="animate-fade-in space-y-12">
            <div className="relative group">
               <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome, Architect?"
                  className="w-full bg-transparent border-b border-white/5 text-center text-3xl font-serif text-white placeholder-gray-900 focus:border-talia-red/50 focus:outline-none py-6 transition-all"
                  autoFocus
              />
            </div>
            <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-white/[0.02] border border-white/5 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-white hover:bg-talia-red hover:border-talia-red transition-all disabled:opacity-20"
            >
                DEFINIR IDENTIDADE
            </button>
          </form>
        ) : (
          <div className="animate-fade-in space-y-6">
            <div className="p-8 bg-black border border-white/5 text-left space-y-6">
                <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-talia-red" /> 
                    <h3 className="text-white font-bold text-[10px] uppercase tracking-widest">NÚCLEO DE PROCESSAMENTO</h3>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                    Insira sua chave de API do Google Gemini para ativar o núcleo de Talia. Sua chave é armazenada apenas localmente no seu navegador.
                </p>

                {/* API Key Input */}
                <div className="space-y-2">
                    <div className="relative flex items-center">
                        <input
                            type={showKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => { setApiKeyInput(e.target.value); setKeyError(''); setKeySaved(false); }}
                            onKeyDown={handleKeyPress}
                            placeholder="AIza..."
                            className="w-full bg-white/[0.03] border border-white/10 text-white text-xs font-mono px-4 py-3 pr-20 focus:outline-none focus:border-talia-red/50 placeholder-gray-700 transition-all"
                        />
                        <div className="absolute right-2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="p-1.5 text-gray-600 hover:text-gray-300 transition-colors"
                            >
                                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            {keySaved && (
                                <div className="p-1.5 text-green-400">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                            )}
                        </div>
                    </div>
                    {keyError && (
                        <p className="text-[10px] text-red-400 font-sans">{keyError}</p>
                    )}
                    {keySaved && (
                        <p className="text-[10px] text-green-400 font-sans">✓ Chave salva com sucesso</p>
                    )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-[9px] text-gray-600 font-bold uppercase tracking-widest hover:text-talia-red flex items-center gap-1.5 transition-colors">
                        <LinkIcon className="w-3 h-3" /> OBTER CHAVE NO GOOGLE AI STUDIO
                    </a>
                </div>
            </div>
            
            <div className="flex flex-col gap-3">
                <button
                    onClick={handleSaveKey}
                    disabled={!apiKey.trim() || keySaved}
                    className="w-full bg-talia-red py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-[0_10px_30px_rgba(255,59,59,0.15)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Database className="w-3.5 h-3.5" />
                    {keySaved ? 'CHAVE ATIVA — ENTRANDO...' : 'SINCRONIZAR CHAVE'}
                </button>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-grow bg-white/5"></div>
                    <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">OU</span>
                    <div className="h-[1px] flex-grow bg-white/5"></div>
                </div>

                <button
                    onClick={handleNativeAccess}
                    className="w-full bg-white/5 border border-white/10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                >
                    <Sparkles className="w-3.5 h-3.5 text-talia-red" />
                    ENTRAR SEM CHAVE (LIMITADO)
                </button>
            </div>
            
            <button 
                onClick={() => setStep(0)}
                className="text-[9px] text-gray-700 uppercase tracking-widest font-bold hover:text-gray-400 transition-colors pt-4"
            >
                VOLTAR PARA IDENTIDADE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
