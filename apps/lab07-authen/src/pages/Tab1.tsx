import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonAvatar, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonSpinner 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { authService } from '../auth/auth-service';
import { AuthUser } from '../auth/auth-interface';

const Tab1: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true; // ป้องกัน Error ตอนเปลี่ยนหน้าหนี

    const fetchUser = async () => {
      // ทำระบบดึงข้อมูลซ้ำสูงสุด 5 รอบ (รอบละ 0.5 วินาที)
      for (let i = 0; i < 5; i++) {
        try {
          const currentUser = await authService.getCurrentUser();
          
          if (currentUser) {
            console.log("เจอข้อมูล User แล้วในรอบที่", i + 1, currentUser);
            if (isMounted) {
              setUser(currentUser);
              setIsLoading(false);
            }
            return; // เจอข้อมูลแล้ว หยุดลูปทันที!
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }
        
        console.log("ยังไม่พบข้อมูล รอแป๊บนึง...");
        // หน่วงเวลา 500ms ก่อนถาม Firebase ใหม่
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // ถ้าครบ 5 รอบ (2.5 วินาที) แล้วยังไม่ได้ข้อมูล แสดงว่าไม่ได้ล็อกอินจริงๆ
      if (isMounted) {
        console.log("ดึงข้อมูลไม่สำเร็จ หรือไม่ได้ล็อกอิน");
        setIsLoading(false);
      }
    };

    fetchUser();

    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonSpinner name="bubbles" color="primary" />
            <p>กำลังดึงข้อมูลจาก Firebase...</p>
          </div>
        ) : user ? (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center' }}>
              <IonAvatar style={{ margin: '0 auto', width: '100px', height: '100px', marginBottom: '15px' }}>
                <img 
                  src={user.photoUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                  alt="Profile" 
                />
              </IonAvatar>
              
              <h2>{user.displayName || 'ผู้ใช้ (ไม่ได้ตั้งชื่อ)'}</h2>
              
              <IonItem lines="none">
                <IonLabel>
                  <h3>Email</h3>
                  <p>{user.email || 'ไม่มีอีเมล'}</p>
                </IonLabel>
              </IonItem>

              <IonItem lines="none">
                <IonLabel>
                  <h3>Phone</h3>
                  <p>{user.phoneNumber || 'ไม่มีเบอร์โทรศัพท์'}</p>
                </IonLabel>
              </IonItem>

              <IonItem lines="none">
                <IonLabel>
                  <h3>UID (รหัสอ้างอิง)</h3>
                  <p style={{ fontSize: '0.8rem', color: 'gray' }}>{user.uid}</p>
                </IonLabel>
              </IonItem>

              <IonButton expand="block" color="danger" className="ion-margin-top" onClick={handleLogout}>
                ออกจากระบบ (Logout)
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>ไม่พบข้อมูลผู้ใช้ หรือเซสชันหมดอายุ</p>
            <IonButton onClick={() => history.push('/login')}>กลับไปหน้า Login</IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;