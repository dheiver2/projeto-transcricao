// src/app/page.jsx
'use client'

import AudioTranscription from '@/components/AudioTranscription'
import { Github, Headphones, MessageSquare, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-blue-600">AudioScript</span>
            </div>
            <a
              href="https://github.com/seu-usuario/audio-transcription"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transcrição de Áudio Inteligente
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Transforme seu áudio em texto com precisão. Grave diretamente ou faça upload de um arquivo.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white/60 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Rápido e Preciso</h3>
                <p className="text-gray-600 text-sm">
                  Transcrição em segundos com alta precisão
                </p>
              </div>

              <div className="p-6 bg-white/60 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Suporte a Múltiplos Formatos</h3>
                <p className="text-gray-600 text-sm">
                  Compatível com MP3, WAV e mais
                </p>
              </div>

              <div className="p-6 bg-white/60 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multilíngue</h3>
                <p className="text-gray-600 text-sm">
                  Suporte para diversos idiomas
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Component */}
          <AudioTranscription />

          {/* Testimonials or Use Cases */}
          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Como Você Pode Usar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Reuniões e Entrevistas</h3>
                <p className="text-gray-600">
                  Transforme gravações de reuniões e entrevistas em texto para fácil referência.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Notas e Lembretes</h3>
                <p className="text-gray-600">
                  Grave suas notas de voz e converta-as em texto instantaneamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} AudioScript. Todos os direitos reservados.</p>
            <p className="mt-2">
              Feito com ❤️ usando Next.js e Inteligência Artificial
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
