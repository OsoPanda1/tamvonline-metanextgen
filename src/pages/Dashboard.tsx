 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { supabase } from '@/integrations/supabase/client';
 import { Navigation } from '@/components/layout/Navigation';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { 
   Wallet, 
   Trophy, 
   Globe, 
   MessageCircle, 
   TrendingUp,
   Shield,
   Star,
   ArrowRight,
   Loader2,
   Clock,
   CheckCircle2
 } from 'lucide-react';
 
 interface Mission {
   id: string;
   title: string;
   description: string;
   xp_reward: number;
   tau_reward: number;
   mission_type: string;
   progress?: number;
 }
 
 export default function Dashboard() {
   const { user, profile, wallet, loading } = useAuth();
   const navigate = useNavigate();
   const [missions, setMissions] = useState<Mission[]>([]);
   const [loadingMissions, setLoadingMissions] = useState(true);
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   useEffect(() => {
     async function fetchMissions() {
       if (!user) return;
       
       const { data: missionsData } = await supabase
         .from('missions')
         .select('*')
         .eq('is_active', true)
         .limit(5);
 
       const { data: userMissions } = await supabase
         .from('user_missions')
         .select('mission_id, progress')
         .eq('user_id', user.id);
 
       const progressMap = new Map(userMissions?.map(m => [m.mission_id, m.progress]) || []);
       
       setMissions(
         (missionsData || []).map(m => ({
           ...m,
           progress: progressMap.get(m.id) || 0
         }))
       );
       setLoadingMissions(false);
     }
 
     fetchMissions();
   }, [user]);
 
   if (loading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-primary animate-spin" />
       </div>
     );
   }
 
   const stats = [
     { 
       label: 'Balance TAU', 
       value: wallet?.balance?.toLocaleString() || '0', 
       icon: Wallet, 
       color: 'text-gold',
       gradient: 'from-gold/20 to-gold/5'
     },
     { 
       label: 'Misiones', 
       value: profile?.missions_completed || 0, 
       icon: Trophy, 
       color: 'text-primary',
       gradient: 'from-primary/20 to-primary/5'
     },
     { 
       label: 'Mundos XR', 
       value: profile?.worlds_visited || 0, 
       icon: Globe, 
       color: 'text-cyan-400',
       gradient: 'from-cyan-400/20 to-cyan-400/5'
     },
     { 
       label: 'Tiempo XR', 
       value: `${profile?.xr_time_minutes || 0}m`, 
       icon: Clock, 
       color: 'text-green-400',
       gradient: 'from-green-400/20 to-green-400/5'
     },
   ];
 
   return (
     <div className="min-h-screen bg-background">
       <Navigation />
       
       <main className="pt-24 pb-12 px-4">
         <div className="container mx-auto max-w-6xl">
           {/* Welcome Header */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-8"
           >
             <h1 className="font-display text-3xl font-bold mb-2">
               Bienvenido, <span className="text-gradient-aurora">{profile?.display_name || 'Ciudadano'}</span>
             </h1>
             <p className="text-muted-foreground">
               Tu panel de control en el Territorio Autónomo de Memoria Viva
             </p>
           </motion.div>
 
           {/* Stats Grid */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             {stats.map((stat, index) => (
               <motion.div
                 key={stat.label}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
               >
                 <Card className={`glass border-0 bg-gradient-to-br ${stat.gradient}`}>
                   <CardContent className="pt-6">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                         <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                       </div>
                       <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
 
           <div className="grid lg:grid-cols-3 gap-6">
             {/* Quick Actions */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="lg:col-span-1"
             >
               <Card className="glass border-primary/20">
                 <CardHeader>
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <Star className="w-5 h-5 text-gold" />
                     Acciones Rápidas
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <Button 
                     className="w-full justify-between group"
                     variant="outline"
                     onClick={() => navigate('/world')}
                   >
                     <span className="flex items-center gap-2">
                       <Globe className="w-4 h-4" />
                       Explorar Ciudad TAMV
                     </span>
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </Button>
                   <Button 
                     className="w-full justify-between group"
                     variant="outline"
                     onClick={() => navigate('/wallet')}
                   >
                     <span className="flex items-center gap-2">
                       <Wallet className="w-4 h-4" />
                       Mi Wallet TAU
                     </span>
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </Button>
                   <Button 
                     className="w-full justify-between group"
                     variant="outline"
                     onClick={() => navigate('/marketplace')}
                   >
                     <span className="flex items-center gap-2">
                       <TrendingUp className="w-4 h-4" />
                       Marketplace
                     </span>
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </Button>
                   <Button 
                     className="w-full justify-between group"
                     variant="outline"
                     onClick={() => navigate('/chat')}
                   >
                     <span className="flex items-center gap-2">
                       <MessageCircle className="w-4 h-4" />
                       Hablar con Isabella
                     </span>
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </Button>
                 </CardContent>
               </Card>
 
               {/* Trust Level */}
               <Card className="glass border-primary/20 mt-6">
                 <CardHeader>
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <Shield className="w-5 h-5 text-primary" />
                     Nivel de Confianza
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     <div>
                       <div className="flex justify-between text-sm mb-2">
                         <span className="text-muted-foreground">Nivel {profile?.trust_level || 1}</span>
                         <span className="text-primary">{profile?.reputation_score || 0}/100</span>
                       </div>
                       <Progress value={profile?.reputation_score || 0} className="h-2" />
                     </div>
                     <p className="text-xs text-muted-foreground">
                       Completa misiones y participa en la comunidad para subir tu nivel de confianza.
                     </p>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
 
             {/* Active Missions */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="lg:col-span-2"
             >
               <Card className="glass border-primary/20 h-full">
                 <CardHeader>
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <Trophy className="w-5 h-5 text-gold" />
                     Misiones Activas
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   {loadingMissions ? (
                     <div className="flex items-center justify-center py-8">
                       <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                     </div>
                   ) : missions.length === 0 ? (
                     <div className="text-center py-8">
                       <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                       <p className="text-muted-foreground">No hay misiones activas</p>
                       <Button variant="outline" className="mt-4">
                         Explorar Misiones
                       </Button>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {missions.map((mission) => (
                         <div 
                           key={mission.id}
                           className="p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors"
                         >
                           <div className="flex items-start justify-between">
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                   {mission.mission_type}
                                 </span>
                                 {(mission.progress || 0) >= 100 && (
                                   <CheckCircle2 className="w-4 h-4 text-green-400" />
                                 )}
                               </div>
                               <h4 className="font-medium">{mission.title}</h4>
                               <p className="text-sm text-muted-foreground">{mission.description}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-sm font-medium text-gold">+{mission.tau_reward} TAU</p>
                               <p className="text-xs text-muted-foreground">+{mission.xp_reward} XP</p>
                             </div>
                           </div>
                           <div className="mt-3">
                             <div className="flex justify-between text-xs mb-1">
                               <span>Progreso</span>
                               <span>{mission.progress || 0}%</span>
                             </div>
                             <Progress value={mission.progress || 0} className="h-1.5" />
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </CardContent>
               </Card>
             </motion.div>
           </div>
         </div>
       </main>
     </div>
   );
 }