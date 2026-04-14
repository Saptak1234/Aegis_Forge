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
  Database,
  Music,
  Video,
  Layers,
  Wrench,
  Eye,
  Globe,
  FileCode,
  Box,
  Monitor
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { generateSLMResponse, auditCode, generateStudioVideo, generateStudioMusic } from '@/src/services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code' | 'audit' | 'action' | 'media';
  status?: 'pending' | 'executing' | 'completed';
}

interface CloudModeProps {
  onBack: () => void;
}

export default function CloudMode({ onBack }: CloudModeProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Aegis Sovereign Core online. Multi-agent swarm initialized. Tool integrations (Composio, StackOne, Browser Use) active. Observability (LangSmith) engaged. What is our objective?',
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'chat' | 'media' | 'tools' | 'agents' | 'monitor'>('chat');
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
      let type: Message['type'] = 'text';

      if (activeTab === 'media') {
        if (input.toLowerCase().includes('video')) {
          responseText = await generateStudioVideo(input);
        } else {
          responseText = await generateStudioMusic(input);
        }
        type = 'media';
      } else if (activeTab === 'chat' && (input.toLowerCase().includes('run') || input.toLowerCase().includes('execute') || input.toLowerCase().includes('open'))) {
        // Simulate autonomous action
        const actionMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Initializing autonomous execution for: "${input}"`,
          type: 'action',
          status: 'executing'
        };
        setMessages(prev => [...prev, actionMsg]);
        
        await new Promise(r => setTimeout(r, 2000));
        responseText = `Task completed. Code compiled and application launched successfully. Observability trace recorded in Langfuse.`;
        type = 'action';
        
        setMessages(prev => prev.map(m => m.id === actionMsg.id ? { ...m, status: 'completed', content: responseText } : m));
        setIsLoading(false);
        return;
      } else {
        responseText = await generateSLMResponse(input);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: responseText,
        type: type
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
      <div className="w-72 border-r border-border bg-card/30 backdrop-blur-md flex flex-col">
        <div className="p-6 border-bottom border-border">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-accent-purple" />
            <span className="font-bold tracking-tighter text-lg">AEGIS FORGE</span>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<Bot className="w-4 h-4" />} label="Neural Chat" />
            <SidebarItem active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<Video className="w-4 h-4" />} label="Media Lab" />
            <SidebarItem active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} icon={<Wrench className="w-4 h-4" />} label="Toolbox" />
            <SidebarItem active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} icon={<Layers className="w-4 h-4" />} label="Agent Swarm" />
            <SidebarItem active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} icon={<Eye className="w-4 h-4" />} label="Observability" />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-foreground/40 font-mono uppercase">MCP Status</span>
              <span className="text-[10px] text-green-400 font-mono">CONNECTED</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-foreground/60 font-mono">256 Tools Integrated</span>
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
        <header className="h-20 border-b border-border flex items-center justify-between px-10 bg-card/10 backdrop-blur-xl z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_10px_rgba(188,0,255,0.8)]" />
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.3em]">
                Sovereign Core Active
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 rounded bg-accent-cyan/10 border border-accent-cyan/20 text-[9px] font-mono text-accent-cyan">COMPOSIO</div>
              <div className="px-2 py-0.5 rounded bg-accent-purple/10 border border-accent-purple/20 text-[9px] font-mono text-accent-purple">BROWSER USE</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
              <Activity className="w-3 h-3 text-accent-cyan" />
              <span className="text-[10px] font-mono text-accent-cyan">14ms</span>
            </div>
            <button className="p-2 text-foreground/40 hover:text-foreground transition-colors"><Search className="w-4 h-4" /></button>
            <button className="p-2 text-foreground/40 hover:text-foreground transition-colors"><Settings className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' || activeTab === 'media' ? (
              <motion.div 
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
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
                        msg.type === 'action' ? "border-green-500/30 bg-green-500/5" : "",
                        msg.type === 'media' ? "border-blue-500/30 bg-blue-500/5" : ""
                      )}>
                        {msg.type === 'action' && (
                          <div className="flex items-center gap-2 mb-3 text-green-400 font-bold uppercase text-[10px] tracking-widest">
                            <Terminal className="w-3 h-3" />
                            Autonomous Execution {msg.status === 'executing' ? '...' : 'Complete'}
                          </div>
                        )}
                        {msg.type === 'media' && (
                          <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                            <Zap className="w-3 h-3" />
                            Studio Media Synthesis
                          </div>
                        )}
                        <div className="whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && <LoadingIndicator />}
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
                      placeholder={activeTab === 'media' ? "Describe the video or music to generate..." : "Execute autonomous tasks or chat..."}
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
                </div>
              </motion.div>
            ) : activeTab === 'tools' ? (
              <motion.div key="tools" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                <ToolCard title="Composio" description="250+ pre-built tool integrations for enterprise SaaS." icon={<Globe className="w-5 h-5" />} status="Active" />
                <ToolCard title="StackOne" description="Unified API for Salesforce, Workday, and more." icon={<Box className="w-5 h-5" />} status="Active" />
                <ToolCard title="Browser Use" description="Autonomous web navigation and interaction." icon={<Monitor className="w-5 h-5" />} status="Active" />
                <ToolCard title="VS Code Link" description="Direct file system and terminal access." icon={<FileCode className="w-5 h-5" />} status="Active" />
                <ToolCard title="Adobe Suite" description="Photoshop & Illustrator automation bridge." icon={<Layers className="w-5 h-5" />} status="Active" />
                <ToolCard title="Figma Bridge" description="Design-to-code autonomous workflow." icon={<Box className="w-5 h-5" />} status="Active" />
              </motion.div>
            ) : activeTab === 'agents' ? (
              <motion.div key="agents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 flex flex-col gap-6 overflow-y-auto">
                <AgentCard name="Architect" role="System Design & MCP Orchestration" status="Standby" />
                <AgentCard name="Coder" role="Autonomous Implementation & Refactoring" status="Active" />
                <AgentCard name="Auditor" role="Security & Firewall Hardening" status="Standby" />
                <AgentCard name="Media Gen" role="Studio Video & Music Synthesis" status="Active" />
              </motion.div>
            ) : (
              <motion.div key="monitor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                <MonitorCard title="LangSmith Traces" value="1,240" icon={<Activity className="w-5 h-5" />} color="cyan" />
                <MonitorCard title="Safety Score" value="99.9%" icon={<Shield className="w-5 h-5" />} color="purple" />
                <MonitorCard title="Token Efficiency" value="0.82" icon={<Zap className="w-5 h-5" />} color="green" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
        active ? "bg-accent-purple/10 text-accent-purple border border-accent-purple/20" : "text-foreground/50 hover:bg-white/5"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ToolCard({ title, description, icon, status }: { title: string; description: string; icon: React.ReactNode; status: string }) {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-accent-cyan/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan group-hover:bg-accent-cyan/20 transition-colors">
          {icon}
        </div>
        <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest">{status}</span>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-xs text-foreground/50 leading-relaxed">{description}</p>
    </div>
  );
}

function AgentCard({ name, role, status }: { name: string; role: string; status: string }) {
  return (
    <div className="glass-card p-6 flex items-center justify-between border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-xs text-foreground/40">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn("w-1.5 h-1.5 rounded-full", status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-foreground/20')} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{status}</span>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
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
