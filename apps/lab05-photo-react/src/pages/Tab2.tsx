import React from 'react';
import { camera } from 'ionicons/icons';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg 
} from '@ionic/react';
// IMPORT Hook เข้ามา
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import './Tab2.css';

const Tab2: React.FC = () => {
  // ดึง photos และ takePhoto มาใช้งาน
  const { photos, takePhoto } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
          <IonTitle size="small">Lab 05 - โดย วีระวงศ์ หงษา รหัส 663380235-6</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
            <IonTitle size="small">Lab 05 - โดย วีระวงศ์ หงษา รหัส 663380235-6</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* --- ส่วนแสดงรูปภาพ (Grid) --- */}
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* --- ปุ่มกล้อง --- */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;