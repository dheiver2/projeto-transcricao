// src/app/api/transcribe/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de áudio fornecido' },
        { status: 400 }
      );
    }

    // Converte o arquivo para um Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Faz a requisição para a API do Hugging Face
    const response = await fetch(
      'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav',
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      throw new Error('Erro na transcrição');
    }

    const result = await response.json();

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error('Erro na transcrição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a transcrição' },
      { status: 500 }
    );
  }
}
