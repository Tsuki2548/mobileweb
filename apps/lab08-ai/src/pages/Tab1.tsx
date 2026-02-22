import React, { useState, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
  IonSpinner,
} from '@ionic/react';
import { PhotoService } from '../core/photo.service';
import { GeminiVisionService } from '../core/gemini.service';
import type { Base64Image, ImageAnalysisResult } from '../core/ai.interface';

const Lab08: React.FC = () => {
  // State definitions
  const [img, setImg] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64Img = await PhotoService.fromFile(file);
      setImg(base64Img);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const onTakePhoto = async () => {
    setLoading(true);
    try {
      const b64 = await PhotoService.fromCamera();
      setImg(b64);
      setPreviewUrl(`data:${b64.mimeType};base64,${b64.base64}`);
      setResult(null);
    } catch (error) {
      console.error("Camera error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onAnalyze = async () => {
    if (!img) return;
    setLoading(true);
    try {
      const analysisResult = await GeminiVisionService.analyze(img);
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lab08: Gemini Vision โดย วีระวงศ์ หงษา</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onFileChange}
          style={{ display: 'none' }}
        />

        {/* Buttons */}
        <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
          เลือกไฟล์ภาพ
        </IonButton>
        <IonButton expand="block" onClick={onTakePhoto}>
          ถ่ายภาพ (Camera)
        </IonButton>

        {/* Image Preview */}
        {previewUrl && <IonImg src={previewUrl} />}

        {/* Analyze Button */}
        <IonButton
          expand="block"
          disabled={!img || loading}
          onClick={onAnalyze}
        >
          วิเคราะห์ภาพ
        </IonButton>

        {/* Loading Spinner */}
        {loading && <IonSpinner />}

        {/* Result Output */}
        {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Lab08;