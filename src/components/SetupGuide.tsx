import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Copy, Check, ArrowLeft, Code2, Laptop, Globe, ShieldAlert } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SetupGuideProps {
  onBack: () => void;
}

export default function SetupGuide({ onBack }: SetupGuideProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    {
      title: "Prerequisites",
      icon: <Laptop className="w-5 h-5" />,
      description: "Ensure you have Node.js (v18+) and npm installed on your machine.",
      command: "node --version\nnpm --version"
    },
    {
      title: "Project Initialization",
      icon: <Code2 className="w-5 h-5" />,
      description: "Extract the project files and navigate to the root directory in your terminal.",
      command: "cd aegis-slm-forge"
    },
    {
      title: "Install Dependencies",
      icon: <Terminal className="w-5 h-5" />,
      description: "Install all required packages and engines.",
      command: "npm install"
    },
    {
      title: "Configure Environment",
      icon: <ShieldAlert className="w-5 h-5" />,
      description: "Create a .env file and add your private access keys.",
      command: "cp .env.example .env\n# Edit .env and add your GEMINI_API_KEY"
    },
    {
      title: "Launch Development Server",
      icon: <Globe className="w-5 h-5" />,
      description: "Start the local server and open the dashboard in your browser.",
      command: "npm run dev"
    }
  ];

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-foreground/50 hover:text-accent-purple transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-mono uppercase tracking-widest">Back to Forge</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 tracking-tighter neon-text-purple">VS Code Setup Guide</h1>
        <p className="text-foreground/60 mb-10 text-lg">
          Follow these instructions to run the Aegis SLM Forge environment locally on your workstation.
        </p>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative pl-16">
              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shadow-[0_0_15px_rgba(188,0,255,0.1)]">
                {step.icon}
              </div>
              {index !== steps.length - 1 && (
                <div className="absolute left-6 top-14 bottom-[-3rem] w-px bg-gradient-to-b from-accent-purple/30 to-transparent" />
              )}
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-foreground/50 mb-4">{step.description}</p>
              <div className="relative group">
                <pre className="bg-black/60 p-5 rounded-xl border border-white/5 font-mono text-sm text-accent-purple/90 overflow-x-auto">
                  {step.command}
                </pre>
                <button
                  onClick={() => copyToClipboard(step.command, `setup-${index}`)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  {copied === `setup-${index}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="glass-card p-8 border-red-500/20 bg-red-500/5">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-5 h-5" />
          Privacy Notice
        </h2>
        <p className="text-sm text-foreground/60 leading-relaxed">
          Once deployed locally, Aegis operates within your private network. All interactions are encrypted and no telemetry is shared with external third parties beyond the core neural API calls.
        </p>
      </div>
    </div>
  );
}
