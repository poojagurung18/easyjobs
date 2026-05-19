"use client";

import { Toaster } from"react-hot-toast";

export default function ToastProvider() {
 return (
 <Toaster
 position="top-right"
 reverseOrder={false}
 toastOptions={{
 // Default options for all toasts
 duration: 4000,
 style: {
 background:"#333",
 color:"#fff",
 },
 // Customize specific types
 success: {
 duration: 3000,
 theme: {
 primary:"#4aed88",
 },
 },
 error: {
 duration: 5000,
 },
 }}
 />
 );
}
