 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { supabase } from '@/integrations/supabase/client';
 import { Navigation } from '@/components/layout/Navigation';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { 
   ShoppingBag, 
   Search,
   Filter,
   Star,
   Loader2,
   Package,
   Sparkles
 } from 'lucide-react';
 
 interface MarketItem {
   id: string;
   name: string;
   description: string | null;
   price: number;
   category: string;
   rarity: string | null;
   image_url: string | null;
   stock: number | null;
 }
 
 export default function Marketplace() {
   const { user, loading } = useAuth();
   const navigate = useNavigate();
   const [items, setItems] = useState<MarketItem[]>([]);
   const [loadingItems, setLoadingItems] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('all');
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   useEffect(() => {
     async function fetchItems() {
       let query = supabase
         .from('marketplace_items')
         .select('*')
         .eq('is_listed', true)
         .order('created_at', { ascending: false });
 
       if (selectedCategory !== 'all') {
         query = query.eq('category', selectedCategory);
       }
 
       const { data } = await query.limit(50);
       setItems(data || []);
       setLoadingItems(false);
     }
 
     fetchItems();
   }, [selectedCategory]);
 
   const categories = [
     { id: 'all', label: 'Todos' },
     { id: 'avatar', label: 'Avatares' },
     { id: 'space', label: 'Espacios XR' },
     { id: 'item', label: 'Items' },
     { id: 'art', label: 'Arte Digital' },
     { id: 'music', label: 'Música' },
   ];
 
   const rarityColors: Record<string, string> = {
     common: 'text-gray-400 bg-gray-400/20',
     rare: 'text-blue-400 bg-blue-400/20',
     epic: 'text-purple-400 bg-purple-400/20',
     legendary: 'text-gold bg-gold/20',
   };
 
   const filteredItems = items.filter(item => 
     item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   if (loading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-primary animate-spin" />
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background">
       <Navigation />
       
       <main className="pt-24 pb-12 px-4">
         <div className="container mx-auto max-w-6xl">
           {/* Header */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center mb-8"
           >
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 mb-4">
               <ShoppingBag className="w-10 h-10 text-primary" />
             </div>
             <h1 className="font-display text-3xl font-bold mb-2">Tianguis TAMV</h1>
             <p className="text-muted-foreground">Mercado digital mesoamericano del futuro</p>
           </motion.div>
 
           {/* Search & Filters */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="mb-8"
           >
             <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input
                   placeholder="Buscar items, avatares, espacios..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10 bg-card/50"
                 />
               </div>
               <div className="flex gap-2 overflow-x-auto pb-2">
                 {categories.map((cat) => (
                   <Button
                     key={cat.id}
                     variant={selectedCategory === cat.id ? "default" : "outline"}
                     size="sm"
                     onClick={() => setSelectedCategory(cat.id)}
                     className="whitespace-nowrap"
                   >
                     {cat.label}
                   </Button>
                 ))}
               </div>
             </div>
           </motion.div>
 
           {/* Items Grid */}
           {loadingItems ? (
             <div className="flex items-center justify-center py-16">
               <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
             </div>
           ) : filteredItems.length === 0 ? (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-16"
             >
               <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
               <h3 className="text-lg font-medium mb-2">No hay items disponibles</h3>
               <p className="text-muted-foreground mb-4">Sé el primero en publicar en el marketplace</p>
               <Button>Publicar Item</Button>
             </motion.div>
           ) : (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
             >
               {filteredItems.map((item, index) => (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05 }}
                 >
                   <Card className="glass border-primary/20 overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
                     <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                       {item.image_url ? (
                         <img 
                           src={item.image_url} 
                           alt={item.name}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center">
                           <Sparkles className="w-12 h-12 text-primary/30" />
                         </div>
                       )}
                       {item.rarity && (
                         <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${rarityColors[item.rarity] || 'text-gray-400 bg-gray-400/20'}`}>
                           {item.rarity}
                         </span>
                       )}
                     </div>
                     <CardContent className="pt-4">
                       <div className="flex items-start justify-between gap-2 mb-2">
                         <h3 className="font-medium line-clamp-1">{item.name}</h3>
                         <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary shrink-0">
                           {item.category}
                         </span>
                       </div>
                       <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                         {item.description || 'Sin descripción'}
                       </p>
                       <div className="flex items-center justify-between">
                         <p className="font-display font-bold text-gold">
                           {item.price.toLocaleString()} TAU
                         </p>
                         <Button size="sm" variant="outline">
                           Comprar
                         </Button>
                       </div>
                       {item.stock !== null && item.stock <= 5 && (
                         <p className="text-xs text-red-400 mt-2">
                           ¡Solo quedan {item.stock}!
                         </p>
                       )}
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </motion.div>
           )}
         </div>
       </main>
     </div>
   );
 }