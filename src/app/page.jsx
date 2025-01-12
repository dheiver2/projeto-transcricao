// src/app/page.jsx
// Esta é a página inicial (rota /) do seu aplicativo
'use client' // Necessário para usar hooks e interatividade

import AudioTranscription from '../components/AudioTranscription'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Transcrição de Áudio
      </h1>
      <AudioTranscription />
    </main>
  )
}
