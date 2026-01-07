// ==========================================================
// PROCEDURAL.H - Génération procédurale universelle
// (Universal procedural generation)
// ==========================================================
// Ce module génère des éléments de jeu automatiquement!
// Fonctionne pour jeux de PLATEFORME et jeux VUE DU DESSUS.
// (This module generates game elements automatically!
// Works for PLATFORM games and TOP-VIEW games.)
//
// Le même seed = le même résultat!
// (Same seed = same result!)
// ==========================================================

#ifndef PROCEDURAL_H
#define PROCEDURAL_H

// ==========================================================
// CONFIGURATION ÉCRAN (Screen configuration)
// ==========================================================

#define PROC_ECRAN_LARGEUR 128
#define PROC_ECRAN_HAUTEUR 64

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
// SECTION 1: FONCTIONS GÉNÉRIQUES (Generic functions)
// ==========================================================
// Ces fonctions marchent pour TOUS les types de jeux!
// (These functions work for ALL game types!)
// ==========================================================

// ----------------------------------------------------------
// proc_genererPosition - Génère UNE position aléatoire
// (Generates ONE random position)
// ----------------------------------------------------------
// Paramètres:
//   seed   - Graine pour la génération (level number works!)
//   index  - Numéro de l'élément (0, 1, 2...)
//   x, y   - Pointeurs pour stocker le résultat
//   marge  - Distance minimum des bords de l'écran
//
// Usage:
//   int foodX, foodY;
//   proc_genererPosition(niveau, 0, &foodX, &foodY, 10);

void proc_genererPosition(int seed, int index, int* x, int* y, int marge) {
  proc_init(seed * 11111 + index * 77777);
  
  *x = proc_random(marge, PROC_ECRAN_LARGEUR - marge);
  *y = proc_random(marge, PROC_ECRAN_HAUTEUR - marge);
}

// ----------------------------------------------------------
// proc_genererPositions - Génère PLUSIEURS positions
// (Generates MULTIPLE positions)
// ----------------------------------------------------------
// Paramètres:
//   seed      - Graine pour la génération
//   positions - Tableau [n][2] pour stocker x,y
//   nb        - Nombre de positions à générer
//   marge     - Distance minimum des bords
//
// Usage:
//   int items[5][2];
//   proc_genererPositions(niveau, items, 5, 10);

void proc_genererPositions(int seed, int positions[][2], int nb, int marge) {
  for (int i = 0; i < nb; i++) {
    proc_genererPosition(seed, i, &positions[i][0], &positions[i][1], marge);
  }
}

// ----------------------------------------------------------
// proc_genererLoinDe - Position loin d'un point donné
// (Position far from a given point)
// ----------------------------------------------------------
// Parfait pour spawner des monstres loin du joueur!
// (Perfect for spawning monsters far from player!)
//
// Paramètres:
//   seed     - Graine pour la génération
//   index    - Numéro de l'élément
//   x, y     - Pointeurs pour le résultat
//   eviterX  - Position X à éviter (joueur)
//   eviterY  - Position Y à éviter (joueur)
//   distMin  - Distance minimum requise
//   marge    - Distance minimum des bords
//
// Usage:
//   int monstreX, monstreY;
//   proc_genererLoinDe(niveau, 0, &monstreX, &monstreY,
//                      joueurX, joueurY, 40, 10);

void proc_genererLoinDe(int seed, int index, int* x, int* y,
                        int eviterX, int eviterY, int distMin, int marge) {
  proc_init(seed * 54321 + index * 12345);
  
  int essais = 0;
  int maxEssais = 20;
  
  do {
    *x = proc_random(marge, PROC_ECRAN_LARGEUR - marge);
    *y = proc_random(marge, PROC_ECRAN_HAUTEUR - marge);
    
    // Calculer distance (Calculate distance)
    int dx = *x - eviterX;
    int dy = *y - eviterY;
    if (dx < 0) dx = -dx;
    if (dy < 0) dy = -dy;
    int distance = dx + dy;  // Distance Manhattan
    
    if (distance >= distMin) {
      return;  // Position valide trouvée!
    }
    
    essais++;
  } while (essais < maxEssais);
  
  // Fallback: coin opposé au joueur
  // (Fallback: corner opposite to player)
  if (eviterX < PROC_ECRAN_LARGEUR / 2) {
    *x = PROC_ECRAN_LARGEUR - marge - 10;
  } else {
    *x = marge + 10;
  }
  if (eviterY < PROC_ECRAN_HAUTEUR / 2) {
    *y = PROC_ECRAN_HAUTEUR - marge - 10;
  } else {
    *y = marge + 10;
  }
}

// ----------------------------------------------------------
// proc_genererDansCoin - Position dans un coin aléatoire
// (Position in a random corner)
// ----------------------------------------------------------
// Utile pour spawner dans les 4 coins de l'écran.
// (Useful for spawning in the 4 screen corners.)
//
// Paramètres:
//   seed   - Graine pour la génération
//   index  - Numéro de l'élément
//   x, y   - Pointeurs pour le résultat
//   marge  - Zone de spawn depuis le coin
//
// Usage:
//   int ennemisX, ennemisY;
//   proc_genererDansCoin(niveau, 0, &enemyX, &enemyY, 25);

void proc_genererDansCoin(int seed, int index, int* x, int* y, int marge) {
  proc_init(seed * 99999 + index * 33333);
  
  int coin = proc_random(0, 3);
  
  if (coin == 0) {
    // Haut-gauche (Top-left)
    *x = proc_random(5, marge);
    *y = proc_random(12, marge);
  } else if (coin == 1) {
    // Haut-droite (Top-right)
    *x = proc_random(PROC_ECRAN_LARGEUR - marge, PROC_ECRAN_LARGEUR - 5);
    *y = proc_random(12, marge);
  } else if (coin == 2) {
    // Bas-gauche (Bottom-left)
    *x = proc_random(5, marge);
    *y = proc_random(PROC_ECRAN_HAUTEUR - marge, PROC_ECRAN_HAUTEUR - 5);
  } else {
    // Bas-droite (Bottom-right)
    *x = proc_random(PROC_ECRAN_LARGEUR - marge, PROC_ECRAN_LARGEUR - 5);
    *y = proc_random(PROC_ECRAN_HAUTEUR - marge, PROC_ECRAN_HAUTEUR - 5);
  }
}

// ==========================================================
// SECTION 2: FONCTIONS PLATEFORME (Platform functions)
// ==========================================================
// Ces fonctions sont spécifiques aux jeux de plateforme.
// (These functions are specific to platform games.)
// ==========================================================

// Configuration de saut (Jump configuration)
#define PROC_SAUT_MAX_X 35      // Distance max saut horizontal
#define PROC_SAUT_MAX_Y 20      // Distance max saut vertical

// ----------------------------------------------------------
// proc_sautPossible - Vérifie si un saut est faisable
// (Checks if a jump is possible)
// ----------------------------------------------------------

bool proc_sautPossible(int deltaX, int deltaY, int difficulte) {
  int pourcentage = 70 + (difficulte * 10);
  
  int maxX;
  if (deltaY <= 0) {
    maxX = PROC_SAUT_MAX_X + 5;
  } else if (deltaY <= 8) {
    maxX = PROC_SAUT_MAX_X;
  } else if (deltaY <= 14) {
    maxX = PROC_SAUT_MAX_X - 8;
  } else {
    maxX = PROC_SAUT_MAX_X - 15;
  }
  
  maxX = (maxX * pourcentage) / 100;
  return (deltaX <= maxX);
}

// ----------------------------------------------------------
// proc_genererPlateformes - Génère des plateformes jouables
// (Generates playable platforms)
// ----------------------------------------------------------
// Paramètres:
//   niveau     - Numéro du niveau (used as seed)
//   plat       - Tableau [n][3] pour x, y, largeur
//   nbPlat     - Nombre de plateformes
//   difficulte - 1=facile, 2=moyen, 3=difficile
//
// Retourne: Y de la dernière plateforme
//
// Usage:
//   int dernierY = proc_genererPlateformes(niveau, plat, 5, 1);

int proc_genererPlateformes(int niveau, int plat[][3], int nbPlat, int difficulte) {
  proc_init(niveau * 12345);
  
  int largeurMin = 35 - (difficulte * 8);
  int largeurMax = 45 - (difficulte * 8);
  if (largeurMin < 15) largeurMin = 15;
  if (largeurMax < 20) largeurMax = 20;
  
  // Première plateforme: spawn en bas à gauche
  plat[0][0] = 0;
  plat[0][1] = 56;
  plat[0][2] = 40;
  
  int dernierX = 20;
  int dernierY = 56;
  int dernierLargeur = 40;
  
  for (int i = 1; i < nbPlat; i++) {
    int nouveauX, nouveauY, largeur;
    int deltaX, deltaY;
    int essais = 0;
    
    do {
      deltaX = proc_random(15, PROC_SAUT_MAX_X);
      deltaY = proc_random(6, PROC_SAUT_MAX_Y);
      
      int direction = proc_random(0, 100);
      if (direction < 40) {
        nouveauX = dernierX - deltaX;
      } else {
        nouveauX = dernierX + deltaX;
      }
      
      nouveauY = dernierY - deltaY;
      largeur = proc_random(largeurMin, largeurMax);
      
      if (nouveauX < 5) nouveauX = 5;
      if (nouveauX > PROC_ECRAN_LARGEUR - largeur - 5) {
        nouveauX = PROC_ECRAN_LARGEUR - largeur - 5;
      }
      if (nouveauY < 10) nouveauY = 10;
      if (nouveauY > 50) nouveauY = 50;
      
      int centreNouveau = nouveauX + largeur / 2;
      deltaX = dernierX - centreNouveau;
      if (deltaX < 0) deltaX = -deltaX;
      
      int bordDerniere = dernierLargeur / 2;
      int bordNouvelle = largeur / 2;
      deltaX = deltaX - bordDerniere - bordNouvelle;
      if (deltaX < 0) deltaX = 0;
      
      deltaY = dernierY - nouveauY;
      essais++;
      
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
    
    plat[i][0] = nouveauX;
    plat[i][1] = nouveauY;
    plat[i][2] = largeur;
    
    dernierX = nouveauX + largeur / 2;
    dernierY = nouveauY;
    dernierLargeur = largeur;
  }
  
  return dernierY;
}

// ----------------------------------------------------------
// proc_genererPorte - Place la porte sur dernière plateforme
// (Places door on last platform)
// ----------------------------------------------------------

void proc_genererPorte(int plat[][3], int nbPlat, int* porteX, int* porteY) {
  int dernierePlat = nbPlat - 1;
  int px = plat[dernierePlat][0];
  int py = plat[dernierePlat][1];
  int pl = plat[dernierePlat][2];
  
  *porteX = px + pl / 2;
  *porteY = py - 14;
}

// ----------------------------------------------------------
// proc_genererSurPlateforme - Position sur une plateforme
// (Position on a platform)
// ----------------------------------------------------------
// Utile pour placer ennemis ou items sur les plateformes.
// (Useful for placing enemies or items on platforms.)
//
// Paramètres:
//   seed       - Graine pour génération
//   index      - Numéro de l'élément
//   plat       - Tableau des plateformes
//   nbPlat     - Nombre de plateformes
//   x, y       - Pointeurs pour le résultat
//   hauteur    - Hauteur au-dessus de la plateforme

void proc_genererSurPlateforme(int seed, int index, int plat[][3], int nbPlat,
                                int* x, int* y, int hauteur) {
  proc_init(seed * 54321 + index * 11111);
  
  // Choisir plateforme (pas la première = spawn)
  int indexPlat = proc_random(1, nbPlat - 1);
  
  int px = plat[indexPlat][0];
  int py = plat[indexPlat][1];
  int pl = plat[indexPlat][2];
  
  *x = px + proc_random(5, pl - 5);
  *y = py - hauteur;
}

// ==========================================================
// SECTION 3: UTILITAIRES (Utilities)
// ==========================================================

// ----------------------------------------------------------
// proc_calculerDifficulte - Difficulté basée sur le niveau
// (Difficulty based on level)
// ----------------------------------------------------------
// Retourne: 1 (facile), 2 (moyen), 3 (difficile)

int proc_calculerDifficulte(int niveau) {
  if (niveau <= 3) return 1;
  if (niveau <= 7) return 2;
  return 3;
}

#endif
