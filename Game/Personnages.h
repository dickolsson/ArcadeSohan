// ==========================================================
// PERSONNAGES.H - Les personnages à débloquer!
// (Characters to unlock!)
// ==========================================================
// Plus tu gagnes d'étoiles, plus tu débloques de personnages!
// (The more stars you earn, the more characters you unlock!)
// Compatible avec jeux plateforme ET vue de dessus!
// (Compatible with platform AND top-view games!)
// ==========================================================

#ifndef PERSONNAGES_H
#define PERSONNAGES_H

#include "Display.h"
#include "ProgMem.h"

// ==========================================================
// LISTE DES PERSONNAGES (Character list)
// ==========================================================

#define PERSO_BLOB 0       // Le personnage de départ (Starting character)
#define PERSO_BONHOMME 1   // Avec une tête! (With a head!)
#define PERSO_HEROS 2      // Avec bras et jambes! (With arms and legs!)
#define PERSO_CHAMPION 3   // Le meilleur! (The best one!)

#define NOMBRE_PERSONNAGES 4

// ==========================================================
// DIRECTIONS (Directions)
// ==========================================================

#define DIR_HAUT 0      // Vue de dessus: vers le haut
#define DIR_DROITE 1    // Vue de dessus: vers la droite / Plateforme: face droite
#define DIR_BAS 2       // Vue de dessus: vers le bas
#define DIR_GAUCHE 3    // Vue de dessus: vers la gauche / Plateforme: face gauche

// ==========================================================
// DONNÉES EN PROGMEM (Data in PROGMEM - saves RAM!)
// ==========================================================

// Combien d'étoiles pour débloquer chaque personnage (in Flash!)
CONFIG_PROGMEM(pers_etoilesPourDebloquer, { 0, 100, 44, 88 });
// 0=Blob gratuit, 100=Bonhomme, 300/3=100 stored as 44*3+12=300? 
// Correction: on stocke les valeurs directement mais max 255!
// Pour valeurs > 255, on utilise un multiplicateur

// Multiplicateur pour étoiles (x3)
#define PERS_ETOILES_MULT 3

// Valeurs stockées: 0, 33, 100, 200 → réel: 0, 99, 300, 600
CONFIG_PROGMEM(pers_deblocage, { 0, 33, 100, 200 });

// Noms des personnages en PROGMEM
TEXTE_PROGMEM(pers_nom0, "Blob");
TEXTE_PROGMEM(pers_nom1, "Bonhomme");
TEXTE_PROGMEM(pers_nom2, "Heros");
TEXTE_PROGMEM(pers_nom3, "Champion");

// ==========================================================
// ÉTOILES DU JOUEUR (Player's stars)
// ==========================================================

// Les étoiles que le joueur a gagnées (Stars the player earned)
int etoilesTotales = 0;

// Le personnage actuellement sélectionné (Currently selected character)
// PERSO_BONHOMME par défaut pour voir le personnage complet!
int personnageActuel = PERSO_BONHOMME;

// ==========================================================
// FONCTIONS DES PERSONNAGES (Character functions)
// ==========================================================

// Obtenir étoiles requises pour un personnage
// (Get stars required for a character)
int pers_etoilesRequises(int numeroPerso) {
  if (numeroPerso < 0 || numeroPerso >= NOMBRE_PERSONNAGES) return 9999;
  return pm_lireConfig(pers_deblocage, numeroPerso) * PERS_ETOILES_MULT;
}

// Vérifier si un personnage est débloqué (Check if character is unlocked)
bool personnageDebloque(int numeroPerso) {
  return etoilesTotales >= pers_etoilesRequises(numeroPerso);
}

// Ajouter des étoiles (Add stars)
// Retourne true si un nouveau personnage est débloqué!
// (Returns true if a new character is unlocked!)
bool ajouterEtoiles(int nombre) {
  int anciensEtoiles = etoilesTotales;
  etoilesTotales = etoilesTotales + nombre;
  
  // Vérifier si on a débloqué un nouveau personnage
  // (Check if we unlocked a new character)
  for (int i = 0; i < NOMBRE_PERSONNAGES; i++) {
    int requis = pers_etoilesRequises(i);
    if (anciensEtoiles < requis && etoilesTotales >= requis) {
      return true;  // Nouveau personnage débloqué!
    }
  }
  return false;
}

// Compter combien de personnages sont débloqués
// (Count how many characters are unlocked)
int nombrePersonnagesDebloques() {
  int compte = 0;
  for (int i = 0; i < NOMBRE_PERSONNAGES; i++) {
    if (personnageDebloque(i)) {
      compte = compte + 1;
    }
  }
  return compte;
}

// ==========================================================
// DESSINER VUE PLATEFORME (Draw platform view - side view)
// ==========================================================
// Pour jeux comme Aventurier - vue de côté
// (For games like Aventurier - side view)
// direction: DIR_GAUCHE ou DIR_DROITE
// frame: 0 ou 1 pour animation marche

// Dessiner le BLOB - juste un cercle (just a circle)
void dessinerBlobPlateforme(int x, int y) {
  dessinerCercle(x, y, 4);
}

// Dessiner le BONHOMME - tête et corps (head and body)
void dessinerBonhommePlateforme(int x, int y, int direction, int frame) {
  // Tête (Head)
  dessinerCercle(x, y - 6, 3);
  // Corps (Body)
  dessinerRectangle(x - 2, y - 2, 4, 5);
  
  // Jambes animées (Animated legs)
  int decal = (frame == 0) ? 1 : 0;
  dessinerLigne(x - 1, y + 3, x - 2 - decal, y + 7);
  dessinerLigne(x + 1, y + 3, x + 2 + decal, y + 7);
  
  // Bras (Arms) - direction affecte le bras avant
  if (direction == DIR_DROITE) {
    dessinerLigne(x - 2, y - 1, x - 4, y + 2);
    dessinerLigne(x + 2, y - 1, x + 5, y + 1);
  } else {
    dessinerLigne(x + 2, y - 1, x + 4, y + 2);
    dessinerLigne(x - 2, y - 1, x - 5, y + 1);
  }
}

// Dessiner le HÉROS - avec bras et jambes détaillés
void dessinerHerosPlateforme(int x, int y, int direction, int frame) {
  // Tête (Head)
  dessinerCercle(x, y - 5, 3);
  // Corps (Body)
  dessinerRectangle(x - 2, y - 1, 4, 5);
  
  // Jambes animées
  int decal = (frame == 0) ? 2 : 0;
  dessinerLigne(x - 1, y + 4, x - 3 + decal, y + 8);
  dessinerLigne(x + 1, y + 4, x + 3 - decal, y + 8);
  
  // Bras selon direction
  if (direction == DIR_DROITE) {
    dessinerLigne(x - 2, y, x - 5, y + 3);
    dessinerLigne(x + 2, y, x + 5, y + 3);
  } else {
    dessinerLigne(x + 2, y, x + 5, y + 3);
    dessinerLigne(x - 2, y, x - 5, y + 3);
  }
}

// Dessiner le CHAMPION - avec une épée!
void dessinerChampionPlateforme(int x, int y, int direction, int frame) {
  // Tête (Head)
  dessinerCercle(x, y - 5, 3);
  // Corps (Body)
  dessinerRectangle(x - 2, y - 1, 4, 5);
  
  // Jambes animées
  int decal = (frame == 0) ? 2 : 0;
  dessinerLigne(x - 1, y + 4, x - 3 + decal, y + 8);
  dessinerLigne(x + 1, y + 4, x + 3 - decal, y + 8);
  
  // Bras + épée selon direction
  if (direction == DIR_DROITE) {
    dessinerLigne(x - 2, y, x - 5, y + 3);
    dessinerLigne(x + 2, y, x + 6, y - 2);
    dessinerRectangle(x + 6, y - 6, 2, 8);  // Épée!
  } else {
    dessinerLigne(x + 2, y, x + 5, y + 3);
    dessinerLigne(x - 2, y, x - 6, y - 2);
    dessinerRectangle(x - 8, y - 6, 2, 8);  // Épée!
  }
}

// Dessiner personnage vue plateforme (Platform view character)
// API unifiée pour tous les jeux de plateforme
void pers_dessinerPlateforme(int x, int y, int numero, int direction, int frame) {
  if (numero == PERSO_BLOB) {
    dessinerBlobPlateforme(x, y);
  } else if (numero == PERSO_BONHOMME) {
    dessinerBonhommePlateforme(x, y, direction, frame);
  } else if (numero == PERSO_HEROS) {
    dessinerHerosPlateforme(x, y, direction, frame);
  } else if (numero == PERSO_CHAMPION) {
    dessinerChampionPlateforme(x, y, direction, frame);
  }
}

// ==========================================================
// DESSINER VUE DE DESSUS (Draw top-down view)
// ==========================================================
// Pour jeux comme MonsterHunter - vue d'en haut
// (For games like MonsterHunter - overhead view)
// direction: DIR_HAUT, DIR_DROITE, DIR_BAS, DIR_GAUCHE

// Dessiner le BLOB vue de dessus - cercle simple
void dessinerBlobVueHaut(int x, int y, int taille) {
  dessinerCercle(x + taille/2, y + taille/2, taille/2);
}

// Dessiner personnage vue de dessus avec indicateur de direction
// Corps = cercle, Direction = triangle pointant
void dessinerPersonnageVueHaut(int x, int y, int taille, int direction) {
  int cx = x + taille/2;
  int cy = y + taille/2;
  int r = taille/2 - 1;
  
  // Corps (Body) - cercle
  dessinerCercle(cx, cy, r);
  
  // Indicateur de direction (Direction indicator) - triangle
  int pointe = 4;
  if (direction == DIR_HAUT) {
    dessinerTriangle(cx, cy - r - pointe, cx - 3, cy - r, cx + 3, cy - r);
  } else if (direction == DIR_DROITE) {
    dessinerTriangle(cx + r + pointe, cy, cx + r, cy - 3, cx + r, cy + 3);
  } else if (direction == DIR_BAS) {
    dessinerTriangle(cx, cy + r + pointe, cx - 3, cy + r, cx + 3, cy + r);
  } else if (direction == DIR_GAUCHE) {
    dessinerTriangle(cx - r - pointe, cy, cx - r, cy - 3, cx - r, cy + 3);
  }
}

// Champion vue de dessus - avec épée!
void dessinerChampionVueHaut(int x, int y, int taille, int direction) {
  dessinerPersonnageVueHaut(x, y, taille, direction);
  
  // Épée dans la direction (Sword in direction)
  int cx = x + taille/2;
  int cy = y + taille/2;
  int r = taille/2 + 2;
  
  if (direction == DIR_HAUT) {
    dessinerRectangle(cx - 1, cy - r - 6, 2, 6);
  } else if (direction == DIR_DROITE) {
    dessinerRectangle(cx + r, cy - 1, 6, 2);
  } else if (direction == DIR_BAS) {
    dessinerRectangle(cx - 1, cy + r, 2, 6);
  } else if (direction == DIR_GAUCHE) {
    dessinerRectangle(cx - r - 6, cy - 1, 6, 2);
  }
}

// API unifiée vue de dessus (Unified top-view API)
void pers_dessinerVueHaut(int x, int y, int taille, int numero, int direction) {
  if (numero == PERSO_BLOB) {
    dessinerBlobVueHaut(x, y, taille);
  } else if (numero == PERSO_CHAMPION) {
    dessinerChampionVueHaut(x, y, taille, direction);
  } else {
    // Bonhomme et Héros: même dessin vue de dessus
    dessinerPersonnageVueHaut(x, y, taille, direction);
  }
}

// ==========================================================
// COMPATIBILITÉ (Backward compatibility)
// ==========================================================
// Ancienne API - utilise vue plateforme, face droite

void dessinerBlob(int x, int y) { dessinerBlobPlateforme(x, y); }
void dessinerBonhomme(int x, int y) { dessinerBonhommePlateforme(x, y, DIR_DROITE, 0); }
void dessinerHeros(int x, int y) { dessinerHerosPlateforme(x, y, DIR_DROITE, 0); }
void dessinerChampion(int x, int y) { dessinerChampionPlateforme(x, y, DIR_DROITE, 0); }

void dessinerPersonnage(int x, int y, int numeroPerso) {
  pers_dessinerPlateforme(x, y, numeroPerso, DIR_DROITE, 0);
}

// ==========================================================
// ÉCRAN DE SÉLECTION (Selection screen)
// ==========================================================

// Dessiner le contenu de sélection (Draw selection content)
void dessinerSelectionContenu() {
  // Titre (Title)
  ecrireTexte(10, 0, "PERSONNAGES", 1);
  
  // Étoiles du joueur (Player's stars)
  ecrireTexteNombre(70, 0, "*", etoilesTotales, 1);
  
  // Dessiner tous les personnages (Draw all characters)
  for (int i = 0; i < NOMBRE_PERSONNAGES; i++) {
    int posX = 16 + (i * 28);
    int posY = 35;
    
    // Dessiner le personnage (Draw character)
    if (personnageDebloque(i)) {
      dessinerPersonnage(posX, posY, i);
      
      // Flèche si c'est le personnage actuel (Arrow if current)
      if (i == personnageActuel) {
        ecrireTexte(posX - 3, 50, "^", 1);
      }
    } else {
      // Personnage verrouillé - dessiner un cadenas (Locked - draw lock)
      dessinerContour(posX - 4, posY - 6, 8, 12);
      ecrireTexte(posX - 2, posY - 3, "?", 1);
    }
  }
  
  // Instructions (Instructions)
  ecrireTexte(0, 56, "<- Choisir ->  OK", 1);
}

// Afficher l'écran de sélection de personnage
// (Show character selection screen)
void afficherSelectionPersonnage() {
  DESSINER_ECRAN {
    dessinerSelectionContenu();
  }
}

#endif
