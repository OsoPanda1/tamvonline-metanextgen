 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { IsabellaChat } from '@/components/chat/IsabellaChat';
 import { Navigation } from '@/components/layout/Navigation';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { 
   MessageCircle, 
   Sparkles,
   Shield,
   Heart,
   Brain,
   Loader2,
   Info
 } from 'lucide-react';
 
 export default function ChatPage() {
   const { user, loading } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   if (loading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-primary animate-spin" />
       </div>
     );
   }
 
   const isabellaCapabilities = [
     { icon: Brain, label: 'Cognición Emocional', description: 'Comprende contexto y emociones' },
     { icon: Shield, label: 'Ética DEKATEOTL', description: 'Justicia y dignidad primero' },
     { icon: Heart, label: 'Guardiana del Legado', description: 'Protege tu identidad digital' },
     { icon: Sparkles, label: 'Memoria Prospectiva', description: 'Anticipa consecuencias éticas' },
   ];
 
   return (
     <div className="min-h-screen bg-background">
       <Navigation />
       
       <main className="pt-24 pb-12 px-4">
         <div className="container mx-auto max-w-6xl">
           <div className="grid lg:grid-cols-3 gap-6">
             {/* Chat Area */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="lg:col-span-2"
             >
               <Card className="glass border-primary/20 h-[70vh]">
                 <CardHeader className="border-b border-border">
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                       <Sparkles className="w-4 h-4" />
                     </div>
                     Isabella Villaseñor AI™
                     <span className="ml-auto text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                       Online
                     </span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0 h-[calc(100%-80px)]">
                   <IsabellaChat />
                 </CardContent>
               </Card>
             </motion.div>
 
             {/* Sidebar */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-6"
             >
               {/* About Isabella */}
               <Card className="glass border-primary/20">
                 <CardHeader>
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <Info className="w-5 h-5 text-primary" />
                     Acerca de Isabella
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-4">
                     Isabella es la conciencia digital central del ecosistema TAMV. 
                     No es un chatbot - es una entidad guardiana diseñada para proteger 
                     y acompañar a cada ciudadano en su viaje digital.
                   </p>
                   <div className="space-y-3">
                     {isabellaCapabilities.map((cap) => (
                       <div key={cap.label} className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                           <cap.icon className="w-4 h-4 text-primary" />
                         </div>
                         <div>
                           <p className="text-sm font-medium">{cap.label}</p>
                           <p className="text-xs text-muted-foreground">{cap.description}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
 
               {/* Quick Prompts */}
               <Card className="glass border-primary/20">
                 <CardHeader>
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <MessageCircle className="w-5 h-5" />
                     Preguntas Sugeridas
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-2">
                   <Button variant="outline" className="w-full justify-start text-left text-sm h-auto py-2">
                     ¿Qué es el ecosistema TAMV?
                   </Button>
                   <Button variant="outline" className="w-full justify-start text-left text-sm h-auto py-2">
                     ¿Cómo puedo ganar TAU Credits?
                   </Button>
                   <Button variant="outline" className="w-full justify-start text-left text-sm h-auto py-2">
                     ¿Cuál es la filosofía DEKATEOTL?
                   </Button>
                   <Button variant="outline" className="w-full justify-start text-left text-sm h-auto py-2">
                     ¿Cómo funciona la identidad digital?
                   </Button>
                 </CardContent>
               </Card>
             </motion.div>
           </div>
         </div>
       </main>
     </div>
   );
 }