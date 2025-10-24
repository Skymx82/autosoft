# 🔔 Notifications à implémenter dans l'espace Directeur

## 📋 Liste complète des notifications à ajouter

### 1. 📅 **PLANNING**
- ✅ Leçon créée → Notifier le moniteur assigné
- ✅ Leçon modifiée → Notifier le moniteur et l'élève
- ✅ Leçon annulée → Notifier le moniteur et l'élève
- ✅ Examen programmé → Notifier le moniteur et l'élève

**Fichier:** `/directeur/planning/components/semaine/selection/ConfirmeSelect.tsx`

---

### 2. 👨‍🎓 **ÉLÈVES**
- ✅ Nouvel élève inscrit → Notifier le directeur et le moniteur assigné
- ✅ Élève modifié → Notifier le moniteur assigné si changement
- ✅ Élève archivé → Notifier le directeur
- ✅ Document uploadé → Notifier le directeur pour validation

**Fichiers:**
- `/directeur/eleves/components/EleveAjout/components/Steps/Step6Recapitulatif.tsx`
- `/directeur/eleves/page.tsx`
- `/directeur/eleves/components/EleveTable.tsx`

---

### 3. 🚗 **VÉHICULES**
- ✅ Nouveau véhicule ajouté → Notifier le directeur
- ✅ Véhicule modifié → Notifier le directeur
- ✅ Entretien prévu dans 7 jours → Notifier le directeur
- ✅ Contrôle technique expiré → Notifier le directeur (priorité haute)
- ✅ Véhicule en panne → Notifier tous les moniteurs

**Fichiers:**
- `/directeur/vehicules/components/AjoutVehicule/page.tsx`
- `/directeur/vehicules/components/DetailVehicule/page.tsx`
- `/directeur/vehicules/page.tsx`

---

### 4. 💰 **COMPTABILITÉ**

#### Recettes
- ✅ Nouvelle recette enregistrée → Notifier le directeur
- ✅ Paiement reçu → Notifier le directeur
- ✅ Recette modifiée → Notifier le directeur

**Fichiers:**
- `/directeur/comptabilite/components/recettes/Recettes.tsx`
- `/directeur/comptabilite/components/recettes/components/DetailRecette/DetailRecette.tsx`

#### Dépenses
- ✅ Nouvelle dépense enregistrée → Notifier le directeur
- ✅ Dépense importante (>500€) → Notifier le directeur (priorité haute)
- ✅ Dépense modifiée → Notifier le directeur

**Fichiers:**
- `/directeur/comptabilite/components/depenses/Depenses.tsx`
- `/directeur/comptabilite/components/depenses/components/DetailDepense/ModifierDepense.tsx`

---

### 5. 👥 **PERSONNEL**
- ✅ Nouveau moniteur créé → Notifier le directeur
- ✅ Moniteur modifié → Notifier le directeur
- ✅ Moniteur supprimé → Notifier le directeur
- ✅ Compte utilisateur créé → Notifier l'utilisateur avec ses identifiants

**Fichiers:**
- `/directeur/mon-auto-ecole/components/User/Personnel.tsx`
- `/directeur/mon-auto-ecole/components/User/components/DetailUser/UserManager.tsx`

---

### 6. 🎓 **EXAMENS** (À créer)
- ⏳ Examen réussi → Notifier le directeur et le moniteur
- ⏳ Examen échoué → Notifier le directeur et le moniteur
- ⏳ Rappel examen J-7 → Notifier l'élève et le moniteur
- ⏳ Rappel examen J-1 → Notifier l'élève et le moniteur

---

### 7. 📄 **DOCUMENTS** (À créer)
- ⏳ Document validé → Notifier l'élève
- ⏳ Document rejeté → Notifier l'élève avec raison
- ⏳ Document manquant → Notifier l'élève

---

## 🎯 Priorités d'implémentation

### **PRIORITÉ 1 - CRITIQUE** ⚠️
1. Planning (leçons créées/annulées)
2. Élèves (inscription)
3. Véhicules (maintenance/contrôle technique)

### **PRIORITÉ 2 - IMPORTANT** 🔶
4. Comptabilité (recettes/dépenses)
5. Personnel (création/modification)

### **PRIORITÉ 3 - NICE TO HAVE** 💡
6. Examens (résultats)
7. Documents (validation/rejet)

---

## 📝 Template de code à utiliser

```typescript
import { createNotification, NotificationTemplates } from '@/lib/notifications';

// Exemple simple
await createNotification({
  type: 'success',
  message: 'Leçon créée avec succès',
  id_destinataire: moniteur_id,
  id_ecole: user.id_ecole,
  id_bureau: user.id_bureau,
  priorite: 'normale'
});

// Avec template
const template = NotificationTemplates.leconCreated('Jean Dupont');
await createNotification({
  ...template,
  id_destinataire: moniteur_id,
  id_ecole: user.id_ecole,
  id_bureau: user.id_bureau
});
```

---

## ✅ Progression

- [ ] Planning (0/4)
- [ ] Élèves (0/4)
- [ ] Véhicules (0/5)
- [ ] Comptabilité Recettes (0/3)
- [ ] Comptabilité Dépenses (0/3)
- [ ] Personnel (0/4)
- [ ] Examens (0/4) - À créer
- [ ] Documents (0/3) - À créer
