# 🤖 Configuration du Chatbot IA

## 📋 Prérequis

1. **Compte Groq (GRATUIT) 🆓**
   - Créer un compte sur https://console.groq.com/
   - Générer une clé API gratuite dans la section "API Keys"
   - Limite gratuite : 14,400 requêtes/jour (très généreux !)

2. **Installation des dépendances**
   ```bash
   npm install openai
   ```
   (Groq utilise la même librairie qu'OpenAI)

## 🔑 Configuration de la clé API

### 1. Ajouter la clé API dans `.env.local`

Créer ou modifier le fichier `.env.local` à la racine du projet :

```env
# Groq API Key (GRATUIT)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Important** : Ne jamais commiter ce fichier dans Git !

### 2. Vérifier que `.env.local` est dans `.gitignore`

```gitignore
# .gitignore
.env.local
.env*.local
```

## 🎨 Personnalisation

### Modifier le prompt système

Éditer le fichier `/src/app/api/chat/route.ts` et modifier la constante `SYSTEM_PROMPT` :

```typescript
const SYSTEM_PROMPT = `
Tu es un assistant virtuel pour Autosoft...
[Ajouter ici toutes les informations spécifiques]
`;
```

### Informations à ajouter au prompt

- ✅ Fonctionnalités détaillées de l'application
- ✅ Processus métier spécifiques
- ✅ Questions fréquentes (FAQ)
- ✅ Guides d'utilisation
- ✅ Contacts support
- ✅ Raccourcis clavier
- ✅ Bonnes pratiques

### Modifier l'apparence

Éditer `/src/components/ChatWidget/ChatWidget.tsx` :

```typescript
// Couleurs
className="bg-blue-600" // Changer la couleur principale

// Taille de la fenêtre
className="w-96 h-[600px]" // Ajuster les dimensions

// Position
className="bottom-6 right-6" // Changer la position
```

## 🚀 Utilisation

### Démarrer le serveur

```bash
npm run dev
```

Le chatbot apparaîtra automatiquement en bas à droite pour les utilisateurs avec le rôle "directeur".

### Tester le chatbot

1. Se connecter en tant que directeur
2. Cliquer sur le bouton rond bleu en bas à droite
3. Poser une question sur l'application

## 📊 Modèles disponibles

Dans `/src/app/api/chat/route.ts`, vous pouvez changer le modèle Groq :

```typescript
model: 'llama-3.1-70b-versatile',  // Recommandé (très performant)
// model: 'llama-3.1-8b-instant',  // Plus rapide
// model: 'mixtral-8x7b-32768',    // Bon pour les longs contextes
// model: 'gemma2-9b-it',          // Léger et rapide
```

## 💰 Coûts

**Groq est 100% GRATUIT ! 🎉**
- Limite : 14,400 requêtes/jour
- Pas de carte bancaire requise
- Réponses ultra-rapides (<1 seconde)
- Parfait pour un chatbot d'assistance

## 🔒 Sécurité

### Limiter l'accès

Le chatbot est actuellement disponible uniquement pour le rôle "directeur".

Pour l'ajouter à d'autres rôles, modifier les layouts correspondants :

```typescript
// /src/app/(protected)/moniteur/layout.tsx
import ChatWidget from '@/components/ChatWidget/ChatWidget';

export default function MoniteurLayout({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

### Rate Limiting (recommandé)

Ajouter une limitation du nombre de requêtes par utilisateur pour éviter les abus.

## 📝 Logs et monitoring

Les erreurs sont loggées dans la console :

```typescript
console.error('Erreur API Chat:', error);
```

Pour un monitoring en production, intégrer un service comme :
- Sentry
- LogRocket
- DataDog

## 🎯 Améliorations futures

- [ ] Historique des conversations persistant
- [ ] Suggestions de questions
- [ ] Recherche dans la documentation
- [ ] Support multilingue
- [ ] Analyse des questions fréquentes
- [ ] Feedback utilisateur (👍/👎)
- [ ] Export des conversations
- [ ] Mode vocal

## 🐛 Dépannage

### Le chatbot ne s'affiche pas
- Vérifier que vous êtes connecté en tant que directeur
- Vérifier la console pour les erreurs

### Erreur "Clé API invalide"
- Vérifier que `OPENAI_API_KEY` est bien configurée dans `.env.local`
- Redémarrer le serveur après modification du `.env.local`

### Réponses lentes
- Utiliser `gpt-4-turbo` au lieu de `gpt-4`
- Réduire `max_tokens` dans l'API route

### Erreur 429 (Rate limit)
- Vous avez atteint la limite de requêtes OpenAI
- Attendre quelques minutes ou upgrader votre plan OpenAI

## 📞 Support

Pour toute question, contacter l'équipe de développement.
