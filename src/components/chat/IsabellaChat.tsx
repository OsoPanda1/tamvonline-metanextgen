import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, X, Minimize2, Maximize2, 
  Loader2, ImageIcon, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string; // base64 data URL or public URL
  imageLoading?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat`;
const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-image`;

// Detect if user is asking for image generation
const IMAGE_KEYWORDS = [
  'genera una imagen', 'genera imagen', 'crea una imagen', 'crea imagen',
  'dibuja', 'diseña', 'ilustra', 'pinta', 'renderiza',
  'generate an image', 'create an image', 'draw', 'render',
  'haz una imagen', 'hazme una imagen', 'muéstrame', 'visualiza',
  'genera un logo', 'crea un logo', 'diseña un logo',
  'genera un arte', 'crea un arte', 'genera artwork',
  'genera una foto', 'crea una foto',
  'genera un retrato', 'crea un retrato',
  'genera un paisaje', 'genera una escena',
  'imagina y genera', 'imagina y crea',
];

function isImageRequest(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return IMAGE_KEYWORDS.some(kw => lower.includes(kw));
}

function extractImagePrompt(text: string): string {
  const lower = text.toLowerCase();
  // Remove the command prefix and return the description
  for (const kw of IMAGE_KEYWORDS) {
    const idx = lower.indexOf(kw);
    if (idx !== -1) {
      let prompt = text.slice(idx + kw.length).trim();
      // Remove leading "de", "of", ":" etc.
      prompt = prompt.replace(/^(de|of|del|sobre|con|:|\s)+/i, '').trim();
      return prompt || text;
    }
  }
  return text;
}

interface IsabellaChatProps {
  onClose?: () => void;
  embedded?: boolean;
}

export function IsabellaChat({ onClose, embedded = false }: IsabellaChatProps) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola, Ciudadano! Soy Isabella, tu compañera en el universo TAMV. Puedo conversar contigo, responder preguntas y también **generar imágenes**. Solo dime "genera una imagen de..." y crearé algo visual para ti. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if ((isOpen || embedded) && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, embedded]);

  // Image generation handler
  const generateImage = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    const prompt = extractImagePrompt(userMessage);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    const assistantId = `assistant-img-${Date.now()}`;
    const loadingMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '🎨 Generando imagen...',
      timestamp: new Date(),
      imageLoading: true,
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);

    try {
      const response = await fetch(IMAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast.error('Demasiadas solicitudes. Intenta en un momento.');
        } else if (response.status === 402) {
          toast.error('Créditos de IA agotados.');
        }
        throw new Error(err.error || 'Error generando imagen');
      }

      const data = await response.json();

      if (data.success && data.imageData) {
        const imageUrl = data.publicUrl || data.imageData;
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? {
                  ...m,
                  content: data.textResponse || `✨ Aquí tienes tu imagen: "${prompt}"`,
                  image: imageUrl,
                  imageLoading: false,
                }
              : m
          )
        );
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? {
                  ...m,
                  content: data.error || 'No pude generar la imagen. Intenta con otra descripción.',
                  imageLoading: false,
                }
              : m
          )
        );
      }
    } catch (error) {
      console.error('Image generation error:', error);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? {
                ...m,
                content: '❌ Error al generar la imagen. Intenta de nuevo.',
                imageLoading: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Text chat handler (streaming)
  const streamChat = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    const apiMessages = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role, content: m.content }));
    apiMessages.push({ role: 'user', content: userMessage });

    let assistantContent = '';
    const assistantId = `assistant-${Date.now()}`;

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: apiMessages,
          userId: user?.id || 'anonymous'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast.error('Isabella está ocupada. Intenta en un momento.');
          throw new Error('Rate limited');
        }
        if (response.status === 402) {
          toast.error('Créditos de IA agotados.');
          throw new Error('Payment required');
        }
        throw new Error(errorData.error || 'Error de conexión');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader available');

      let buffer = '';

      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith(':') || !line.trim()) continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {}
        }
      }

      if (buffer.trim() && buffer.startsWith('data: ')) {
        const jsonStr = buffer.slice(6).trim();
        if (jsonStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      if (!assistantContent) {
        setMessages(prev => prev.filter(m => m.id !== assistantId));
      }
      if (error instanceof Error && !['Rate limited', 'Payment required'].includes(error.message)) {
        toast.error('Error conectando con Isabella');
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');

    if (isImageRequest(message)) {
      generateImage(message);
    } else {
      streamChat(message);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `isabella-${Date.now()}.png`;
    link.click();
  };

  // Floating button mode
  if (!embedded && !isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-aurora flex items-center justify-center glow-secondary shadow-lg"
      >
        <Bot className="w-7 h-7 text-primary-foreground" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-green rounded-full border-2 border-background" />
      </motion.button>
    );
  }

  const chatContent = (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        height: isMinimized ? 'auto' : embedded ? '100%' : '500px',
      }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      className={`glass-strong rounded-2xl border-glow overflow-hidden flex flex-col ${
        embedded ? 'w-full h-full' : 'fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-aurora flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyber-green rounded-full border-2 border-background" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm">Isabella AI</h3>
            <p className="text-xs text-muted-foreground">Guardiana TAMV · 🎨 Imagen</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {/* Image loading state */}
                      {message.imageLoading && (
                        <div className="flex items-center gap-2 mt-2 py-2">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <span className="text-xs text-muted-foreground">Creando tu imagen...</span>
                        </div>
                      )}

                      {/* Generated image */}
                      {message.image && (
                        <div className="mt-3 space-y-2">
                          <div className="relative group rounded-xl overflow-hidden border border-primary/20">
                            <img
                              src={message.image}
                              alt="Imagen generada por Isabella"
                              className="w-full h-auto rounded-xl max-h-[300px] object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 text-xs"
                                onClick={() => downloadImage(message.image!)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Loading state for text */}
                      {message.role === 'assistant' && !message.content && !message.imageLoading && isLoading && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs text-muted-foreground">Pensando...</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-primary/10">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Escribe o di "genera una imagen de..."'
                  disabled={isLoading}
                  className="flex-1 bg-input border-primary/20 focus:border-primary"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="bg-aurora text-primary-foreground shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isImageRequest(input) ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {input && isImageRequest(input) && (
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Modo imagen activado
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return embedded ? chatContent : <AnimatePresence>{isOpen && chatContent}</AnimatePresence>;
}
