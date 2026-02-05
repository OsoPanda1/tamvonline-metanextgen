 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { supabase } from '@/integrations/supabase/client';
 import { Navigation } from '@/components/layout/Navigation';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { 
   Wallet, 
   ArrowUpRight, 
   ArrowDownLeft, 
   History,
   Lock,
   TrendingUp,
   Loader2,
   Send,
   Download
 } from 'lucide-react';
 
 interface Transaction {
   id: string;
   amount: number;
   transaction_type: string;
   description: string | null;
   created_at: string;
   from_user_id: string | null;
   to_user_id: string | null;
 }
 
 export default function WalletPage() {
   const { user, wallet, loading } = useAuth();
   const navigate = useNavigate();
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [loadingTx, setLoadingTx] = useState(true);
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   useEffect(() => {
     async function fetchTransactions() {
       if (!user) return;
       
       const { data } = await supabase
         .from('transactions')
         .select('*')
         .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
         .order('created_at', { ascending: false })
         .limit(20);
 
       setTransactions(data || []);
       setLoadingTx(false);
     }
 
     fetchTransactions();
   }, [user]);
 
   if (loading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-primary animate-spin" />
       </div>
     );
   }
 
   const formatDate = (date: string) => {
     return new Date(date).toLocaleDateString('es-MX', {
       day: '2-digit',
       month: 'short',
       hour: '2-digit',
       minute: '2-digit'
     });
   };
 
   return (
     <div className="min-h-screen bg-background">
       <Navigation />
       
       <main className="pt-24 pb-12 px-4">
         <div className="container mx-auto max-w-4xl">
           {/* Header */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center mb-8"
           >
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 mb-4">
               <Wallet className="w-10 h-10 text-gold" />
             </div>
             <h1 className="font-display text-3xl font-bold mb-2">Wallet TAMV</h1>
             <p className="text-muted-foreground">Gestiona tus TAU Credits</p>
           </motion.div>
 
           {/* Balance Card */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="mb-8"
           >
             <Card className="glass border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
               <CardContent className="pt-6">
                 <div className="grid md:grid-cols-3 gap-6">
                   <div className="text-center md:text-left">
                     <p className="text-sm text-muted-foreground mb-1">Balance Disponible</p>
                     <p className="text-4xl font-display font-bold text-gold">
                       {wallet?.balance?.toLocaleString() || '0'}
                       <span className="text-lg ml-2">TAU</span>
                     </p>
                   </div>
                   <div className="text-center">
                     <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                       <Lock className="w-3 h-3" /> Bloqueado
                     </p>
                     <p className="text-2xl font-display font-bold text-muted-foreground">
                       {wallet?.locked_balance?.toLocaleString() || '0'} TAU
                     </p>
                   </div>
                   <div className="text-center md:text-right">
                     <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center md:justify-end gap-1">
                       <TrendingUp className="w-3 h-3" /> Total Ganado
                     </p>
                     <p className="text-2xl font-display font-bold text-green-400">
                       {wallet?.total_earned?.toLocaleString() || '0'} TAU
                     </p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </motion.div>
 
           {/* Action Buttons */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="grid grid-cols-2 gap-4 mb-8"
           >
             <Button 
               size="lg" 
               className="h-16 bg-primary hover:bg-primary/90"
             >
               <Send className="w-5 h-5 mr-2" />
               Enviar TAU
             </Button>
             <Button 
               size="lg" 
               variant="outline"
               className="h-16 border-primary/30"
             >
               <Download className="w-5 h-5 mr-2" />
               Recibir TAU
             </Button>
           </motion.div>
 
           {/* Transaction History */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
           >
             <Card className="glass border-primary/20">
               <CardHeader>
                 <CardTitle className="font-display text-lg flex items-center gap-2">
                   <History className="w-5 h-5" />
                   Historial de Transacciones
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 {loadingTx ? (
                   <div className="flex items-center justify-center py-8">
                     <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                   </div>
                 ) : transactions.length === 0 ? (
                   <div className="text-center py-8">
                     <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                     <p className="text-muted-foreground">No hay transacciones aún</p>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {transactions.map((tx) => {
                       const isIncoming = tx.to_user_id === user?.id;
                       return (
                         <div 
                           key={tx.id}
                           className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border"
                         >
                           <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                               isIncoming ? 'bg-green-500/20' : 'bg-red-500/20'
                             }`}>
                               {isIncoming ? (
                                 <ArrowDownLeft className="w-5 h-5 text-green-400" />
                               ) : (
                                 <ArrowUpRight className="w-5 h-5 text-red-400" />
                               )}
                             </div>
                             <div>
                               <p className="font-medium">{tx.description || tx.transaction_type}</p>
                               <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                             </div>
                           </div>
                           <p className={`font-display font-bold ${isIncoming ? 'text-green-400' : 'text-red-400'}`}>
                             {isIncoming ? '+' : '-'}{tx.amount} TAU
                           </p>
                         </div>
                       );
                     })}
                   </div>
                 )}
               </CardContent>
             </Card>
           </motion.div>
 
           {/* Economy Info */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="mt-8"
           >
             <Card className="glass border-primary/20">
               <CardContent className="pt-6">
                 <h3 className="font-display font-bold mb-4">Economía Federada TAMV</h3>
                 <div className="grid md:grid-cols-3 gap-4 text-sm">
                   <div className="p-4 rounded-lg bg-primary/10">
                     <p className="font-bold text-primary mb-1">20% Fénix</p>
                     <p className="text-muted-foreground text-xs">Reinversión en infraestructura</p>
                   </div>
                   <div className="p-4 rounded-lg bg-gold/10">
                     <p className="font-bold text-gold mb-1">30% Creadores</p>
                     <p className="text-muted-foreground text-xs">Recompensas a la comunidad</p>
                   </div>
                   <div className="p-4 rounded-lg bg-green-400/10">
                     <p className="font-bold text-green-400 mb-1">50% Reserva</p>
                     <p className="text-muted-foreground text-xs">Estabilidad del ecosistema</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </motion.div>
         </div>
       </main>
     </div>
   );
 }