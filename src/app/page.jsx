// src/app/page.jsx
'use client'
import AudioTranscription from '@/components/AudioTranscription'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Transcrição de Áudio
        </h1>
        <AudioTranscription />
      </div>
    </main>
  )
}
