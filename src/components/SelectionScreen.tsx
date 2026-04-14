import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Cloud, Shield, Zap, Terminal } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SelectionScreenProps {
  onSelect: (mode: 'local' | 'cloud') => void;
}

export default function SelectionScreen({ onSelect }: SelectionScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/20 blur-[120px] rounded-full animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 mr-4">
            <Shield className="w-10 h-10 text-accent-purple" />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter neon-text-purple">AEGIS SLM FORGE</h1>
        </div>
        <p className="text-foreground/60 text-lg max-w-md mx-auto">
          Advanced Neural Engine for Coding, Bot Synthesis, and Security Auditing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
        {/* Local Mode */}
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('local')}
          className="glass-card p-8 text-left group hover:border-accent-cyan/50 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="p-4 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 group-hover:bg-accent-cyan/20 transition-colors">
              <Terminal className="w-8 h-8 text-accent-cyan" />
            </div>
            <div className="text-xs font-mono text-accent-cyan/60 bg-accent-cyan/5 px-2 py-1 rounded border border-accent-cyan/10">
              OFFLINE CORE
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">Local Deployment</h2>
          <p className="text-foreground/50 text-sm mb-6">
            Run Aegis on your local hardware using Termux and Distributed RAM protocols. Maximum privacy, zero latency.
          </p>
          <div className="flex gap-2">
            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10">Termux</span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10">Dist-RAM</span>
          </div>
        </motion.button>

        {/* Cloud Mode */}
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('cloud')}
          className="glass-card p-8 text-left group hover:border-accent-purple/50 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20 group-hover:bg-accent-purple/20 transition-colors">
              <Cloud className="w-8 h-8 text-accent-purple" />
            </div>
            <div className="text-xs font-mono text-accent-purple/60 bg-accent-purple/5 px-2 py-1 rounded border border-accent-purple/10">
              GPU ENABLED
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 group-hover:text-accent-purple transition-colors">Cloud Core</h2>
          <p className="text-foreground/50 text-sm mb-6">
            Access the full power of Aegis via high-performance GPU clusters. Unlimited context and real-time training data.
          </p>
          <div className="flex gap-2">
            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10">H100 Cluster</span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10">Real-time</span>
          </div>
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 flex items-center gap-8 text-foreground/30 text-xs font-mono uppercase tracking-[0.2em]"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3" />
          <span>Transformer v4.2</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3" />
          <span>White-Hat Protocol</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          <span>Neural Link Active</span>
        </div>
      </motion.div>
    </div>
  );
}
