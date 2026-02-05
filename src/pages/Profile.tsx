 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { Navigation } from '@/components/layout/Navigation';
 import { AvatarCustomizer } from '@/components/avatar/AvatarCustomizer';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { 
   User, 
   Shield,
   Trophy,
   Globe,
   Clock,
   Edit3,
   Save,
   Loader2,
   CheckCircle,
   Star
 } from 'lucide-react';
 import { toast } from 'sonner';
 
 export default function Profile() {
   const { user, profile, loading, updateProfile } = useAuth();
   const navigate = useNavigate();
   const [isEditing, setIsEditing] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [formData, setFormData] = useState({
     display_name: '',
     bio: '',
   });
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   useEffect(() => {
     if (profile) {
       setFormData({
         display_name: profile.display_name || '',
         bio: profile.bio || '',
       });
     }
   }, [profile]);
 
   const handleSave = async () => {
     setIsSaving(true);
     const { error } = await updateProfile(formData);
     if (error) {
       toast.error('Error al guardar perfil');
     } else {
       toast.success('Perfil actualizado');
       setIsEditing(false);
     }
     setIsSaving(false);
   };
 
   if (loading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-primary animate-spin" />
       </div>
     );
   }
 
   const verificationBadge = {
     pending: { color: 'text-yellow-400', label: 'Pendiente' },
     verified: { color: 'text-green-400', label: 'Verificado' },
     suspended: { color: 'text-red-400', label: 'Suspendido' },
   };
 
   const status = verificationBadge[profile?.verification_status as keyof typeof verificationBadge] || verificationBadge.pending;
 
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
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 mb-4">
               <User className="w-10 h-10 text-primary" />
             </div>
             <h1 className="font-display text-3xl font-bold mb-2">Mi Perfil</h1>
             <p className="text-muted-foreground">Tu identidad digital soberana en TAMV</p>
           </motion.div>
 
           <div className="grid lg:grid-cols-2 gap-6">
             {/* Profile Info */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
             >
               <Card className="glass border-primary/20">
                 <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <User className="w-5 h-5" />
                     Información
                   </CardTitle>
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                     disabled={isSaving}
                   >
                     {isSaving ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                     ) : isEditing ? (
                       <>
                         <Save className="w-4 h-4 mr-2" />
                         Guardar
                       </>
                     ) : (
                       <>
                         <Edit3 className="w-4 h-4 mr-2" />
                         Editar
                       </>
                     )}
                   </Button>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div>
                     <Label>Nombre de Usuario</Label>
                     {isEditing ? (
                       <Input
                         value={formData.display_name}
                         onChange={(e) => setFormData(f => ({ ...f, display_name: e.target.value }))}
                         className="mt-1"
                       />
                     ) : (
                       <p className="text-lg font-medium mt-1">{profile?.display_name}</p>
                     )}
                   </div>
 
                   <div>
                     <Label>Bio</Label>
                     {isEditing ? (
                       <Textarea
                         value={formData.bio}
                         onChange={(e) => setFormData(f => ({ ...f, bio: e.target.value }))}
                         className="mt-1"
                         rows={3}
                       />
                     ) : (
                       <p className="text-muted-foreground mt-1">{profile?.bio || 'Sin biografía'}</p>
                     )}
                   </div>
 
                   <div>
                     <Label>DID (Identidad Descentralizada)</Label>
                     <p className="text-sm text-muted-foreground mt-1 font-mono break-all">
                       {profile?.did || 'No asignado'}
                     </p>
                   </div>
 
                   <div className="flex items-center gap-2 pt-4 border-t border-border">
                     <CheckCircle className={`w-4 h-4 ${status.color}`} />
                     <span className={`text-sm ${status.color}`}>{status.label}</span>
                   </div>
                 </CardContent>
               </Card>
 
               {/* Stats */}
               <Card className="glass border-primary/20 mt-6">
                 <CardHeader>
                   <CardTitle className="font-display text-lg flex items-center gap-2">
                     <Trophy className="w-5 h-5 text-gold" />
                     Estadísticas
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-lg bg-card/50 text-center">
                       <Trophy className="w-6 h-6 text-gold mx-auto mb-2" />
                       <p className="text-2xl font-display font-bold">{profile?.missions_completed || 0}</p>
                       <p className="text-xs text-muted-foreground">Misiones</p>
                     </div>
                     <div className="p-4 rounded-lg bg-card/50 text-center">
                       <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                       <p className="text-2xl font-display font-bold">{profile?.worlds_visited || 0}</p>
                       <p className="text-xs text-muted-foreground">Mundos XR</p>
                     </div>
                     <div className="p-4 rounded-lg bg-card/50 text-center">
                       <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                       <p className="text-2xl font-display font-bold">{profile?.xr_time_minutes || 0}m</p>
                       <p className="text-xs text-muted-foreground">Tiempo XR</p>
                     </div>
                     <div className="p-4 rounded-lg bg-card/50 text-center">
                       <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                       <p className="text-2xl font-display font-bold">{profile?.reputation_score || 0}</p>
                       <p className="text-xs text-muted-foreground">Reputación</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
 
             {/* Avatar Customizer */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
             >
               <Card className="glass border-primary/20">
                 <CardHeader>
                   <CardTitle className="font-display text-lg">Avatar 3D</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <AvatarCustomizer />
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
                   <div className="flex items-center gap-4">
                     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                       <span className="text-3xl font-display font-bold">{profile?.trust_level || 1}</span>
                     </div>
                     <div>
                       <p className="font-medium">Ciudadano TAMV</p>
                       <p className="text-sm text-muted-foreground">
                         Sube de nivel completando misiones y participando en la comunidad
                       </p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
           </div>
         </div>
       </main>
     </div>
   );
 }