import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Shield, 
  Code, 
  Terminal, 
  Cpu, 
  Zap, 
  ArrowLeft,
  Search,
  Settings,
  Activity,
  Lock,
  Database
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { generateSLMResponse, auditCode } from '@/src/services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code' | 'audit';
}

interface CloudModeProps {
  onBack: () => void;
}

export default function CloudMode({ onBack }: CloudModeProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Aegis Cloud Core online. I am ready to assist with coding, bot development, and security auditing. What is our objective today?',
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'chat' | 'audit' | 'monitor'>('chat');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      if (activeTab === 'audit') {
        responseText = await auditCode(input);
      } else {
        responseText = await generateSLMResponse(input);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        type: activeTab === 'audit' ? 'audit' : 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/30 backdrop-blur-md flex flex-col">
        <div className="p-6 border-bottom border-border">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-accent-purple" />
            <span className="font-bold tracking-tighter text-lg">AEGIS CORE</span>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('chat')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                activeTab === 'chat' ? "bg-accent-purple/10 text-accent-purple border border-accent-purple/20" : "text-foreground/50 hover:bg-white/5"
              )}
            >
              <Bot className="w-4 h-4" />
              <span>Neural Chat</span>
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                activeTab === 'audit' ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20" : "text-foreground/50 hover:bg-white/5"
              )}
            >
              <Shield className="w-4 h-4" />
              <span>Security Audit</span>
            </button>
            <button 
              onClick={() => setActiveTab('monitor')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                activeTab === 'monitor' ? "bg-white/10 text-white border border-white/20" : "text-foreground/50 hover:bg-white/5"
              )}
            >
              <Activity className="w-4 h-4" />
              <span>System Monitor</span>
            </button>
            <button 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: 'Neural weights updated. Aegis has successfully integrated the latest coding and security datasets. Performance increased by 14.2%.',
                  }]);
                }, 3000);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-accent-cyan/70 hover:bg-accent-cyan/5 transition-all border border-dashed border-accent-cyan/20 mt-4"
            >
              <Zap className="w-4 h-4" />
              <span>Train Neural Core</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-foreground/40 font-mono uppercase">Cloud Load</span>
              <span className="text-[10px] text-accent-purple font-mono">24%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="w-[24%] h-full bg-accent-purple" />
            </div>
          </div>
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground/50 hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/20 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-foreground/60 uppercase tracking-widest">
              {activeTab === 'chat' ? 'Neural Link Active' : activeTab === 'audit' ? 'Security Protocol Engaged' : 'System Telemetry'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-foreground/40 hover:text-foreground transition-colors"><Search className="w-4 h-4" /></button>
            <button className="p-2 text-foreground/40 hover:text-foreground transition-colors"><Settings className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'monitor' ? (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MonitorCard title="CPU Utilization" value="12.4%" icon={<Cpu className="w-5 h-5" />} color="cyan" />
              <MonitorCard title="Memory Usage" value="4.2 GB" icon={<Database className="w-5 h-5" />} color="purple" />
              <MonitorCard title="Network Latency" value="14ms" icon={<Activity className="w-5 h-5" />} color="green" />
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-4 max-w-3xl",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        msg.role === 'assistant' ? "bg-accent-purple/10 border border-accent-purple/20 text-accent-purple" : "bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan"
                      )}>
                        {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div className={cn(
                        "glass-card p-4 text-sm leading-relaxed",
                        msg.role === 'user' ? "bg-accent-cyan/5 border-accent-cyan/20" : "bg-accent-purple/5 border-accent-purple/20",
                        msg.type === 'audit' ? "border-red-500/30 bg-red-500/5" : ""
                      )}>
                        {msg.type === 'audit' && (
                          <div className="flex items-center gap-2 mb-3 text-red-400 font-bold uppercase text-[10px] tracking-widest">
                            <Lock className="w-3 h-3" />
                            Security Audit Report
                          </div>
                        )}
                        <div className="whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center animate-pulse">
                      <Bot className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div className="glass-card p-4 flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-8 pt-0">
                <div className="relative max-w-4xl mx-auto">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={activeTab === 'audit' ? "Paste code to audit..." : "Ask Aegis anything..."}
                    className="w-full bg-card/50 backdrop-blur-md border border-border rounded-2xl p-4 pr-16 focus:outline-none focus:border-accent-purple/50 transition-all resize-none min-h-[60px] max-h-[200px]"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-3 bottom-3 p-3 rounded-xl bg-accent-purple text-white shadow-[0_0_15px_rgba(188,0,255,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center mt-4 text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-mono">
                  Aegis Cloud Core v4.2.0 • Neural Link Encrypted
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MonitorCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: 'cyan' | 'purple' | 'green' }) {
  const colorClass = color === 'cyan' ? 'text-accent-cyan' : color === 'purple' ? 'text-accent-purple' : 'text-green-400';
  const borderClass = color === 'cyan' ? 'border-accent-cyan/20' : color === 'purple' ? 'border-accent-purple/20' : 'border-green-400/20';
  const bgClass = color === 'cyan' ? 'bg-accent-cyan/5' : color === 'purple' ? 'bg-accent-purple/5' : 'bg-green-400/5';

  return (
    <div className={cn("glass-card p-6", borderClass)}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", bgClass, colorClass)}>
          {icon}
        </div>
        <span className="text-xs font-mono text-foreground/40">{title}</span>
      </div>
      <div className={cn("text-3xl font-bold font-mono", colorClass)}>
        {value}
      </div>
      <div className="mt-4 w-full bg-white/5 h-1 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "45%" }}
          className={cn("h-full", color === 'cyan' ? 'bg-accent-cyan' : color === 'purple' ? 'bg-accent-purple' : 'bg-green-400')}
        />
      </div>
    </div>
  );
}
