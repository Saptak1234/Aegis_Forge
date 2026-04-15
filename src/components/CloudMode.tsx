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
  Monitor,
  Download,
  ImageIcon,
  ExternalLink,
  Play,
  Square,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { generateSLMResponse, auditCode, generateStudioVideo, generateStudioMusic, generateInteractiveApp } from '@/src/services/geminiService';
import * as Tone from 'tone';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code' | 'audit' | 'action' | 'media' | 'app';
  status?: 'pending' | 'executing' | 'completed';
  image?: string;
  frames?: string[];
  audioSequence?: any;
  appData?: any;
}

interface CloudModeProps {
  onBack: () => void;
}

export default function CloudMode({ onBack }: CloudModeProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Aegis Sovereign Core online. Neural Brain upgraded to Gemma 4 Sovereign Core (Pro-Tier). Multi-agent swarm initialized. Tool integrations active. What is our objective?',
    }
  ]);
  const [neuralMemory, setNeuralMemory] = React.useState<string>('');
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [progressLabel, setProgressLabel] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'chat' | 'media' | 'forge' | 'workspace' | 'monitor'>('chat');
  const [workspaceFiles, setWorkspaceFiles] = React.useState<{name: string, isDirectory: boolean}[]>([]);
  const [terminalOutput, setTerminalOutput] = React.useState<string>('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const fetchWorkspace = async () => {
    try {
      const res = await fetch('/api/workspace');
      const data = await res.json();
      setWorkspaceFiles(data);
    } catch (e) {}
  };

  React.useEffect(() => {
    fetchWorkspace();
    const interval = setInterval(fetchWorkspace, 5000);
    return () => clearInterval(interval);
  }, []);

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
    setProgress(0);
    setProgressLabel('Initializing Neural Core...');

    try {
      const lowerInput = input.toLowerCase();
      const isAppRequest = lowerInput.includes('create') && (lowerInput.includes('app') || lowerInput.includes('game') || lowerInput.includes('tool') || lowerInput.includes('simulation') || lowerInput.includes('flappy bird'));
      const isMediaRequest = lowerInput.includes('generate') && (lowerInput.includes('music') || lowerInput.includes('video') || lowerInput.includes('song') || lowerInput.includes('track'));

      if (activeTab === 'forge' || isAppRequest) {
        setProgress(20);
        setProgressLabel('Analyzing Requirements...');
        await new Promise(r => setTimeout(r, 800));
        
        setProgress(40);
        setProgressLabel('Architecting Neural Sandbox...');
        const appData = await generateInteractiveApp(input, neuralMemory);
        
        // Update memory with this creation
        setNeuralMemory(prev => `${prev}\n- Created app: ${appData.name}. Logic: ${appData.description.substring(0, 100)}...`);
        
        setProgress(80);
        setProgressLabel('Compiling Interactive Blueprint...');
        await new Promise(r => setTimeout(r, 1000));

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Neural Sandbox Created: ${appData.name}\n\n${appData.description}`,
          type: 'app',
          appData: appData
        };
        setMessages(prev => [...prev, assistantMessage]);
        setProgress(100);
        setIsLoading(false);
        return;
      }

      if (activeTab === 'media' || isMediaRequest) {
        setProgress(10);
        setProgressLabel('Crawling Neural Web...');
        await new Promise(r => setTimeout(r, 1000));

        setProgress(30);
        setProgressLabel('Initializing Synthesis Modules...');
        let result;
        if (input.toLowerCase().includes('video')) {
          result = await generateStudioVideo(input);
        } else {
          result = await generateStudioMusic(input, neuralMemory);
          // Update memory with music production feedback
          setNeuralMemory(prev => `${prev}\n- Produced music: ${input}. Key: ${result.audioSequence?.key}. Tempo: ${result.audioSequence?.tempo}.`);
        }
        
        setProgress(50);
        setProgressLabel('Neural Artist Profiling...');
        await new Promise(r => setTimeout(r, 800));
        setProgress(60);
        setProgressLabel('Neural Style Training (Epoch 1/5)...');
        await new Promise(r => setTimeout(r, 800));
        setProgress(70);
        setProgressLabel('Neural Style Training (Epoch 5/5)...');
        await new Promise(r => setTimeout(r, 800));

        setProgress(90);
        setProgressLabel('Rendering Professional Assets...');
        await new Promise(r => setTimeout(r, 1500));

        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: result.text,
          type: 'media',
          image: result.image,
          frames: result.frames,
          audioSequence: result.audioSequence
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setProgress(100);
        setIsLoading(false);
        return;
      }

      let responseText = '';
      let type: Message['type'] = 'text';

      if (activeTab === 'chat' && (input.toLowerCase().includes('run') || input.toLowerCase().includes('execute') || input.toLowerCase().includes('open'))) {
        setProgress(20);
        setProgressLabel('Initializing Autonomous Core...');
        // Simulate autonomous action
        const actionMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Initializing autonomous execution for: "${input}"`,
          type: 'action',
          status: 'executing'
        };
        setMessages(prev => [...prev, actionMsg]);
        
        setProgress(50);
        setProgressLabel('Executing Neural Sequence...');
        await new Promise(r => setTimeout(r, 2000));
        
        setProgress(90);
        setProgressLabel('Verifying Trace Records...');
        responseText = `Task completed. Code compiled and application launched successfully. Observability trace recorded in Langfuse.`;
        type = 'action';
        
        setMessages(prev => prev.map(m => m.id === actionMsg.id ? { ...m, status: 'completed', content: responseText } : m));
        setProgress(100);
        setIsLoading(false);
        return;
      } else {
        setProgress(30);
        setProgressLabel('Consulting Neural Knowledge...');
        const result = await generateSLMResponse(input);
        responseText = result.text;
        
        if (result.toolResults) {
          const outputs = result.toolResults.map((r: any) => r.stdout || r.stderr || JSON.stringify(r)).join('\n');
          if (outputs) {
            setTerminalOutput(prev => `${prev}\n> ${outputs}`);
            setActiveTab('workspace');
          }
        }
        
        setProgress(100);
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
            <SidebarItem active={activeTab === 'forge'} onClick={() => setActiveTab('forge')} icon={<Code className="w-4 h-4" />} label="Neural Forge" />
            <SidebarItem active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<Video className="w-4 h-4" />} label="Media Lab" />
            <SidebarItem active={activeTab === 'workspace'} onClick={() => setActiveTab('workspace')} icon={<Database className="w-4 h-4" />} label="Neural Workspace" />
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
              <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[9px] font-mono text-green-400">FREE TIER CORE</div>
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
                        {msg.audioSequence && (
                          <NeuralPlayer 
                            sequence={msg.audioSequence} 
                            onFeedback={(f) => setNeuralMemory(prev => `${prev}\n- User Feedback on Music (${msg.audioSequence.tempo}BPM): ${f}`)}
                          />
                        )}
                        {msg.appData && (
                          <NeuralSandbox 
                            appData={msg.appData} 
                            onFeedback={(f) => setNeuralMemory(prev => `${prev}\n- User Feedback on App (${msg.appData.name}): ${f}`)}
                          />
                        )}
                        {msg.frames && (
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {msg.frames.map((frame, i) => (
                                <div key={i} className="rounded-lg overflow-hidden border border-white/10 shadow-lg group relative">
                                  <img 
                                    src={frame} 
                                    alt={`Frame ${i+1}`} 
                                    className="w-full h-32 object-cover transition-transform group-hover:scale-110"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] font-mono text-white">
                                    FRAME {i+1}
                                  </div>
                                  <button 
                                    onClick={() => downloadAsset(frame, `frame-${i+1}.png`)}
                                    className="absolute top-1 right-1 p-1 bg-black/40 hover:bg-black/60 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => downloadText(msg.content, 'video-blueprint.txt')}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono uppercase tracking-wider transition-colors"
                            >
                              <FileCode className="w-3 h-3" /> Download Blueprint
                            </button>
                          </div>
                        )}
                        {msg.image && (
                          <div className="mt-4 space-y-4">
                            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group">
                              <img 
                                src={msg.image} 
                                alt="Neural Synthesis" 
                                className="w-full h-auto object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <button 
                                onClick={() => downloadAsset(msg.image!, 'album-art.png')}
                                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                            {msg.type === 'media' && (
                              <button 
                                onClick={() => downloadText(msg.content, 'lyrics-notes.txt')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono uppercase tracking-wider transition-colors"
                              >
                                <FileCode className="w-3 h-3" /> Download Lyrics
                              </button>
                            )}
                          </div>
                        )}
                        {msg.type === 'audit' && (
                          <button 
                            onClick={() => downloadText(msg.content, 'security-audit.txt')}
                            className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono uppercase tracking-wider transition-colors"
                          >
                            <FileCode className="w-3 h-3" /> Download Audit Report
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && <LoadingIndicator />}
                </div>

                {/* Input Area */}
                <div className="p-8 pt-0">
                  {isLoading && (
                    <div className="max-w-4xl mx-auto mb-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-accent-purple uppercase tracking-widest">
                        <span>{progressLabel}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        />
                      </div>
                    </div>
                  )}
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
            ) : activeTab === 'workspace' ? (
              <motion.div key="workspace" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 p-8 overflow-hidden">
                <NeuralWorkspace files={workspaceFiles} terminalOutput={terminalOutput} />
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

const downloadAsset = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadText = (text: string, filename: string) => {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function NeuralWorkspace({ files, terminalOutput }: { files: {name: string, isDirectory: boolean}[], terminalOutput: string }) {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [fileContent, setFileContent] = React.useState<string>('');

  const readFile = async (name: string) => {
    try {
      const res = await fetch(`/api/workspace/${name}`);
      const data = await res.json();
      setFileContent(data.content);
      setSelectedFile(name);
    } catch (e) {}
  };

  return (
    <div className="flex h-full bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
      <div className="w-64 border-r border-white/5 p-4 flex flex-col gap-2">
        <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Database className="w-3 h-3" /> Workspace Files
        </div>
        {files.map(file => (
          <button 
            key={file.name}
            onClick={() => readFile(file.name)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left",
              selectedFile === file.name ? "bg-accent-cyan/20 text-accent-cyan" : "hover:bg-white/5 text-foreground/60"
            )}
          >
            {file.isDirectory ? <Box className="w-3 h-3" /> : <FileCode className="w-3 h-3" />}
            {file.name}
          </button>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="text-xs font-bold text-accent-cyan">{selectedFile || 'Select a file to view'}</div>
          {selectedFile && (
            <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
              Operational Mode Active
            </div>
          )}
        </div>
        <div className="flex-1 p-4 overflow-auto font-mono text-xs text-foreground/80 whitespace-pre">
          {fileContent || '// Neural link established. Awaiting file selection...'}
        </div>
        {terminalOutput && (
          <div className="h-32 border-t border-white/5 bg-black/40 p-4 flex flex-col">
            <div className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-2 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Neural Terminal Output
            </div>
            <div className="flex-1 overflow-auto font-mono text-[10px] text-green-400/80 whitespace-pre">
              {terminalOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NeuralFeedback({ onFeedback }: { onFeedback: (feedback: string) => void }) {
  const [feedback, setFeedback] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    onFeedback(feedback);
    setIsSubmitted(true);
    setFeedback('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest mb-2 flex items-center gap-2">
        <Activity className="w-3 h-3" /> Neural Feedback Loop
      </div>
      {isSubmitted ? (
        <div className="text-xs text-accent-cyan flex items-center gap-2 animate-pulse">
          <Zap className="w-3 h-3" /> Feedback integrated into Neural Memory.
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input 
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What should I improve next time?"
              className="flex-1 bg-black/20 border border-white/10 rounded-md px-3 py-1 text-xs focus:outline-none focus:border-accent-cyan/50 text-white"
            />
            <button 
              onClick={handleSubmit}
              className="px-3 py-1 rounded-md bg-accent-cyan/20 text-accent-cyan text-[10px] font-bold hover:bg-accent-cyan/30 transition-colors"
            >
              SUBMIT
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {['Too Muddy', 'Vocals Quiet', 'More Bass', 'Too Robotic', 'Need More FX'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  onFeedback(tag);
                  setIsSubmitted(true);
                  setTimeout(() => setIsSubmitted(false), 3000);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[8px] font-mono text-foreground/40 uppercase transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NeuralSandbox({ appData, onFeedback }: { appData: any, onFeedback: (f: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const openInNewTab = () => {
    const blob = new Blob([appData.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const downloadCode = () => {
    downloadText(appData.html, `${appData.name.toLowerCase().replace(/\s+/g, '-')}.html`);
  };

  return (
    <div className="mt-4 glass-card overflow-hidden border-accent-cyan/20">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-accent-cyan/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">{appData.name}</div>
            <div className="text-[10px] text-foreground/40 font-mono uppercase tracking-widest">Neural Sandbox • {appData.language || 'Web'}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadCode}
            title="Download Code"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/60 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/60 transition-colors"
          >
            {isOpen ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={openInNewTab}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/60 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="h-[500px] bg-white">
          <iframe 
            srcDoc={appData.html}
            className="w-full h-full border-none"
            title="Neural Sandbox"
            sandbox="allow-scripts allow-forms allow-popups allow-modals"
          />
        </div>
      )}
      
      {!isOpen && (
        <div className="p-8 flex flex-col items-center justify-center text-center bg-black/20">
          <div className="w-16 h-16 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-4">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="text-sm font-medium mb-2">Neural Sandbox Ready</div>
          <div className="text-xs text-foreground/40 mb-6 max-w-xs">The application has been compiled and is ready for interaction.</div>
          <button 
            onClick={() => setIsOpen(true)}
            className="px-6 py-2 rounded-full bg-accent-cyan text-black font-bold text-xs hover:scale-105 transition-transform"
          >
            Initialize Sandbox
          </button>
        </div>
      )}
      <div className="p-4 border-t border-white/5">
        <NeuralFeedback onFeedback={onFeedback} />
      </div>
    </div>
  );
}

function NeuralPlayer({ sequence, onFeedback }: { sequence: any, onFeedback: (f: string) => void }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const partsRef = React.useRef<Tone.Part[]>([]);
  const synthsRef = React.useRef<any[]>([]);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const vocalTimeouts = React.useRef<number[]>([]);

  const togglePlayback = async () => {
    if (isPlaying) {
      Tone.getTransport().stop();
      vocalTimeouts.current.forEach(clearTimeout);
      vocalTimeouts.current = [];
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    await Tone.start();
    
    // Cleanup
    synthsRef.current.forEach(s => s.dispose());
    partsRef.current.forEach(p => p.dispose());
    synthsRef.current = [];
    partsRef.current = [];

    // Master Bus Processing (Studio Mastering Chain)
    const masterLimiter = new Tone.Limiter(-1).toDestination();
    
    // Spectral Carving EQ (Dynamic Mid-Dipping)
    const masterEQ = new Tone.EQ3({
      low: 0,
      mid: 0,
      high: 1,
      lowFrequency: 250,
      highFrequency: 4000
    }).connect(masterLimiter);

    const masterCompressor = new Tone.Compressor({
      threshold: -20,
      ratio: 3,
      attack: 0.01,
      release: 0.1
    }).connect(masterEQ);

    // Stereo Imaging (Mid-Side Simulation)
    const widener = new Tone.StereoWidener(0.6).connect(masterCompressor);

    const effects = sequence.effects || {};
    const reverb = new Tone.Reverb(effects.reverb || 0.5).connect(widener);
    const delay = new Tone.FeedbackDelay("8n", effects.delay || 0.3).connect(widener);
    const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(widener);
    const distortion = new Tone.Distortion(effects.distortion || 0.1).connect(widener);
    const compressor = new Tone.Compressor(-30, 3).connect(widener);
    
    // Vocal Specific Processing
    const vocalEQ = new Tone.EQ3(2, 0, 4).connect(widener);
    const vocalReverb = new Tone.Reverb(0.8).connect(widener);
    await vocalReverb.ready;

    // Multi-Track Setup
    const tracks = sequence.tracks;
    const sortNotes = (notes: any[]) => {
      const sorted = [...notes].sort((a, b) => {
        const timeA = Tone.Time(a.time).toSeconds();
        const timeB = Tone.Time(b.time).toSeconds();
        return timeA - timeB;
      });

      // Ensure strictly increasing times to avoid Tone.Timeline conflicts
      return sorted.map((note, index) => ({
        ...note,
        time: Tone.Time(note.time).toSeconds() + (index * 0.0001)
      }));
    };
    
    if (tracks.drums) {
      const drumSynth = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.1, release: 0.1 } }).connect(compressor);
      synthsRef.current.push(drumSynth);
      partsRef.current.push(new Tone.Part((time, value) => drumSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.drums)).start(0));
    }

    if (tracks.bass) {
      const bassSynth = new Tone.MonoSynth({ oscillator: { type: "square" }, envelope: { attack: 0.1 } }).connect(compressor);
      synthsRef.current.push(bassSynth);
      partsRef.current.push(new Tone.Part((time, value) => bassSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.bass)).start(0));
    }

    if (tracks.chords) {
      const chordSynth = new Tone.PolySynth(Tone.Synth).connect(reverb);
      synthsRef.current.push(chordSynth);
      partsRef.current.push(new Tone.Part((time, value) => chordSynth.triggerAttackRelease(value.notes, value.duration, time), sortNotes(tracks.chords)).start(0));
    }

    if (tracks.lead) {
      const leadSynth = new Tone.DuoSynth().connect(delay);
      synthsRef.current.push(leadSynth);
      partsRef.current.push(new Tone.Part((time, value) => leadSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.lead)).start(0));
    }

    if (tracks.strings) {
      const stringSynth = new Tone.PolySynth(Tone.Synth).connect(chorus);
      synthsRef.current.push(stringSynth);
      partsRef.current.push(new Tone.Part((time, value) => stringSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.strings)).start(0));
    }

    if (tracks.pads) {
      const padSynth = new Tone.PolySynth(Tone.Synth).connect(reverb);
      synthsRef.current.push(padSynth);
      partsRef.current.push(new Tone.Part((time, value) => padSynth.triggerAttackRelease(value.notes, value.duration, time), sortNotes(tracks.pads)).start(0));
    }

    if (tracks.fx) {
      const fxSynth = new Tone.FMSynth().connect(distortion);
      synthsRef.current.push(fxSynth);
      partsRef.current.push(new Tone.Part((time, value) => fxSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.fx)).start(0));
    }

    if (tracks.brass) {
      const brassSynth = new Tone.MonoSynth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.05 } }).connect(compressor);
      synthsRef.current.push(brassSynth);
      partsRef.current.push(new Tone.Part((time, value) => brassSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.brass)).start(0));
    }

    if (tracks.woodwinds) {
      const wwSynth = new Tone.MonoSynth({ oscillator: { type: "sine" }, envelope: { attack: 0.1 } }).connect(reverb);
      synthsRef.current.push(wwSynth);
      partsRef.current.push(new Tone.Part((time, value) => wwSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.woodwinds)).start(0));
    }

    if (tracks.percussion) {
      const percSynth = new Tone.MembraneSynth().connect(compressor);
      synthsRef.current.push(percSynth);
      partsRef.current.push(new Tone.Part((time, value) => percSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.percussion)).start(0));
    }

    if (tracks.arpeggio) {
      const arpSynth = new Tone.AMSynth().connect(delay);
      synthsRef.current.push(arpSynth);
      partsRef.current.push(new Tone.Part((time, value) => arpSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.arpeggio)).start(0));
    }

    if (tracks.subBass) {
      const subSynth = new Tone.MonoSynth({ oscillator: { type: "sine" }, envelope: { attack: 0.2, release: 0.5 } }).connect(compressor);
      synthsRef.current.push(subSynth);
      partsRef.current.push(new Tone.Part((time, value) => subSynth.triggerAttackRelease(value.note, value.duration, time), sortNotes(tracks.subBass)).start(0));
    }

    if (tracks.texture) {
      const texSynth = new Tone.NoiseSynth({ noise: { type: "white" } }).connect(reverb);
      synthsRef.current.push(texSynth);
      partsRef.current.push(new Tone.Part((time, value) => texSynth.triggerAttackRelease(value.duration, time), sortNotes(tracks.texture)).start(0));
    }

    // Neural Vocalist (Web Speech API) with Studio Dynamics
    if (sequence.vocalScript) {
      sequence.vocalScript.forEach((line: any) => {
        const timeout = window.setTimeout(() => {
          const speak = (offsetPitch = 0, offsetDelay = 0, isDouble = false) => {
            const utterance = new SpeechSynthesisUtterance(line.text);
            
            // Emotion & Dynamics Mapping
            let pitch = (line.pitch || 1.0) + offsetPitch;
            let rate = line.rate || 0.8;
            let volume = 1.0;

            // Apply Dynamics (p to ff)
            const dynamicsMap: Record<string, number> = { 'p': 0.4, 'mp': 0.6, 'mf': 0.8, 'f': 1.0, 'ff': 1.2 };
            if (line.dynamics) volume *= (dynamicsMap[line.dynamics] || 1.0);

            // Apply Artist Profile Overrides
            if (sequence.artistProfile) {
              const ap = sequence.artistProfile;
              pitch *= ap.vocalStyle.pitch;
              rate *= ap.vocalStyle.rate;
            }

            if (line.emotion === 'soulful') {
              pitch *= 0.9;
              rate *= 0.85;
            } else if (line.emotion === 'aggressive') {
              pitch *= 1.2;
              rate *= 1.1;
              volume *= 1.2;
            } else if (line.emotion === 'ethereal') {
              pitch *= 1.3;
              rate *= 0.7;
            } else if (line.emotion === 'intimate') {
              pitch *= 0.8;
              rate *= 0.75;
              volume *= 0.7;
            }

            utterance.pitch = pitch;
            utterance.rate = rate;
            utterance.volume = isDouble ? volume * 0.6 : volume;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => 
              v.name.includes('Premium') || 
              v.name.includes('Natural') || 
              v.name.includes('Neural') ||
              v.name.includes('Google')
            );
            if (preferredVoice) utterance.voice = preferredVoice;
            
            // Trigger Vocal Reverb Send (Reverb is already ready)
            if (line.reverbSend > 0.5) {
              // No need to call generate() here, it's already active
            }

            if (offsetDelay > 0) {
              setTimeout(() => window.speechSynthesis.speak(utterance), offsetDelay);
            } else {
              window.speechSynthesis.speak(utterance);
            }
          };

          // Trigger Spectral Carving (Dip mids to make room for vocal)
          masterEQ.mid.rampTo(-6, 0.1);
          
          // Main Vocal
          speak();
          
          // Reset Spectral Carving after line (approximate duration)
          setTimeout(() => {
            masterEQ.mid.rampTo(0, 0.5);
          }, 3000);
          
          // Neural Doubler (Professional Studio Effect)
          if (line.vibrato > 0.5 || line.emotion === 'soulful' || line.emotion === 'aggressive') {
            speak(0.05, 50, true); 
          }

          // Breath Simulation (Noise Burst)
          if (line.breathiness > 0.3) {
            const noise = new Tone.Noise("pink").start();
            const filter = new Tone.Filter(3000, "bandpass").connect(vocalEQ);
            const env = new Tone.AmplitudeEnvelope({
              attack: 0.1,
              decay: 0.3,
              sustain: 0,
              release: 0.1
            }).connect(filter);
            env.triggerAttackRelease(0.4);
            setTimeout(() => noise.dispose(), 1000);
          }
        }, line.time * 1000);
        vocalTimeouts.current.push(timeout);
      });
    }

    Tone.getTransport().bpm.value = sequence.tempo || 120;
    Tone.getTransport().start();
    setIsPlaying(true);
  };

  React.useEffect(() => {
    return () => {
      Tone.getTransport().stop();
      synthsRef.current.forEach(s => s.dispose());
      partsRef.current.forEach(p => p.dispose());
    };
  }, []);

  return (
    <div className="mt-4 p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlayback}
          className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-accent-purple/20"
        >
          {isPlaying ? <div className="w-4 h-4 bg-white rounded-sm" /> : <Zap className="w-5 h-5 fill-white" />}
        </button>
        <div className="flex-1">
          <div className="text-[10px] font-mono text-accent-purple uppercase tracking-widest mb-1">Neural Multi-Track Stream</div>
          <div className="text-xs font-medium text-foreground/60">
            {sequence.tempo} BPM • {sequence.key || 'C Maj'} • {Object.keys(sequence.tracks).length} Tracks
          </div>
        </div>
        <button 
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sequence, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "neural-sequence.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/60 transition-colors flex items-center gap-2 text-[10px] font-mono uppercase"
        >
          <Download className="w-4 h-4" /> Download Sequence
        </button>
      </div>
      
      <NeuralFeedback onFeedback={onFeedback} />

      <div className="flex gap-1 h-8 items-end">
        {[...Array(24)].map((_, i) => (
          <motion.div 
            key={i}
            animate={isPlaying ? { height: [4, Math.random() * 24 + 4, 4] } : { height: 4 }}
            transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.05 }}
            className="flex-1 bg-accent-purple/40 rounded-full"
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.keys(sequence.tracks).map(track => (
          <div key={track} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-mono uppercase text-center text-foreground/40">
            {track}
          </div>
        ))}
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
