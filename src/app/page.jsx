// src/app/page.jsx
'use client'

import AudioTranscription from '@/components/AudioTranscription'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transcrição de Áudio
          </h1>
          <p className="text-lg text-gray-600">
            Transforme seu áudio em texto facilmente. Grave diretamente ou faça upload de um arquivo.
          </p>
        </div>
        
        <AudioTranscription />
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Usando modelo Whisper da OpenAI através do Hugging Face Inference API</p>
        </footer>
      </div>
    </main>
  )
}
