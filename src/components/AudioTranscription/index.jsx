// src/components/AudioTranscription/index.jsx
'use client'
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Mic, Volume2, StopCircle, RefreshCw, Download } from 'lucide-react';

const AudioTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();
      setError('');
    } catch (err) {
      setError('Erro ao acessar o microfone. Verifique as permissões.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Arquivo muito grande. Por favor, use um arquivo menor que 10MB.');
        return;
      }
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      setError('Por favor, grave ou faça upload de um áudio primeiro');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Criar FormData com o arquivo de áudio
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('model', 'openai/whisper-large-v3');

      // Chamada para API do Hugging Face
      const response = await fetch(
        'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
        {
          method: 'POST',
          body: audioBlob,
          headers: {
            'Content-Type': 'audio/wav',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro na transcrição');
      }

      const result = await response.json();
      setTranscription(result.text);
    } catch (err) {
      setError('Ocorreu um erro durante a transcrição. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTranscription = () => {
    if (!transcription) return;
    
    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcricao.txt';
    a.click();
  };

  const resetAll = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setTranscription('');
    setError('');
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white">
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Transcrição de Áudio para Texto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Área de Upload/Gravação */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              {/* Ícones e Controles de Gravação */}
              <div className="flex items-center space-x-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "secondary"}
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  {isRecording ? (
                    <>
                      <StopCircle className="w-5 h-5" />
                      <span>Parar ({formatTime(recordingTime)})</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Gravar</span>
                    </>
                  )}
                </Button>

                <span className="text-gray-400">ou</span>

                <div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button variant="outline" size="lg" className="flex items-center space-x-2" asChild>
                      <span>
                        <Upload className="w-5 h-5" />
                        <span>Upload</span>
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Preview do Áudio */}
              {audioUrl && (
                <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm">
                  <audio src={audioUrl} controls className="w-full" />
                </div>
              )}
            </div>
          </div>

          {/* Controles de Ação */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={transcribeAudio}
              disabled={!audioBlob || isLoading}
              size="lg"
              className="flex-1 max-w-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Transcrevendo...
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-5 w-5" />
                  Transcrever
                </>
              )}
            </Button>

            {audioBlob && (
              <Button
                onClick={resetAll}
                variant="outline"
                size="lg"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Recomeçar</span>
              </Button>
            )}
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Resultado da Transcrição */}
          {transcription && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Transcrição:
                </h3>
                <Button
                  onClick={downloadTranscription}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar</span>
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border text-gray-700 whitespace-pre-wrap">
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
