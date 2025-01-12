// src/app/layout.jsx
// Este é o layout raiz que envolve todas as páginas
export const metadata = {
  title: 'App de Transcrição',
  description: 'Transcreva áudio para texto facilmente',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        {/* children são as páginas que serão renderizadas aqui */}
        {children}
      </body>
    </html>
  )
}
