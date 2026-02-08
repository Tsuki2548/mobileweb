import React, { useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonInput, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, IonTextarea, IonList
} from '@ionic/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useHistory } from 'react-router-dom';

const Tab2: React.FC = () => {
  const history = useHistory();
  
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<number | undefined>();
  const [type, setType] = useState<string>('expense');
  const [category, setCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const saveExpense = async () => {
    try {
      await addDoc(collection(db, "expenses"), {
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        note: note,
        createdAt: new Date()
      });

      console.log("Document written successfully");
      
      setTitle('');
      setAmount(undefined);
      
      history.push('/tab1');
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>เพิ่มรายการรายรับ-รายจ่าย</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput 
              label="ชื่อรายการ" 
              labelPlacement="floating"
              value={title} 
              onIonInput={e => setTitle(e.detail.value!)} 
            />
          </IonItem>

          <IonItem>
            <IonInput 
              label="จำนวนเงิน" 
              labelPlacement="floating"
              type="number" 
              value={amount} 
              onIonInput={e => setAmount(parseFloat(e.detail.value!))} 
            />
          </IonItem>

          <IonItem>
            <IonSelect 
              label="ประเภท" 
              labelPlacement="floating"
              value={type} 
              onIonChange={e => setType(e.detail.value)}
            >
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput 
              label="หมวดหมู่" 
              labelPlacement="floating"
              value={category} 
              onIonInput={e => setCategory(e.detail.value!)} 
            />
          </IonItem>

          <IonItem>
            <IonTextarea 
              label="หมายเหตุ" 
              labelPlacement="floating"
              value={note} 
              onIonInput={e => setNote(e.detail.value!)} 
            />
          </IonItem>

          <IonButton expand="block" className="ion-margin-top" onClick={saveExpense}>
            บันทึกข้อมูล
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;