import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { playCircle, stopCircle, fitness, trophy, timer } from "ionicons/icons";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

export const HomePage: React.FC = () => {
  const [state, setState] = useState<WorkoutState | null>(null);

  const engine = useMemo(() => new ArmWorkoutEngine(), []);
  const motion = useMemo(() => new MotionService(), []);
  const tts = useMemo(() => new TtsService(), []);
  const haptic = useMemo(() => new HapticsService(), []);

  useEffect(() => { engine.onChange(setState); }, [engine]);

  const start = async () => {
    await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
    engine.start();
    await motion.start((s) => engine.process(s));
  };

  const stop = async () => {
    await motion.stop();
    engine.stop();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <IonIcon icon={fitness} style={{ marginRight: "8px" }} />
            กายบริหารแขน
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* การแสดงจำนวนครั้ง */}
        <IonCard color="light" style={{ textAlign: "center", marginBottom: "20px" }}>
          <IonCardContent>
            <div style={{ fontSize: "80px", fontWeight: "bold", color: "#3880ff" }}>
              {state?.repDisplay ?? 0}
            </div>
            <div style={{ fontSize: "18px", color: "#666" }}>ครั้ง</div>
          </IonCardContent>
        </IonCard>

        {/* สถิติและข้อมูล */}
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard style={{ textAlign: "center", margin: "0" }}>
                <IonCardContent>
                  <IonIcon icon={trophy} style={{ fontSize: "32px", color: "#ffc409" }} />
                  <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                    {state?.stats.score ?? 0}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>คะแนน</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ textAlign: "center", margin: "0" }}>
                <IonCardContent>
                  <IonIcon icon={timer} style={{ fontSize: "32px", color: "#2dd36f" }} />
                  <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                    {state?.stats.avgRepMs ? (state.stats.avgRepMs / 1000).toFixed(1) : "0.0"}s
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>ความเร็วเฉลี่ย</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* ข้อความสถานะ */}
        {state?.stats.lastMessage && (
          <IonCard color={state.stats.lastMessage === "OK" ? "success" : "warning"}>
            <IonCardContent style={{ textAlign: "center", fontSize: "18px", fontWeight: "500" }}>
              {state.stats.lastMessage}
            </IonCardContent>
          </IonCard>
        )}

        {/* สรุปผลลัพธ์ */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#2dd36f" }}>
                  {state?.stats.repsOk ?? 0}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>ถูกต้อง</div>
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#eb445a" }}>
                  {state?.stats.repsBad ?? 0}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>ไม่ถูกต้อง</div>
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#3880ff" }}>
                  {state?.stats.repsTotal ?? 0}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>ทั้งหมด</div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* ปุ่มควบคุม */}
        <div style={{ marginTop: "30px" }}>
          <IonButton
            expand="block"
            size="large"
            color="success"
            onClick={start}
            disabled={state?.status === "RUNNING"}
          >
            <IonIcon slot="start" icon={playCircle} />
            เริ่มออกกำลังกาย
          </IonButton>
          <IonButton
            expand="block"
            size="large"
            color="danger"
            onClick={stop}
            disabled={state?.status !== "RUNNING"}
            style={{ marginTop: "10px" }}
          >
            <IonIcon slot="start" icon={stopCircle} />
            หยุด
          </IonButton>
        </div>

        {state?.status === "RUNNING" && (
          <IonBadge
            color="success"
            style={{
              position: "fixed",
              top: "70px",
              right: "16px",
              fontSize: "12px",
              padding: "8px 12px",
            }}
          >
            กำลังทำงาน...
          </IonBadge>
        )}
      </IonContent>

      <IonFooter className="ion-padding" style={{ textAlign: "center", fontSize: "12px" }}>
        <strong>663380235-6</strong> นายวีระวงศ์ หงษา
      </IonFooter>
    </IonPage>
  );
};
