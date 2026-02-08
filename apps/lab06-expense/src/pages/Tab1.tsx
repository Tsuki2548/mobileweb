/* src/pages/Tab1.tsx */
import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonCard, IonCardContent,
  IonGrid, IonRow, IonCol, IonText, IonNote
} from '@ionic/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  note: string;
}

const Tab1: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
    
    // Realtime Listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];

      setExpenses(data);

      const income = data
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const expense = data
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

      setTotalIncome(income);
      setTotalExpense(expense);
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายการรายรับ-รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonText color="success">
                    <h6>รายรับ</h6>
                    <h2>{totalIncome.toLocaleString()} ฿</h2>
                  </IonText>
                </IonCol>
                <IonCol className="ion-text-center">
                  <IonText color="danger">
                    <h6>รายจ่าย</h6>
                    <h2>{totalExpense.toLocaleString()} ฿</h2>
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                 <IonCol className="ion-text-center">
                    <IonText>
                        <h6>คงเหลือ</h6>
                        <h1>{(totalIncome - totalExpense).toLocaleString()} ฿</h1>
                    </IonText>
                 </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonList>
          {expenses.map((item) => (
            <IonItem key={item.id} routerLink={`/edit/${item.id}`} button detail>
              <IonLabel>
                <h2>{item.title}</h2>
                <p>{item.category}</p>
              </IonLabel>
              <IonBadge slot="end" color={item.type === 'income' ? 'success' : 'danger'}>
                {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;