// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//   server: {
//     proxy: {
//       '/api-proxy': {
//         target: 'https://fifa-prediction-backend.onrender.com/api',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api-proxy/, '')
//       }
//     }
//   }
// })





import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // Allow access from other devices on the network
    port: 5173,      // Optional
    proxy: {
      '/api-proxy': {
        target: 'https://fifa-prediction-backend.onrender.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, '')
      }
    }
  }
})
