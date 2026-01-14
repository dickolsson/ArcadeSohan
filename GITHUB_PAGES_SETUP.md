# 🚀 Configuration GitHub Pages - Instructions

## ✅ Ce qui a été fait

1. ✅ **Workflow GitHub Actions créé** - Le fichier `.github/workflows/deploy-website.yml` est prêt
2. ✅ **Code poussé sur GitHub** - Tout est sur le dépôt `dickolsson/ArcadeSohan`
3. ✅ **README mis à jour** - Liens vers le site web ajoutés

## 🔧 Configuration Requise (À faire sur GitHub)

### Étape 1 : Activer GitHub Pages

1. Va sur **[https://github.com/dickolsson/ArcadeSohan](https://github.com/dickolsson/ArcadeSohan)**
2. Clique sur **Settings** (⚙️ en haut à droite)
3. Dans le menu de gauche, clique sur **Pages**
4. Sous "Build and deployment" :
   - **Source** : Sélectionne **GitHub Actions**
   - (Ne touche pas à "Branch" - le workflow s'en occupe)
5. Clique sur **Save**

### Étape 2 : Lancer le Premier Déploiement

Option A - **Automatique** (recommandé) :
- Le workflow se lance automatiquement si tu as déjà pushé des changements dans `website/`

Option B - **Manuel** :
1. Va sur l'onglet **Actions** sur GitHub
2. Clique sur le workflow **"Deploy Website"** dans la liste de gauche
3. Clique sur **Run workflow** (bouton bleu à droite)
4. Clique sur **Run workflow** dans le menu déroulant

### Étape 3 : Vérifier le Déploiement

1. Va sur **Actions** → **Deploy Website**
2. Tu verras le workflow en cours (cercle jaune 🟡)
3. Attends 1-2 minutes que ça devienne vert (✅)
4. Une fois terminé, clique sur le workflow
5. Tu verras un lien vers **github-pages** avec l'URL du site

**Ton site sera disponible à :**
```
https://dickolsson.github.io/ArcadeSohan/
```

## 🎯 Workflow de Développement

### Modifier le Site

```bash
# 1. Éditer les fichiers dans website/
vim website/index.html
vim website/css/style.css

# 2. Tester en local
make serve-website
# Ouvre http://localhost:8080

# 3. Si tout est bon, commit et push
git add website/
git commit -m "docs: update homepage design"
git push

# 4. Le site se déploie automatiquement! 🚀
```

### Voir le Statut du Déploiement

- **Actions tab** : [https://github.com/dickolsson/ArcadeSohan/actions](https://github.com/dickolsson/ArcadeSohan/actions)
- Le workflow **Deploy Website** se lance automatiquement quand :
  - Tu push des changements dans `website/`
  - Tu modifies le fichier workflow lui-même

## 🐛 Dépannage

### Le workflow ne se lance pas
- ✅ Vérifie que GitHub Pages est activé (Settings → Pages → Source: GitHub Actions)
- ✅ Vérifie que tu as push le fichier `.github/workflows/deploy-website.yml`

### Le site ne se met pas à jour
- Attends 2-3 minutes après le déploiement
- Rafraîchis avec **Ctrl+F5** (ou **Cmd+Shift+R** sur Mac) pour vider le cache
- Vérifie que le workflow est bien passé au vert

### Erreur 404
- Assure-toi que le workflow a réussi (vert ✅)
- Vérifie que les fichiers sont bien dans `website/` et pas à la racine
- L'URL doit être : `https://dickolsson.github.io/ArcadeSohan/` (avec le slash final)

## 📊 Statistiques

Une fois déployé, tu peux voir les stats dans **Settings → Pages** :
- Nombre de visites
- Builds réussis
- Historique des déploiements

## 🎉 Prochaines Étapes

1. ⚙️ **Active GitHub Pages** (étapes ci-dessus)
2. 🚀 **Lance le premier déploiement**
3. 🌐 **Partage le lien** : `https://dickolsson.github.io/ArcadeSohan/`
4. 📸 **Ajoute des images** dans `website/images/`
5. 🎨 **Personnalise** le contenu du site

---

**Fait par Sohan avec ❤️ et GitHub Copilot**
