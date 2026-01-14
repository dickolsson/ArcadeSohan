# 🎮 Site Web Arcade Sohan

Site web pour présenter la console de jeux Arduino **Arcade Sohan** et expliquer le code de chaque jeu.

## 📁 Structure

```
website/
├── index.html          # Page d'accueil
├── games.html          # Liste détaillée des jeux
├── about.html          # À propos du projet
├── css/
│   └── style.css       # Tous les styles
├── js/
│   └── main.js         # Interactions JavaScript
└── images/             # Images et captures d'écran (à ajouter)
```

## 🎨 Design

- **Palette de couleurs** : Style arcade rétro avec couleurs néon
- **Polices** : 
  - Titres : "Press Start 2P" (arcade pixelisé)
  - Texte : "Poppins" (moderne et lisible)
- **Responsive** : Mobile-first, optimisé pour tous les écrans

## 🚀 Lancer le Site

### Option 1: Fichiers locaux
Ouvre simplement `index.html` dans ton navigateur.

### Option 2: Serveur local Python
```bash
cd website
python3 -m http.server 8000
```
Puis va sur http://localhost:8000

### Option 3: Serveur local Node.js
```bash
npx serve website
```

### Option 4: Live Server (VS Code)
Installe l'extension "Live Server" et clique droit sur `index.html` → "Open with Live Server"

## 📄 Pages

### 🏠 Page d'Accueil (index.html)
- Logo et titre avec effet brillant
- Description du projet
- Aperçu des 3 jeux principaux
- Caractéristiques de la console
- Technologies utilisées

### 🕹️ Page des Jeux (games.html)
- Détails complets de chaque jeu :
  - **Monster Hunter** : Jeu d'action en vue du dessus
  - **Aventurier** : Jeu de plateforme avec gravité
  - **Breakout** : Casse-briques classique
- Explications du code pour chaque jeu
- Systèmes communs à tous les jeux

### ⚙️ Page À Propos (about.html)
- Composants hardware utilisés
- Configuration des pins Arduino
- Architecture logicielle
- Optimisation de la mémoire
- Ce qu'on apprend avec ce projet
- Plans futurs

## ✨ Fonctionnalités JavaScript

- **Défilement fluide** vers les sections
- **Animation au scroll** : Les cartes apparaissent progressivement
- **Copie de code** : Bouton pour copier les extraits de code
- **Easter Egg** : Code Konami pour une surprise! (↑↑↓↓←→←→BA)
- **Barre de progression animée** : Pour les stats de mémoire
- **Navigation dynamique** : Navbar cache en scrollant

## 🎯 Prochaines Étapes

1. **Ajouter des images** :
   - Logo de la console
   - Captures d'écran des jeux
   - Photo du montage Arduino
   - Schéma de câblage

2. **Hébergement** :
   - GitHub Pages (gratuit)
   - Netlify (gratuit)
   - Vercel (gratuit)

3. **Améliorations optionnelles** :
   - Vidéos de gameplay
   - Diagrammes interactifs
   - Section FAQ
   - Tutoriel pas-à-pas

## 📸 Images Recommandées

Crée un dossier `images/` avec :
- `logo.png` - Logo de la console
- `monster-hunter.png` - Capture d'écran du jeu
- `aventurier.png` - Capture d'écran du jeu
- `breakout.png` - Capture d'écran du jeu
- `arduino-setup.jpg` - Photo du montage
- `wiring-diagram.png` - Schéma de connexions

## 🌐 Héberger sur GitHub Pages

1. Crée un repo GitHub
2. Pousse le dossier `website/`
3. Va dans Settings → Pages
4. Source: "main branch" → folder: "website"
5. Ton site sera sur `https://username.github.io/repo-name/`

## 🎨 Personnaliser les Couleurs

Dans `css/style.css`, change les variables CSS :
```css
:root {
  --arcade-purple: #6B5B95;
  --arcade-pink: #FF6F91;
  --arcade-cyan: #00D4FF;
  --arcade-yellow: #FFE66D;
  --arcade-green: #4ECDC4;
}
```

## 🐛 Bugs Connus

Aucun pour le moment! Si tu trouves un problème, note-le.

## 📝 Licence

Ce projet éducatif est open source. Utilise-le librement pour apprendre!

---

**Créé avec ❤️ par Sohan**
