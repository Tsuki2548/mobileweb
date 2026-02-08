import React, { useEffect, useState } from 'react';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, 
  IonInput, IonItem, IonPage, IonSelect, IonSelectOption, 
  IonTextarea, IonTitle, IonToolbar, IonList, useIonAlert, IonLoading
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "expenses", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setAmount(data.amount);
        setType(data.type);
        setCategory(data.category);
        setNote(data.note);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, {
        title,
        amount: Number(amount),
        type,
        category,
        note
      });
      history.goBack();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const confirmDelete = () => {
    presentAlert({
      header: 'ยืนยันการลบ',
      message: 'คุณแน่ใจหรือไม่ที่จะลบรายการนี้? ข้อมูลจะหายไปถาวร',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
        },
        {
          text: 'ลบข้อมูล',
          role: 'confirm',
          handler: handleDelete,
        },
      ],
    });
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await deleteDoc(docRef);
      history.goBack();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  if (loading) return <IonLoading isOpen={true} />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>แก้ไขรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput 
              label="ชื่อรายการ" labelPlacement="floating"
              value={title} onIonInput={e => setTitle(e.detail.value!)} 
            />
          </IonItem>
          <IonItem>
            <IonInput 
              label="จำนวนเงิน" type="number" labelPlacement="floating"
              value={amount} onIonInput={e => setAmount(e.detail.value!)} 
            />
          </IonItem>
          <IonItem>
            <IonSelect 
              label="ประเภท" labelPlacement="floating"
              value={type} onIonChange={e => setType(e.detail.value)}
            >
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput 
              label="หมวดหมู่" labelPlacement="floating"
              value={category} onIonInput={e => setCategory(e.detail.value!)} 
            />
          </IonItem>
          <IonItem>
            <IonTextarea 
              label="หมายเหตุ" labelPlacement="floating"
              value={note} onIonInput={e => setNote(e.detail.value!)} 
            />
          </IonItem>

          <div className="ion-margin-top">
            <IonButton expand="block" onClick={handleUpdate}>
              บันทึกการแก้ไข
            </IonButton>
                                        
            <IonButton expand="block" color="danger" className="ion-margin-top" onClick={confirmDelete}>
              ลบข้อมูล
            </IonButton>
          </div>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EditExpense;