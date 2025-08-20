// src/pages/Heroes.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel,
  IonImg, IonButtons, IonButton, IonToast, IonBadge, IonChip, IonGrid, IonRow, IonCol, IonSpinner
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { searchHeroesByName } from '../services/superhero';
import { addFavorite, FavoriteHero } from '../services/favorites';

const Heroes: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const doSearch = async (q: string) => {
    const query = q.trim();
    if (query.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { results, error } = await searchHeroesByName(query);
      if (error) setError(error);
      setResults(results);
    } catch (e: any) {
      setError(e?.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async (ev: CustomEvent) => {
    const value = (ev.detail as any).value as string;
    await doSearch(value ?? '');
  };

  useEffect(() => {
    // Búsqueda inicial para visualizar tarjetas; puedes cambiar "batman" por otro término
    doSearch('batman');
  }, []);

  const addToFav = async (h: any) => {
    const fav: FavoriteHero = {
      id: h.id, name: h.name,
      publisher: h.biography?.publisher,
      alignment: h.biography?.alignment,
      img: h.image?.url,
      note: '', category: 'general', pinned: false,
    };
    await addFavorite(fav);
    setToast(`Added ${h.name} to favorites`);
  };

  const showEmpty = !loading && !error && results.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SuperHeroes (API)</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar debounce={400} placeholder="Search Batman, Hulk..." onIonInput={onSearch} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p className="ion-text-center">Results: {results.length}</p>
        {loading && <div className="ion-text-center"><IonSpinner /></div>}
        {error && <p className="ion-text-center">Error: {error}</p>}
        {showEmpty && <p className="ion-text-center">No results</p>}

        <IonList inset>
          {results.map(h => (
            <IonItem key={h.id}>
              {h.image?.url && <IonImg slot="start" src={h.image.url} style={{ width: 56, height: 56, objectFit: 'cover' }} />}
              <IonLabel>
                <h2>{h.name} {h.biography?.alignment && <IonChip color="medium" className="ion-margin-start">{h.biography.alignment}</IonChip>}</h2>
                <p>{h.biography?.publisher} · <strong>INT</strong> {h.powerstats?.intelligence} · <strong>STR</strong> {h.powerstats?.strength}</p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton onClick={() => addToFav(h)}>
                  <IonIcon icon={add} slot="start" />
                  Favorite
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>

        {/* Grid opcional de tarjetas rápidas */}
        {results.length > 0 && (
          <IonGrid className="ion-padding-top">
            <IonRow>
              {results.slice(0, 6).map(h => (
                <IonCol size="6" key={`grid-${h.id}`}>
                  <div className="ion-text-center">
                    {h.image?.url && <IonImg src={h.image.url} />}
                    <div className="ion-padding-top">
                      <IonBadge color="primary">{h.name}</IonBadge>
                    </div>
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        <IonToast isOpen={!!toast} message={toast ?? ''} onDidDismiss={() => setToast(null)} duration={1200} />
      </IonContent>
    </IonPage>
  );
};

export default Heroes;