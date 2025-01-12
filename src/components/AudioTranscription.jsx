// src/components/AudioTranscription.jsx
'use client'

import { useState, useRef } from 'react'

export default function AudioTranscription() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        chunksRef.current = []
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const transcribeAudio = async () => {
    if (!audioBlob) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await fetch('https://api-inference.huggingface.co/models/openai/whisper-large-v3', {
        method: 'POST',
        body: audioBlob,
        headers: {
          'Content-Type': 'audio/wav'
        }
      })

      if (!response.ok) throw new Error('Transcription failed')

      const data = await response.json()
      setTranscription(data.text)
    } catch (err) {
      console.error('Error transcribing:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-lg font-medium ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
          </button>
        </div>

        {audioBlob && (
          <div className="space-y-4">
            <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
            
            <button
              onClick={transcribeAudio}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Transcrevendo...' : 'Transcrever'}
            </button>
          </div>
        )}

        {transcription && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="font-bold mb-2">Transcrição:</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  )
}
