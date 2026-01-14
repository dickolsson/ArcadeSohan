---
applyTo: "website/**"
---

# 🌐 Website Instructions - Sites Web Arcade

## Overview

Instructions pour créer des sites web **colorés**, **amusants** et **faciles à maintenir** pour la console arcade.

---

## 🔧 Development Workflow

### Serving the Website Locally

From the project root directory:

```bash
make serve-website
```

This command:
- Changes to the `website/` directory
- Starts a Python HTTP server on port 8080
- Serves the website at http://localhost:8080

**Accessing the site:**
- Homepage: http://localhost:8080/index.html
- Games list: http://localhost:8080/games.html
- About: http://localhost:8080/about.html

**Stop the server:** Press `Ctrl+C`

### Publishing with GitHub Pages

**Le site doit être publié sur GitHub Pages** pour être accessible publiquement.

#### Setup GitHub Pages

1. **Ensure GitHub CLI is installed:**
   ```bash
   gh --version
   ```

2. **Push changes to GitHub:**
   ```bash
   git add website/
   git commit -m "docs: update website"
   git push origin main
   ```

3. **Enable GitHub Pages using GitHub CLI:**
   ```bash
   gh repo edit --enable-pages --pages-branch main --pages-path /website
   ```

4. **Check deployment status:**
   ```bash
   gh run list --workflow=pages-build-deployment
   ```

**URL du site:** https://USERNAME.github.io/REPOSITORY/

#### Managing with GitHub CLI

**All repository management must use GitHub CLI (`gh`):**

| Task | Command |
|------|---------|
| View repo | `gh repo view --web` |
| Create PR | `gh pr create` |
| Check status | `gh repo view` |
| List issues | `gh issue list` |
| View pages | `gh browse` |
| Clone repo | `gh repo clone OWNER/REPO` |

**Check GitHub Pages status:**
```bash
gh api repos/:owner/:repo/pages
```

---

## 📁 Structure de Dossiers

```
website/
├── index.html          # Page d'accueil (Home page)
├── games.html          # Liste des jeux (Games list)
├── about.html          # À propos (About)
│
├── css/
│   └── style.css       # Tous les styles (All styles)
│
├── images/
│   ├── logo.png        # Logo du site
│   ├── screenshot-1.png # Captures d'écran des jeux
│   └── ...
│
└── js/
    └── main.js         # JavaScript simple (optionnel)
```

**Règles:**
- Maximum **5 pages HTML**
- Un seul fichier CSS (`style.css`)
- Pas de framework (pas de React, Vue, etc.)
- Pas de build tools (pas de npm, webpack, etc.)

---

## 🎨 Palette de Couleurs

Utilise ces couleurs pour un look arcade rétro:

```css
:root {
  /* Couleurs principales (Main colors) */
  --arcade-purple: #6B5B95;
  --arcade-pink: #FF6F91;
  --arcade-cyan: #00D4FF;
  --arcade-yellow: #FFE66D;
  --arcade-green: #4ECDC4;
  
  /* Arrière-plans (Backgrounds) */
  --bg-dark: #1A1A2E;
  --bg-card: #16213E;
  
  /* Texte (Text) */
  --text-light: #FFFFFF;
  --text-muted: #B8B8D1;
}
```

### Combinaisons Recommandées

| Élément | Couleur | Variable |
|---------|---------|----------|
| Fond de page | Bleu foncé | `--bg-dark` |
| Cartes/Boîtes | Bleu nuit | `--bg-card` |
| Titres | Cyan | `--arcade-cyan` |
| Boutons | Rose | `--arcade-pink` |
| Accents | Jaune | `--arcade-yellow` |
| Succès | Vert | `--arcade-green` |

---

## 🔤 Typographie

### Polices Recommandées (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

```css
/* Titres - Style arcade pixelisé */
h1, h2, h3 {
  font-family: 'Press Start 2P', cursive;
}

/* Texte normal - Facile à lire */
body, p {
  font-family: 'Poppins', sans-serif;
}
```

### Tailles

| Élément | Taille |
|---------|--------|
| Titre principal (h1) | 2rem |
| Sous-titre (h2) | 1.5rem |
| Texte normal | 1rem |
| Petit texte | 0.875rem |

---

## 📐 Composants de Base

### Structure HTML de Page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arcade Sohan 🎮</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <nav><!-- Navigation --></nav>
  </header>
  
  <main>
    <!-- Contenu principal -->
  </main>
  
  <footer>
    <!-- Pied de page -->
  </footer>
</body>
</html>
```

### Carte de Jeu (Game Card)

```html
<div class="game-card">
  <img src="images/game-screenshot.png" alt="Monster Hunter">
  <h3>Monster Hunter</h3>
  <p>Chasse les monstres et mange la nourriture!</p>
  <span class="tag">Action</span>
</div>
```

```css
.game-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  border: 3px solid var(--arcade-cyan);
  transition: transform 0.3s, box-shadow 0.3s;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
}
```

### Bouton Arcade

```html
<button class="btn-arcade">Jouer! 🎮</button>
```

```css
.btn-arcade {
  background: var(--arcade-pink);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.875rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-arcade:hover {
  background: var(--arcade-yellow);
  color: var(--bg-dark);
  transform: scale(1.05);
}
```

---

## ✨ Effets Amusants

### Texte Brillant (Glow Effect)

```css
.glow-text {
  text-shadow: 
    0 0 10px var(--arcade-cyan),
    0 0 20px var(--arcade-cyan),
    0 0 40px var(--arcade-cyan);
}
```

### Animation de Rebond

```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bounce {
  animation: bounce 1s ease-in-out infinite;
}
```

### Fond Étoilé (Stars Background)

```css
body {
  background: 
    radial-gradient(white 1px, transparent 1px),
    var(--bg-dark);
  background-size: 50px 50px;
}
```

### Bordure Arc-en-ciel

```css
.rainbow-border {
  border: 4px solid;
  border-image: linear-gradient(
    45deg, 
    var(--arcade-pink), 
    var(--arcade-yellow), 
    var(--arcade-green), 
    var(--arcade-cyan)
  ) 1;
}
```

---

## 📱 Responsive Design

### Breakpoints Simples

```css
/* Mobile (default) */
.game-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablette */
@media (min-width: 768px) {
  .game-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .game-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🇫🇷 Langue

| Contexte | Langue |
|----------|--------|
| Contenu du site | Français |
| Commentaires CSS/HTML | Français + (English) |
| Classes CSS | Anglais ou Français |

### Exemples de Texte

```html
<!-- Bon exemple -->
<h1>🎮 Arcade Sohan</h1>
<p>Une console de jeux faite maison avec Arduino!</p>
<button>Voir les jeux</button>

<!-- Avec emojis pour rendre amusant -->
<h2>🕹️ Les Jeux</h2>
<h2>🔧 Comment ça marche?</h2>
<h2>⭐ Scores</h2>
```

---

## 🚫 À Éviter

| ❌ Ne pas faire | ✅ Faire plutôt |
|-----------------|-----------------|
| Frameworks (React, Vue) | HTML/CSS pur |
| npm / build tools | Fichiers statiques |
| Trop de pages | Max 5 pages |
| Plusieurs fichiers CSS | Un seul `style.css` |
| Animations complexes | Animations CSS simples |
| Fond blanc ennuyeux | Fond sombre coloré |
| Police serif classique | Police pixel/moderne |

---

## 📋 Checklist Nouveau Site

- [ ] Structure HTML5 correcte
- [ ] Viewport meta tag présent
- [ ] Palette de couleurs arcade appliquée
- [ ] Police "Press Start 2P" pour titres
- [ ] Responsive (mobile-first)
- [ ] Emojis dans les titres 🎮
- [ ] Effets hover sur les éléments cliquables
- [ ] Fond sombre avec couleurs vives

---

## 🎯 Exemples de Pages

### Page d'Accueil (`index.html`)

Contient:
- Logo/Titre avec effet glow
- Courte description du projet
- Aperçu de 2-3 jeux
- Lien vers la page "Jeux"

### Page Jeux (`games.html`)

Contient:
- Grille de cartes de jeux
- Screenshot de chaque jeu
- Nom et description courte
- Tag de catégorie (Action, Plateforme, etc.)

### Page À Propos (`about.html`)

Contient:
- Photo/schéma du montage Arduino
- Explication simple du projet
- Liste des composants utilisés
- Nom du créateur (Sohan!)

---

## 💡 Astuces

1. **Teste sur mobile** - Utilise l'inspecteur du navigateur (F12)
2. **Optimise les images** - Max 500KB par image
3. **Utilise des emojis** - Ils rendent le site plus fun!
4. **Valide le HTML** - [validator.w3.org](https://validator.w3.org)
5. **Hébergement gratuit** - GitHub Pages, Netlify, Vercel

