# Système de notifications AutoSoft

Ce système permet d'afficher des notifications à l'utilisateur et de les enregistrer automatiquement dans la base de données.

## Structure de la table `notifications`

```sql
CREATE TABLE notifications (
  code_notif SERIAL PRIMARY KEY,
  type_notif VARCHAR(50),
  message_notif TEXT,
  date_notif TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_destinataire INTEGER,
  lu BOOLEAN DEFAULT FALSE,
  priorite VARCHAR(10),
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);
```

## Composants et services

- `NotificationContainer.tsx` : Conteneur pour afficher les notifications
- `Notification.tsx` : Composant pour afficher une notification individuelle
- `notificationService.ts` : Service pour interagir avec la base de données
- `useNotifications.ts` : Hook personnalisé pour gérer les notifications

## Exemples d'utilisation

### Utilisation du hook `useNotifications`

```tsx
import React from 'react';
import useNotifications from '@/hooks/useNotifications';
import { NotificationContainer } from '@/components/notification/NotificationContainer';

export default function MaPage() {
  // Récupérer l'ID de l'utilisateur connecté (exemple)
  const userId = 123;
  
  // Utiliser le hook de notifications
  const { 
    notifications, 
    addNotification, 
    removeNotification 
  } = useNotifications({
    userId: userId,
    // bureauId et ecoleId sont récupérés automatiquement depuis localStorage
  });
  
  // Fonction pour ajouter une notification de succès
  const handleSuccess = () => {
    addNotification('success', 'Opération réussie !', 5000);
  };
  
  // Fonction pour ajouter une notification d'erreur
  const handleError = () => {
    addNotification('error', 'Une erreur est survenue.', 8000);
  };
  
  return (
    <div>
      <h1>Ma page</h1>
      
      <button onClick={handleSuccess}>Tester notification succès</button>
      <button onClick={handleError}>Tester notification erreur</button>
      
      {/* Afficher le conteneur de notifications */}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
        userId={userId}
        // Pas besoin de spécifier bureauId et ecoleId car ils sont déjà gérés par le service
      />
    </div>
  );
}
```

### Utilisation dans un contexte global

Pour une utilisation à l'échelle de l'application, vous pouvez créer un contexte de notifications :

```tsx
// NotificationContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useNotifications from '@/hooks/useNotifications';
import { NotificationContainer } from '@/components/notification/NotificationContainer';

// Créer le contexte
const NotificationContext = createContext<ReturnType<typeof useNotifications> | undefined>(undefined);

// Provider du contexte
export function NotificationProvider({ children, userId }: { children: ReactNode, userId?: number }) {
  const notificationMethods = useNotifications({ userId });
  
  return (
    <NotificationContext.Provider value={notificationMethods}>
      {children}
      <NotificationContainer
        notifications={notificationMethods.notifications}
        removeNotification={notificationMethods.removeNotification}
        userId={userId}
      />
    </NotificationContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
}
```

Puis dans votre layout principal :

```tsx
// layout.tsx
import { NotificationProvider } from '@/components/notification/NotificationContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Récupérer l'ID de l'utilisateur connecté (exemple)
  const userId = 123;
  
  return (
    <html lang="fr">
      <body>
        <NotificationProvider userId={userId}>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

Et dans n'importe quel composant :

```tsx
import { useNotificationContext } from '@/components/notification/NotificationContext';

export default function MonComposant() {
  const { addNotification } = useNotificationContext();
  
  const handleClick = () => {
    addNotification('success', 'Action réussie !');
  };
  
  return (
    <button onClick={handleClick}>Cliquez-moi</button>
  );
}
```

## Types de notifications

- `success` : Notification de succès (vert)
- `error` : Notification d'erreur (rouge)
- `warning` : Notification d'avertissement (jaune)
- `info` : Notification d'information (bleu)
