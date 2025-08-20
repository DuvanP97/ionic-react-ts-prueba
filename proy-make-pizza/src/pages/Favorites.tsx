import React, { useEffect, useMemo, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonImg,
  IonButtons, IonButton, IonToast, IonAlert, IonSearchbar, IonSegment, IonSegmentButton,
  IonFab, IonFabButton, IonIcon, IonChip
} from '@ionic/react';
import { add, create, trash } from 'ionicons/icons';
import { FavoriteHero, listFavorites, removeFavorite, updateFavorite } from '../services/favorites';
import FavoriteFormModal from '../components/FavoriteFormModal';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteHero[]>([]);
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<'all' | 'pinned'>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editHero, setEditHero] = useState<FavoriteHero | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { (async () => setFavorites(await listFavorites()))(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return favorites.filter(h => {
      const matchQ = !q || h.name.toLowerCase().includes(q) || (h.publisher ?? '').toLowerCase().includes(q) || (h.category ?? '').toLowerCase().includes(q);
      const matchSeg = segment === 'all' ? true : h.pinned;
      return matchQ && matchSeg;
    });
  }, [favorites, query, segment]);

  const onEdit = (h: FavoriteHero) => { setEditHero(h); setShowModal(true); };
  const onSubmit = async (vals: Omit<FavoriteHero, 'id' | 'name'>) => {
    if (!editHero) return;
    await updateFavorite(editHero.id, vals);
    setFavorites(await listFavorites());
    setToast('Favorite updated');
  };
  const onDelete = async (id: string) => {
    await removeFavorite(id);
    setFavorites(await listFavorites());
    setToast('Favorite deleted');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar placeholder="Search favorites…" onIonInput={e => setQuery((e.detail as any).value)} />
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value as any)}>
            <IonSegmentButton value="all">All</IonSegmentButton>
            <IonSegmentButton value="pinned">Pinned</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList inset>
          {filtered.map(h => (
            <IonItem key={h.id}>
              {h.img && <IonImg slot="start" src={h.img} style={{ width: 56, height: 56, objectFit: 'cover' }} />}
              <IonLabel>
                <h2>
                  {h.name}
                  {h.pinned && <IonChip color="success" className="ion-margin-start">Pinned</IonChip>}
                </h2>
                <p>{h.publisher} · <strong>{h.category}</strong> · {h.alignment}</p>
                {h.note && <p>{h.note}</p>}
              </IonLabel>
              <IonButtons slot="end">
                <IonButton onClick={() => onEdit(h)}>
                  <IonIcon icon={create} slot="start" /> Edit
                </IonButton>
                <IonButton color="danger" onClick={() => setConfirmDeleteId(h.id)}>
                  <IonIcon icon={trash} slot="start" /> Delete
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>

        {/* FAB para crear favorito manual (ejemplo rápido) */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => {
            // ejemplo: crea un placeholder rápido (puedes cambiarlo)
            setEditHero({ id: crypto.randomUUID(), name: 'Custom Hero', category: 'custom', pinned: false });
            setShowModal(true);
          }}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <FavoriteFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initial={editHero}
          onSubmit={onSubmit}
        />

        <IonToast isOpen={!!toast} message={toast ?? ''} onDidDismiss={() => setToast(null)} duration={1200} />
        <IonAlert
          isOpen={!!confirmDeleteId}
          header="Remove favorite?"
          message="This action cannot be undone."
          buttons={[
            { text: 'Cancel', role: 'cancel', handler: () => setConfirmDeleteId(null) },
            { text: 'Delete', role: 'destructive', handler: () => { if (confirmDeleteId) onDelete(confirmDeleteId); setConfirmDeleteId(null); } },
          ]}
          onDidDismiss={() => setConfirmDeleteId(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Favorites;