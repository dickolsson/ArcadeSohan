// ==========================================================
// PROCEDURAL.H - Génération procédurale de niveaux
// (Procedural level generation)
// ==========================================================
// Ce module génère des niveaux automatiquement à partir
// d'un "seed" (graine). Le même seed = le même niveau!
// (This module generates levels automatically from a
// "seed". Same seed = same level!)
//
// Avantage: Niveaux infinis sans utiliser de mémoire!
// (Advantage: Infinite levels without using memory!)
// ==========================================================

#ifndef PROCEDURAL_H
#define PROCEDURAL_H

// ==========================================================
// GÉNÉRATEUR DE NOMBRES (Number generator)
// ==========================================================
// On utilise le seed pour créer des nombres "aléatoires"
// qui sont toujours les mêmes pour le même seed.
// (We use the seed to create "random" numbers that are
// always the same for the same seed.)

// Seed actuel (Current seed)
unsigned long proc_seed = 1;

// Initialiser le générateur avec un seed
// (Initialize generator with a seed)
// Conseil: utilise le numéro de niveau!
// (Tip: use the level number!)
void proc_init(unsigned long seed) {
  proc_seed = seed * 1103515245 + 12345;
}

// Obtenir un nombre aléatoire entre min et max
// (Get a random number between min and max)
int proc_random(int minVal, int maxVal) {
  proc_seed = proc_seed * 1103515245 + 12345;
  int result = (proc_seed / 65536) % 32768;
  return minVal + (result % (maxVal - minVal + 1));
}

// ==========================================================
// GÉNÉRATION DE PLATEFORMES (Platform generation)
// ==========================================================
// Génère des plateformes jouables automatiquement!
// (Generates playable platforms automatically!)

// Configuration (Configuration)
#define PROC_ECRAN_LARGEUR 128
#define PROC_ECRAN_HAUTEUR 64
#define PROC_SAUT_MAX_X 35      // Distance max saut horizontal
#define PROC_SAUT_MAX_Y 20      // Distance max saut vertical

// ==========================================================
// VALIDATION DE SAUT (Jump validation)
// ==========================================================
// Vérifie si un saut est possible entre deux plateformes
// (Checks if a jump is possible between two platforms)
//
// Règles de saut (Jump rules):
// - Plus on saute haut (Y), moins on peut aller loin (X)
// - Sauter vers le bas permet d'aller plus loin
// - La difficulté permet des sauts plus proches de la limite

bool proc_sautPossible(int deltaX, int deltaY, int difficulte) {
  // deltaX = distance horizontale (toujours positive)
  // deltaY = distance verticale (positive = monter, négatif = descendre)
  
  // Marge de sécurité selon difficulté (Safety margin by difficulty)
  // Facile: 80%, Moyen: 90%, Difficile: 100% de la limite
  int pourcentage = 70 + (difficulte * 10);  // 80, 90, 100
  
  // Distance X maximum selon la hauteur du saut
  // (Max X distance based on jump height)
  int maxX;
  
  if (deltaY <= 0) {
    // Descendre ou même niveau = plus facile
    // (Going down or same level = easier)
    maxX = PROC_SAUT_MAX_X + 5;
  } else if (deltaY <= 8) {
    // Petit saut vers le haut (Small upward jump)
    maxX = PROC_SAUT_MAX_X;
  } else if (deltaY <= 14) {
    // Saut moyen (Medium jump)
    maxX = PROC_SAUT_MAX_X - 8;
  } else {
    // Grand saut vers le haut (Big upward jump)
    maxX = PROC_SAUT_MAX_X - 15;
  }
  
  // Appliquer la marge de difficulté
  maxX = (maxX * pourcentage) / 100;
  
  return (deltaX <= maxX);
}

// Générer des plateformes pour un niveau
// (Generate platforms for a level)
//
// Paramètres (Parameters):
//   niveau     - Numéro du niveau (level number)
//   plat       - Tableau destination [n][3] (x, y, largeur)
//   nbPlat     - Nombre de plateformes à générer
//   difficulte - 1=facile, 2=moyen, 3=difficile
//
// Retourne: position Y de la dernière plateforme
//
// Usage:
//   int dernierY = proc_genererPlateformes(niveau, av_plat, 5, 1);

int proc_genererPlateformes(int niveau, int plat[][3], int nbPlat, int difficulte) {
  // Initialiser avec le numéro de niveau comme seed
  proc_init(niveau * 12345);
  
  // Largeur des plateformes selon difficulté
  // (Platform width based on difficulty)
  int largeurMin = 35 - (difficulte * 8);  // 27, 19, 11
  int largeurMax = 45 - (difficulte * 8);  // 37, 29, 21
  if (largeurMin < 15) largeurMin = 15;
  if (largeurMax < 20) largeurMax = 20;
  
  // Première plateforme: toujours en bas à gauche (spawn)
  // (First platform: always bottom-left for spawn)
  plat[0][0] = 0;
  plat[0][1] = 56;
  plat[0][2] = 40;
  
  // Position actuelle pour construire le chemin
  int dernierX = 20;  // Centre de la première plateforme
  int dernierY = 56;
  int dernierLargeur = 40;
  
  // Générer les autres plateformes
  for (int i = 1; i < nbPlat; i++) {
    int nouveauX, nouveauY, largeur;
    int deltaX, deltaY;
    int essais = 0;
    
    // Essayer jusqu'à trouver une position valide
    // (Try until we find a valid position)
    do {
      // Calculer la prochaine position
      deltaX = proc_random(15, PROC_SAUT_MAX_X);
      deltaY = proc_random(6, PROC_SAUT_MAX_Y);
      
      // Alterner gauche/droite mais monter toujours
      int direction = proc_random(0, 100);
      
      if (direction < 40) {
        // Aller à gauche
        nouveauX = dernierX - deltaX;
      } else {
        // Aller à droite
        nouveauX = dernierX + deltaX;
      }
      
      // Monter (Y diminue car 0 est en haut)
      nouveauY = dernierY - deltaY;
      
      // Largeur aléatoire
      largeur = proc_random(largeurMin, largeurMax);
      
      // Garder dans les limites de l'écran
      if (nouveauX < 5) nouveauX = 5;
      if (nouveauX > PROC_ECRAN_LARGEUR - largeur - 5) {
        nouveauX = PROC_ECRAN_LARGEUR - largeur - 5;
      }
      if (nouveauY < 10) nouveauY = 10;
      if (nouveauY > 50) nouveauY = 50;
      
      // Recalculer deltaX réel après ajustements
      int centreNouveau = nouveauX + largeur / 2;
      deltaX = dernierX - centreNouveau;
      if (deltaX < 0) deltaX = -deltaX;
      
      // Ajuster deltaX pour tenir compte des largeurs
      // Le joueur peut sauter depuis le bord de la plateforme
      // (Adjust deltaX to account for platform widths)
      int bordDerniere = dernierLargeur / 2;
      int bordNouvelle = largeur / 2;
      deltaX = deltaX - bordDerniere - bordNouvelle;
      if (deltaX < 0) deltaX = 0;
      
      deltaY = dernierY - nouveauY;
      
      essais++;
      
      // Après 10 essais, forcer une plateforme proche
      // (After 10 tries, force a close platform)
      if (essais > 10) {
        nouveauX = dernierX + proc_random(-20, 20);
        if (nouveauX < 5) nouveauX = 5;
        if (nouveauX > PROC_ECRAN_LARGEUR - largeur - 5) {
          nouveauX = PROC_ECRAN_LARGEUR - largeur - 5;
        }
        nouveauY = dernierY - proc_random(5, 10);
        if (nouveauY < 10) nouveauY = 10;
        break;
      }
      
    } while (!proc_sautPossible(deltaX, deltaY, difficulte));
    
    // Sauvegarder la plateforme
    plat[i][0] = nouveauX;
    plat[i][1] = nouveauY;
    plat[i][2] = largeur;
    
    // Mettre à jour la position pour la prochaine
    dernierX = nouveauX + largeur / 2;
    dernierY = nouveauY;
    dernierLargeur = largeur;
  }
  
  return dernierY;  // Retourne Y de la dernière plateforme
}

// ==========================================================
// GÉNÉRATION DE PORTE/OBJECTIF (Door/objective generation)
// ==========================================================
// Place la porte sur ou près de la dernière plateforme
// (Places door on or near the last platform)

void proc_genererPorte(int plat[][3], int nbPlat, int* porteX, int* porteY) {
  // Prendre la dernière plateforme
  int dernierePlat = nbPlat - 1;
  int px = plat[dernierePlat][0];
  int py = plat[dernierePlat][1];
  int pl = plat[dernierePlat][2];
  
  // Placer la porte au centre de la plateforme
  *porteX = px + pl / 2;
  *porteY = py - 14;  // Au-dessus de la plateforme
}

// ==========================================================
// GÉNÉRATION D'ENNEMIS (Enemy generation)
// ==========================================================
// Génère des positions d'ennemis sur les plateformes
// (Generates enemy positions on platforms)
//
// Usage:
//   proc_genererEnnemis(niveau, plat, 5, ennemis, 3);

void proc_genererEnnemis(int niveau, int plat[][3], int nbPlat, 
                         int ennemis[][2], int nbEnnemis) {
  // Réinitialiser avec seed différent pour les ennemis
  proc_init(niveau * 54321);
  
  for (int i = 0; i < nbEnnemis; i++) {
    // Choisir une plateforme (pas la première = spawn)
    int indexPlat = proc_random(1, nbPlat - 1);
    
    // Position sur la plateforme
    int px = plat[indexPlat][0];
    int py = plat[indexPlat][1];
    int pl = plat[indexPlat][2];
    
    // X aléatoire sur la plateforme
    ennemis[i][0] = px + proc_random(5, pl - 5);
    // Y juste au-dessus de la plateforme
    ennemis[i][1] = py - 8;
  }
}

// ==========================================================
// GÉNÉRATION DE COLLECTIBLES (Collectible generation)
// ==========================================================
// Génère des étoiles/pièces à collecter
// (Generates stars/coins to collect)

void proc_genererCollectibles(int niveau, int plat[][3], int nbPlat,
                              int items[][2], int nbItems) {
  // Seed différent pour les items
  proc_init(niveau * 98765);
  
  for (int i = 0; i < nbItems; i++) {
    // Choisir une plateforme
    int indexPlat = proc_random(0, nbPlat - 1);
    
    int px = plat[indexPlat][0];
    int py = plat[indexPlat][1];
    int pl = plat[indexPlat][2];
    
    // Position au-dessus de la plateforme
    items[i][0] = px + proc_random(5, pl - 5);
    items[i][1] = py - proc_random(15, 25);  // En l'air
  }
}

// ==========================================================
// DIFFICULTÉ PROGRESSIVE (Progressive difficulty)
// ==========================================================
// Calcule la difficulté basée sur le niveau
// (Calculates difficulty based on level)
//
// Retourne: 1 (facile), 2 (moyen), 3 (difficile)

int proc_calculerDifficulte(int niveau) {
  if (niveau <= 3) return 1;       // Niveaux 1-3: facile
  if (niveau <= 7) return 2;       // Niveaux 4-7: moyen
  return 3;                         // Niveau 8+: difficile
}

// ==========================================================
// EXEMPLE COMPLET (Complete example)
// ==========================================================
/*
// Dans ton jeu (In your game):

#include "Procedural.h"

int gn_plat[5][3];
int gn_porteX, gn_porteY;
int gn_niveau = 1;

void gn_creerNiveau() {
  // Calculer la difficulté automatiquement
  int diff = proc_calculerDifficulte(gn_niveau);
  
  // Générer 5 plateformes
  proc_genererPlateformes(gn_niveau, gn_plat, 5, diff);
  
  // Placer la porte
  proc_genererPorte(gn_plat, 5, &gn_porteX, &gn_porteY);
}

// Maintenant tu as des NIVEAUX INFINIS!
// Le niveau 1 sera toujours identique (même seed).
// Le niveau 100 sera différent mais toujours le même niveau 100!

*/

#endif
