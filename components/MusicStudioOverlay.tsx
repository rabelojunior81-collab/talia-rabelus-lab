import React, { useState, useRef } from 'react';
import { X, Sparkles, Loader, Music, Paperclip } from './icons/Icons';
import { MusicGenerationConfig } from '../types';

interface MusicStudioOverlayProps {
  initialPrompt: string;
  onClose: () => void;
  onGenerate: (config: MusicGenerationConfig) => Promise<void>;
}

const MusicStudioOverlay: React.FC<MusicStudioOverlayProps> = ({ initialPrompt, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [duration, setDuration] = useState<MusicGenerationConfig['duration']>('clip');
  const [lyrics, setLyrics] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // @ts-ignore
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      await onGenerate({ prompt, duration, lyrics: lyrics.trim() ? lyrics : undefined, image: image || undefined });
      onClose();
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes("Requested entity was not found")) {
        // @ts-ignore
        if (window.aistudio) await window.aistudio.openSelectKey();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in bg-black/50 backdrop-blur-[60px] overflow-hidden">
      <div className="absolute inset-0 bg-white/[0.01]" onClick={onClose}></div>
      
      <div className="w-full max-w-lg bg-[#0a0a0b] border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col overflow-hidden rounded-none relative z-10 scale-100">
        
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/5">
            <div className="flex items-center gap-2">
                <div className="p-1 bg-talia-red/20 rounded-none border border-talia-red/30">
                    <Music className="w-3.5 h-3.5 text-talia-red" />
                </div>
                <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.25em] font-mono">MUSIC_STUDIO_LYRIA</h2>
            </div>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4"/></button>
        </div>

        <div className="p-5 space-y-5">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[8px] font-bold text-gray-600 uppercase tracking-widest font-mono">Audio Command</label>
                    <span className="text-[8px] text-talia-red font-mono font-bold opacity-60">SONIC_SYMBOLS</span>
                </div>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-24 bg-black border border-white/5 p-4 text-[13px] text-gray-300 font-mono leading-relaxed focus:outline-none focus:border-talia-red/30 transition-all resize-none shadow-inner"
                    placeholder="Descreva a composição musical (ex: A 30-second lofi hip hop beat...)"
                    autoFocus
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[8px] font-bold text-gray-600 uppercase tracking-widest font-mono">Lyrics (Optional)</label>
                </div>
                <textarea 
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    className="w-full h-24 bg-black border border-white/5 p-4 text-[13px] text-gray-300 font-mono leading-relaxed focus:outline-none focus:border-talia-red/30 transition-all resize-none shadow-inner"
                    placeholder="[Verse 1]\nWalking through the neon glow...\n\n[Chorus]\nWe are the echoes..."
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[8px] font-bold text-gray-600 uppercase tracking-widest font-mono">Reference Image (Optional)</label>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-black border border-white/5 hover:border-white/20 transition-colors text-gray-400 hover:text-white"
                        title="Anexar imagem de referência"
                    >
                        <Paperclip className="w-4 h-4" />
                    </button>
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImage(e.target.files[0]);
                            }
                        }} 
                        className="hidden" 
                    />
                    {image && (
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 border border-white/10 text-xs text-gray-300">
                            <span className="truncate max-w-[200px]">{image.name}</span>
                            <button onClick={() => setImage(null)} className="text-gray-500 hover:text-white"><X className="w-3 h-3" /></button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2.5">
                <label className="text-[8px] font-bold text-gray-600 uppercase tracking-widest font-mono px-1">Duration Protocol</label>
                <div className="flex gap-1">
                    <button 
                        onClick={() => setDuration('clip')}
                        className={`flex-1 py-1.5 border text-[9px] font-bold transition-all font-mono ${duration === 'clip' ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-white/[0.02] border-white/5 text-gray-600 hover:bg-white/[0.05]'}`}
                    >
                        CLIP (30s)
                    </button>
                    <button 
                        onClick={() => setDuration('pro')}
                        className={`flex-1 py-1.5 border text-[9px] font-bold transition-all font-mono ${duration === 'pro' ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-white/[0.02] border-white/5 text-gray-600 hover:bg-white/[0.05]'}`}
                    >
                        PRO (Full)
                    </button>
                </div>
            </div>
        </div>

        <div className="p-4 bg-black/60 border-t border-white/5 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-5 py-2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest font-mono transition-colors"
                disabled={isGenerating}
            >
                Abort
            </button>
            <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="relative overflow-hidden group px-6 py-2 bg-talia-red hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10 flex items-center gap-2">
                    {isGenerating ? (
                        <><Loader className="w-3.5 h-3.5 animate-spin" /> SYNTHESIZING...</>
                    ) : (
                        <><Sparkles className="w-3.5 h-3.5" /> GENERATE_AUDIO</>
                    )}
                </span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default MusicStudioOverlay;
