// src/components/AudioTranscription/index.jsx
'use client'

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Mic } from 'lucide-react';

const AudioTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Erro ao acessar o microfone. Verifique as permissões.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      setError('Por favor, grave um áudio primeiro');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'pt-BR';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
        setIsLoading(false);
      };

      recognition.onerror = (event) => {
        setError('Erro na transcrição. Tente novamente.');
        setIsLoading(false);
      };

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      recognition.start();

    } catch (err) {
      setError('Ocorreu um erro durante a transcrição. Tente novamente.');
      console.error('Erro:', err);
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Transcrição de Áudio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'} mb-2`} />
            
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`mt-4 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
            </Button>

            {audioBlob && (
              <p className="mt-2 text-sm text-gray-500">
                Áudio gravado! Pronto para transcrição.
              </p>
            )}
          </div>

          <Button
            onClick={transcribeAudio}
            disabled={!audioBlob || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transcrevendo...
              </>
            ) : (
              'Transcrever Áudio'
            )}
          </Button>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          {transcription && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Transcrição:</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                {transcription}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioTranscription;
