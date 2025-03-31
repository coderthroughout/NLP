// src/components/Input/VoiceInput.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VoiceInput = ({ onProcessed, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setAudioChunks([]);
    } catch (err) {
      onError('Microphone access denied: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      audioStream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await axios.post('/api/v1/cad/generate', {
        design_type: '3D_MODEL',
        specifications: {
          dimensions: {
            height: 100,
            width: 50,
            length: 75
          },
          material: 'aluminum',
          specifications: {
            tolerance: '0.1mm'
          }
        },
        research_results: ['voice input processing']
      });

      onProcessed(response.data);
    } catch (err) {
      onError('Voice processing failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voice-input">
      <div className="recording-controls">
        <button
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          Processing voice input...
        </div>
      )}

      <div className="voice-guidelines">
        <h4>Voice Input Guidelines:</h4>
        <ul>
          <li>Speak clearly and at a normal pace</li>
          <li>Include specific measurements when possible</li>
          <li>Mention material preferences</li>
          <li>State any special requirements</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceInput;