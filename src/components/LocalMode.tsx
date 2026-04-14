import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Copy, Check, ArrowLeft, Cpu, Database, Network, Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LocalModeProps {
  onBack: () => void;
}

export default function LocalMode({ onBack }: LocalModeProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    {
      title: "Environment Setup",
      icon: <Terminal className="w-5 h-5" />,
      description: "Initialize Termux with the necessary packages for neural computation.",
      command: "pkg update && pkg upgrade\npkg install python nodejs git clang make binutils -y"
    },
    {
      title: "Distributed RAM Protocol",
      icon: <Database className="w-5 h-5" />,
      description: "Configure swap space and distributed memory mapping to handle large model weights.",
      command: "dd if=/dev/zero of=/sdcard/swapfile bs=1M count=4096\nmkswap /sdcard/swapfile\nswapon /sdcard/swapfile"
    },
    {
      title: "Aegis Core Installation",
      icon: <Cpu className="w-5 h-5" />,
      description: "Clone the Aegis SLM repository and install the local inference engine.",
      command: "git clone https://github.com/aegis-slm/core-local.git\ncd core-local\nnpm install && npm run build-local"
    },
    {
      title: "Network Link (Optional)",
      icon: <Network className="w-5 h-5" />,
      description: "Connect multiple devices to create a distributed RAM cluster for larger models.",
      command: "./aegis-link --join-cluster --secret-key=AEGIS_NODE_01"
    }
  ];

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-foreground/50 hover:text-accent-cyan transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-mono uppercase tracking-widest">Return to Selection</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <h1 className="text-3xl font-bold mb-2 neon-text-cyan">Local Deployment Guide</h1>
            <p className="text-foreground/60 mb-8">Follow these steps to deploy Aegis SLM on your local hardware via Termux.</p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                    {step.icon}
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-2rem] w-px bg-accent-cyan/20" />
                  )}
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-foreground/50 mb-4">{step.description}</p>
                  <div className="relative group">
                    <pre className="bg-black/50 p-4 rounded-lg border border-white/5 font-mono text-xs text-accent-cyan/80 overflow-x-auto">
                      {step.command}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(step.command, `step-${index}`)}
                      className="absolute top-2 right-2 p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                      {copied === `step-${index}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 border-accent-cyan/20"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent-cyan" />
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-foreground/40">NODE_ID</span>
                <span className="text-accent-cyan">AEGIS_TERMUX_X1</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-foreground/40">RAM_STATUS</span>
                <span className="text-accent-cyan">DISTRIBUTED_MAPPING</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-foreground/40">SWAP_SIZE</span>
                <span className="text-accent-cyan">4.0 GB</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  className="h-full bg-accent-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-purple" />
              Security Protocol
            </h2>
            <p className="text-xs text-foreground/50 leading-relaxed">
              Local mode operates in an air-gapped environment. No data leaves the device. White-hat modules are restricted to the local network interface.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
