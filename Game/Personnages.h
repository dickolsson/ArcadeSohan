// ==========================================================
// PERSONNAGES.H - Les personnages à débloquer!
// (Characters to unlock!)
// ==========================================================
// Plus tu gagnes d'étoiles, plus tu débloques de personnages!
// (The more stars you earn, the more characters you unlock!)
// ==========================================================

#ifndef PERSONNAGES_H
#define PERSONNAGES_H

#include "Display.h"

// ==========================================================
// LISTE DES PERSONNAGES (Character list)
// ==========================================================

#define PERSO_BLOB 0       // Le personnage de départ (Starting character)
#define PERSO_BONHOMME 1   // Avec une tête! (With a head!)
#define PERSO_HEROS 2      // Avec bras et jambes! (With arms and legs!)
#define PERSO_CHAMPION 3   // Le meilleur! (The best one!)

#define NOMBRE_PERSONNAGES 4

// Combien d'étoiles pour débloquer chaque personnage
// (How many stars to unlock each character)
int etoilesPourDebloquer[NOMBRE_PERSONNAGES] = {
  0,     // Blob - gratuit! (free!)
  100,   // Bonhomme - 100 étoiles
  300,   // Héros - 300 étoiles
  600    // Champion - 600 étoiles
};

// Noms des personnages (Character names)
const char* nomsPersonnages[NOMBRE_PERSONNAGES] = {
  "Blob",
  "Bonhomme",
  "Heros",
  "Champion"
};

// ==========================================================
// ÉTOILES DU JOUEUR (Player's stars)
// ==========================================================

// Les étoiles que le joueur a gagnées (Stars the player earned)
int etoilesTotales = 0;

// Le personnage actuellement sélectionné (Currently selected character)
int personnageActuel = PERSO_BLOB;

// ==========================================================
// FONCTIONS DES PERSONNAGES (Character functions)
// ==========================================================

// Vérifier si un personnage est débloqué (Check if character is unlocked)
bool personnageDebloque(int numeroPerso) {
  if (numeroPerso < 0 || numeroPerso >= NOMBRE_PERSONNAGES) {
    return false;
  }
  return etoilesTotales >= etoilesPourDebloquer[numeroPerso];
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
    if (anciensEtoiles < etoilesPourDebloquer[i] && 
        etoilesTotales >= etoilesPourDebloquer[i]) {
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
// DESSINER LES PERSONNAGES (Draw characters)
// ==========================================================

// Dessiner le BLOB - juste un cercle (just a circle)
void dessinerBlob(int x, int y) {
  dessinerCercle(x, y, 4);
}

// Dessiner le BONHOMME - tête et corps (head and body)
void dessinerBonhomme(int x, int y) {
  // Tête (Head)
  dessinerCercle(x, y - 4, 3);
  // Corps (Body)
  dessinerRectangle(x - 2, y, 4, 6);
}

// Dessiner le HÉROS - avec bras et jambes (with arms and legs)
void dessinerHeros(int x, int y) {
  // Tête (Head)
  dessinerCercle(x, y - 5, 3);
  // Corps (Body)
  dessinerRectangle(x - 2, y - 1, 4, 5);
  // Bras gauche (Left arm)
  dessinerLigne(x - 2, y, x - 5, y + 3);
  // Bras droit (Right arm)
  dessinerLigne(x + 2, y, x + 5, y + 3);
  // Jambe gauche (Left leg)
  dessinerLigne(x - 1, y + 4, x - 3, y + 8);
  // Jambe droite (Right leg)
  dessinerLigne(x + 1, y + 4, x + 3, y + 8);
}

// Dessiner le CHAMPION - avec une épée! (with a sword!)
void dessinerChampion(int x, int y) {
  // Tête (Head)
  dessinerCercle(x, y - 5, 3);
  // Corps (Body)
  dessinerRectangle(x - 2, y - 1, 4, 5);
  // Bras gauche (Left arm)
  dessinerLigne(x - 2, y, x - 5, y + 3);
  // Bras droit avec épée (Right arm with sword)
  dessinerLigne(x + 2, y, x + 6, y - 2);
  // L'épée! (The sword!)
  dessinerRectangle(x + 6, y - 6, 2, 8);
  // Jambe gauche (Left leg)
  dessinerLigne(x - 1, y + 4, x - 3, y + 8);
  // Jambe droite (Right leg)
  dessinerLigne(x + 1, y + 4, x + 3, y + 8);
}

// Dessiner le personnage actuel (Draw current character)
void dessinerPersonnage(int x, int y, int numeroPerso) {
  if (numeroPerso == PERSO_BLOB) {
    dessinerBlob(x, y);
  }
  if (numeroPerso == PERSO_BONHOMME) {
    dessinerBonhomme(x, y);
  }
  if (numeroPerso == PERSO_HEROS) {
    dessinerHeros(x, y);
  }
  if (numeroPerso == PERSO_CHAMPION) {
    dessinerChampion(x, y);
  }
}

// ==========================================================
// ÉCRAN DE SÉLECTION (Selection screen)
// ==========================================================

// Afficher l'écran de sélection de personnage
// (Show character selection screen)
void afficherSelectionPersonnage() {
  effacerEcran();
  
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
  
  afficherEcran();
}

#endif
