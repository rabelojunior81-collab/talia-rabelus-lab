
import React, { useState } from 'react';
import { Send, Link as LinkIcon, Database, Sparkles, ChevronRight } from './icons/Icons';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
  onKeySelected: () => void;
  hasKeyInitial: boolean;
  currentName: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onKeySelected, hasKeyInitial, currentName }) => {
  const [name, setName] = useState(currentName);
  const [step, setStep] = useState(currentName ? 1 : 0);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(1);
    }
  };

  const handleNativeAccess = () => {
    onComplete(name);
  };

  const handleOpenKeyDialog = async () => {
      await window.aistudio.openSelectKey();
      onKeySelected();
      onComplete(name);
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
                    Você pode utilizar o núcleo nativo da Talia ou sincronizar uma chave de projeto pago para recursos de alta fidelidade e limites estendidos.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[9px] text-gray-600 font-bold uppercase tracking-widest hover:text-talia-red flex items-center gap-1.5 transition-colors">
                        <LinkIcon className="w-3 h-3" /> SOBRE CHAVES DE PROJETOS PAGOS
                    </a>
                </div>
            </div>
            
            <div className="flex flex-col gap-3">
                <button
                    onClick={handleNativeAccess}
                    className="w-full bg-white/5 border border-white/10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                >
                    <Sparkles className="w-3.5 h-3.5 text-talia-red" />
                    ACESSAR COM NÚCLEO NATIVO
                </button>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-grow bg-white/5"></div>
                    <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">OU</span>
                    <div className="h-[1px] flex-grow bg-white/5"></div>
                </div>

                <button
                    onClick={handleOpenKeyDialog}
                    className="w-full bg-talia-red py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-[0_10px_30px_rgba(255,59,59,0.15)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                    <Database className="w-3.5 h-3.5" />
                    SINCRONIZAR CHAVE EXTERNA
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
