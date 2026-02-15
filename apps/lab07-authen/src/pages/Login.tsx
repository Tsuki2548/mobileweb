import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, 
  IonIcon, IonText, useIonToast, IonSpinner 
} from '@ionic/react';
import { 
  logoGoogle, callOutline, mailOutline, lockClosedOutline, arrowBackOutline 
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { authService } from '../auth/auth-service'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();

  // สถานะข้อมูล
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  // สถานะการทำงานของหน้าจอ
  const [verificationId, setVerificationId] = useState('');
  const [loginMode, setLoginMode] = useState<'default' | 'phone'>('default');
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันช่วยแสดง Error
  const showError = (msg: string) => {
    presentToast({ message: msg, duration: 3000, color: 'danger', position: 'top' });
  };

  // 1. ล็อกอินด้วย Email
  const handleEmailLogin = async () => {
    if (!email || !password) return showError('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
    setIsLoading(true);
    try {
      await authService.loginWithEmailPassword({ email, password });
      history.push('/tabs/tab1');
    } catch (error: any) {
      showError(error.message || 'รหัสผ่านหรืออีเมลไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. ล็อกอินด้วย Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authService.loginWithGoogle();
      history.push('/tabs/tab1');
    } catch (error: any) {
      showError(error.message || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

  // 3.1 ส่งรหัส OTP ไปที่เบอร์โทร
  const handleSendOtp = async () => {
    if (!phone) return showError('กรุณากรอกเบอร์โทรศัพท์ (เช่น +66891234567)');
    setIsLoading(true);
    try {
      const res = await authService.startPhoneLogin({ phoneNumberE164: phone });
      setVerificationId(res.verificationId);
      presentToast({ message: 'ส่งรหัส OTP เรียบร้อยแล้ว', duration: 2000, color: 'success', position: 'top' });
    } catch (error: any) {
      showError(error.message || 'ไม่สามารถส่ง OTP ได้');
    } finally {
      setIsLoading(false);
    }
  };

  // 3.2 ยืนยันรหัส OTP
  const handleConfirmOtp = async () => {
    if (!otp) return showError('กรุณากรอกรหัส OTP 6 หลัก');
    setIsLoading(true);
    try {
      await authService.confirmPhoneCode({ verificationId, verificationCode: otp });
      history.push('/tabs/tab1');
    } catch (error: any) {
      showError(error.message || 'รหัส OTP ไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          
          {/* Header */}
          <div className="login-header">
            <IonText color="dark">
              <h1 className="fw-bold">{loginMode === 'default' ? 'Welcome Back' : 'Phone Login'}</h1>
              <p>{loginMode === 'default' ? 'Please sign in to continue' : 'Enter your phone number'}</p>
            </IonText>
          </div>

          {/* Form Area */}
          <div className="login-card">
            
            {/* โหมดปกติ: Email & Google */}
            {loginMode === 'default' && (
              <>
                <div className="input-group">
                  <IonItem className="custom-input" lines="none">
                    <IonIcon icon={mailOutline} slot="start" color="medium" />
                    <IonLabel position="floating"></IonLabel>
                    <IonInput 
                      type="email" 
                      value={email} 
                      onIonInput={(e) => setEmail(e.detail.value!)} 
                    />
                  </IonItem>

                  <IonItem className="custom-input" lines="none">
                    <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
                    <IonLabel position="floating"></IonLabel>
                    <IonInput 
                      type="password" 
                      value={password} 
                      onIonInput={(e) => setPassword(e.detail.value!)} 
                    />
                  </IonItem>
                </div>

                <IonButton expand="block" className="main-btn" onClick={handleEmailLogin} disabled={isLoading}>
                  {isLoading ? <IonSpinner name="crescent" /> : 'Login'}
                </IonButton>

                <div className="divider">
                  <span>OR</span>
                </div>

                <IonButton expand="block" fill="outline" className="google-btn" onClick={handleGoogleLogin} disabled={isLoading}>
                  <IonIcon icon={logoGoogle} slot="start" color="danger" />
                  Continue with Google
                </IonButton>

                <IonButton expand="block" fill="clear" className="phone-switch-btn" onClick={() => setLoginMode('phone')} disabled={isLoading}>
                  <IonIcon icon={callOutline} slot="start" />
                  Login with Phone Number
                </IonButton>
              </>
            )}

            {/* โหมดเบอร์โทรศัพท์: OTP */}
            {loginMode === 'phone' && (
              <>
                <div className="input-group">
                  <IonItem className="custom-input" lines="none">
                    <IonIcon icon={callOutline} slot="start" color="medium" />
                    <IonLabel position="floating"></IonLabel>
                    <IonInput 
                      type="tel" 
                      value={phone} 
                      disabled={!!verificationId}
                      onIonInput={(e) => setPhone(e.detail.value!)} 
                    />
                  </IonItem>

                  {verificationId && (
                    <IonItem className="custom-input" lines="none">
                      <IonLabel position="floating">OTP Code</IonLabel>
                      <IonInput 
                        type="number" 
                        value={otp} 
                        onIonInput={(e) => setOtp(e.detail.value!)} 
                      />
                    </IonItem>
                  )}
                </div>

                {!verificationId ? (
                  <IonButton expand="block" className="main-btn" onClick={handleSendOtp} disabled={isLoading}>
                    {isLoading ? <IonSpinner name="crescent" /> : 'Send OTP'}
                  </IonButton>
                ) : (
                  <IonButton expand="block" color="success" className="main-btn" onClick={handleConfirmOtp} disabled={isLoading}>
                    {isLoading ? <IonSpinner name="crescent" /> : 'Confirm OTP'}
                  </IonButton>
                )}

                <IonButton expand="block" fill="clear" color="medium" className="ion-margin-top" onClick={() => {
                  setLoginMode('default');
                  setVerificationId('');
                }} disabled={isLoading}>
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  Back to Email Login
                </IonButton>
              </>
            )}
          </div>

          {/* reCAPTCHA สำคัญมากสำหรับ Web Phone Auth */}
          <div id="recaptcha-container" className="ion-margin-top ion-text-center"></div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;