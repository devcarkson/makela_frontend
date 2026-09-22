// -// src/api/apiClient.ts
// import axios from 'axios';

// const PUBLIC_ENDPOINTS = ['/auth/login/', '/auth/register/', '/products', '/home', '/categories', '/contact'];

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'https://makelacosmetic.uk/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     // Get token from either storage location
//     const token = localStorage.getItem('token') || sessionStorage.getItem('token');

//     try {
//       const fullUrl = new URL(config.url || '', config.baseURL);
//       const path = fullUrl.pathname.replace(/^\/api/, '');

//       const isPublic = PUBLIC_ENDPOINTS.some(endpoint => 
//         path === endpoint || path.startsWith(endpoint)
//       );

//       if (token && !isPublic) {
//         // Use 'Bearer' for JWT authentication
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (e) {
//       console.warn("Could not parse request URL for auth check:", e);
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn('Unauthorized: Invalid or missing token.');
//       // Add logout logic if needed
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;




// // src/App.tsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import ProtectedRoute from "@/components/ProtectedRoute";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import Home from "@/pages/Home";
// import Products from "@/pages/Products";
// import ProductDetail from "@/pages/ProductDetail";
// import Cart from "@/pages/Cart";
// import Checkout from "@/pages/Checkout";
// import PaymentCallback from "@/pages/PaymentCallback";
// import Login from "@/pages/Auth/Login";
// import Signup from "@/pages/Auth/Signup";
// import ForgotPassword from "@/pages/Auth/ForgotPassword";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";
// import Dashboard from "@/pages/Dashboard";
// import Profile from "@/pages/Profile";
// import Addresses from "@/pages/Addresses";
// import Settings from "@/pages/Settings";
// import NotFound from "@/pages/NotFound";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-background flex flex-col overflow-x-hidden w-full">
//       <Header />
//       <main className="flex-1 w-full overflow-x-hidden">
//         <Routes>
//           {/* public */}
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/product/:slug" element={<ProductDetail />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/payment/callback" element={<PaymentCallback />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />

//           {/* protected */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/addresses"
//             element={
//               <ProtectedRoute>
//                 <Addresses />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <Settings />
//               </ProtectedRoute>
//             }
//           />

//           {/* fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }
