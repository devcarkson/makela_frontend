// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// const DevTools: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   if (!import.meta.env.DEV) return null;

//   const currentApiUrl = import.meta.env.VITE_API_BASE_URL;
//   const isLocalApi = currentApiUrl?.includes('localhost');
  
//   const switchToProduction = () => {
//     // This would require a page reload to take effect
//     localStorage.setItem('USE_PROD_API', 'true');
//     window.location.reload();
//   };
  
//   const switchToLocal = () => {
//     localStorage.removeItem('USE_PROD_API');
//     window.location.reload();
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {!isOpen ? (
//         <Button
//           onClick={() => setIsOpen(true)}
//           variant="outline"
//           size="sm"
//           className="bg-background/80 backdrop-blur-sm"
//         >
//           🛠️ Dev
//         </Button>
//       ) : (
//         <Card className="w-80 bg-background/95 backdrop-blur-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm flex items-center justify-between">
//               Development Tools
//               <Button
//                 onClick={() => setIsOpen(false)}
//                 variant="ghost"
//                 size="sm"
//                 className="h-6 w-6 p-0"
//               >
//                 ✕
//               </Button>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div>
//               <p className="text-xs text-muted-foreground mb-1">Current API:</p>
//               <Badge variant={isLocalApi ? "default" : "secondary"} className="text-xs">
//                 {currentApiUrl}
//               </Badge>
//             </div>
            
//             <div className="flex gap-2">
//               <Button
//                 onClick={switchToLocal}
//                 variant={isLocalApi ? "default" : "outline"}
//                 size="sm"
//                 className="flex-1"
//                 disabled={isLocalApi}
//               >
//                 Local API
//               </Button>
//               <Button
//                 onClick={switchToProduction}
//                 variant={!isLocalApi ? "default" : "outline"}
//                 size="sm"
//                 className="flex-1"
//                 disabled={!isLocalApi}
//               >
//                 Prod API
//               </Button>
//             </div>
            
//             <div className="text-xs text-muted-foreground">
//               <p>Switch API endpoints for testing</p>
//               <p className="text-primary">⚠️ Requires page reload</p>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default DevTools;