import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Cloud, Shield, Zap, Terminal, BookOpen, Lock, Code } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SelectionScreenProps {
  onSelect: (mode: 'local' | 'cloud' | 'setup') => void;
}

export default function SelectionScreen({ onSelect }: SelectionScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-cyan/10 blur-[150px] rounded-full" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-16 z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/40 mb-6">
          <Lock className="w-3 h-3" />
          <span>Private Neural Environment</span>
        </div>
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-7xl font-black tracking-tighter neon-text-purple mb-2">AEGIS</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent-purple to-transparent" />
          <span className="text-xs font-mono tracking-[0.5em] text-accent-purple mt-2 uppercase">SLM Forge</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10">
        {/* Local Mode */}
        <SelectionCard
          title="Local Core"
          description="Deploy Aegis on your local hardware. Air-gapped security for sensitive operations."
          icon={<Terminal className="w-6 h-6" />}
          tag="Offline"
          color="cyan"
          onClick={() => onSelect('local')}
        />

        {/* Cloud Mode */}
        <SelectionCard
          title="Cloud Forge"
          description="Autonomous agent swarm with 250+ tool integrations, studio media synthesis, and MCP support."
          icon={<Zap className="w-6 h-6" />}
          tag="AGENTIC"
          color="purple"
          onClick={() => onSelect('cloud')}
        />

        {/* Setup Guide */}
        <SelectionCard
          title="VS Code Setup"
          description="Complete guide to deploy Aegis Forge on your local workstation with full system access."
          icon={<Code className="w-6 h-6" />}
          tag="GUIDE"
          color="white"
          onClick={() => onSelect('setup')}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20 flex items-center gap-12 text-foreground/20 text-[10px] font-mono uppercase tracking-[0.4em]"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3" />
          <span>v4.2.0-STABLE</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3" />
          <span>Zero-Knowledge</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          <span>Neural Link 1.0</span>
        </div>
      </motion.div>
    </div>
  );
}

function SelectionCard({ title, description, icon, tag, color, onClick }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  tag: string; 
  color: 'cyan' | 'purple' | 'white';
  onClick: () => void;
}) {
  const accentColor = color === 'cyan' ? 'text-accent-cyan' : color === 'purple' ? 'text-accent-purple' : 'text-white';
  const borderColor = color === 'cyan' ? 'hover:border-accent-cyan/40' : color === 'purple' ? 'hover:border-accent-purple/40' : 'hover:border-white/40';
  const bgGlow = color === 'cyan' ? 'group-hover:bg-accent-cyan/10' : color === 'purple' ? 'group-hover:bg-accent-purple/10' : 'group-hover:bg-white/10';

  return (
    <motion.button
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass-card p-8 text-left group transition-all duration-500 border-white/5",
        borderColor
      )}
    >
      <div className="flex items-start justify-between mb-8">
        <div className={cn(
          "p-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500",
          bgGlow,
          accentColor
        )}>
          {icon}
        </div>
        <div className={cn(
          "text-[8px] font-mono px-2 py-1 rounded border border-white/10 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity",
          accentColor
        )}>
          {tag}
        </div>
      </div>
      <h2 className="text-xl font-bold mb-3 group-hover:translate-x-1 transition-transform">{title}</h2>
      <p className="text-foreground/40 text-xs leading-relaxed group-hover:text-foreground/60 transition-colors">
        {description}
      </p>
      <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={cn("w-1 h-1 rounded-full", color === 'cyan' ? 'bg-accent-cyan' : color === 'purple' ? 'bg-accent-purple' : 'bg-white')} />
        <span className="text-[10px] font-mono uppercase tracking-widest">Initialize Core</span>
      </div>
    </motion.button>
  );
}
