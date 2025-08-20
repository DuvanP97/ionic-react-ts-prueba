import React, { useEffect, useState } from 'react';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
  IonList, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonToggle
} from '@ionic/react';
import { FavoriteHero } from '../services/favorites';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initial?: FavoriteHero; // si existe, edita
  onSubmit: (values: Omit<FavoriteHero, 'id' | 'name'>) => Promise<void>;
};

const FavoriteFormModal: React.FC<Props> = ({ isOpen, onClose, initial, onSubmit }) => {
  const [publisher, setPublisher] = useState(initial?.publisher ?? '');
  const [alignment, setAlignment] = useState(initial?.alignment ?? 'neutral');
  const [note, setNote] = useState(initial?.note ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'general');
  const [pinned, setPinned] = useState(initial?.pinned ?? false);

  useEffect(() => {
    setPublisher(initial?.publisher ?? '');
    setAlignment(initial?.alignment ?? 'neutral');
    setNote(initial?.note ?? '');
    setCategory(initial?.category ?? 'general');
    setPinned(initial?.pinned ?? false);
  }, [initial, isOpen]);

  const handleSave = async () => {
    await onSubmit({ publisher, alignment, note, category, pinned, img: initial?.img });
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{initial ? 'Edit favorite' : 'New favorite'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
            <IonButton strong onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">Publisher</IonLabel>
            <IonInput value={publisher} onIonChange={e => setPublisher(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Alignment</IonLabel>
            <IonSelect value={alignment} onIonChange={e => setAlignment(e.detail.value)}>
              <IonSelectOption value="good">Good</IonSelectOption>
              <IonSelectOption value="bad">Bad</IonSelectOption>
              <IonSelectOption value="neutral">Neutral</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Category</IonLabel>
            <IonInput value={category} onIonChange={e => setCategory(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Notes</IonLabel>
            <IonTextarea value={note} onIonChange={e => setNote(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel>Pinned</IonLabel>
            <IonToggle checked={pinned} onIonChange={e => setPinned(e.detail.checked)} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default FavoriteFormModal;