import React from 'react';
import SelectionScreen from './components/SelectionScreen';
import LocalMode from './components/LocalMode';
import CloudMode from './components/CloudMode';
import { AnimatePresence, motion } from 'motion/react';

type AppMode = 'selection' | 'local' | 'cloud';

export default function App() {
  const [mode, setMode] = React.useState<AppMode>('selection');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent-purple/30">
      <AnimatePresence mode="wait">
        {mode === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <SelectionScreen onSelect={setMode} />
          </motion.div>
        )}

        {mode === 'local' && (
          <motion.div
            key="local"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, type: 'spring', damping: 25 }}
          >
            <LocalMode onBack={() => setMode('selection')} />
          </motion.div>
        )}

        {mode === 'cloud' && (
          <motion.div
            key="cloud"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <CloudMode onBack={() => setMode('selection')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
