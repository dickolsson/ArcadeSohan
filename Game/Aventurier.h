// ==========================================================
// AVENTURIER.H - Jeu de plateforme simple!
// (Simple platform game!)
// ==========================================================

#ifndef AVENTURIER_H
#define AVENTURIER_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"
#include "Melodies.h"

// ==========================================================
// INFORMATIONS DU JEU (Game information)
// ==========================================================

InfoJeu infoAventurier = {
  "Aventurier",
  "Saute et cours!"
};

// ==========================================================
// CONFIGURATION (Configuration)
// ==========================================================

#define AV_GRAVITE 1
#define AV_FORCE_SAUT 5
#define AV_MAX_PLATEFORMES 6

// ==========================================================
// VARIABLES DU JEU (Game variables)
// ==========================================================

// Joueur (Player)
int av_joueurX = 20;
int av_joueurY = 48;
int av_vitesseY = 0;
bool av_auSol = true;

// Animation
int av_frame = 0;
bool av_bouge = false;

// Plateformes: x, y, largeur (Platforms: x, y, width)
int av_plat[AV_MAX_PLATEFORMES][3];
int av_nbPlat = 0;

// Porte (Door)
int av_porteX = 110;
int av_porteY = 25;

// Niveau (Level)
int av_niveau = 1;
int av_etoiles = 0;
int av_etatJeu = ETAT_EN_COURS;

// ==========================================================
// CRÉER NIVEAU (Create level)
// ==========================================================

void av_creerNiveau() {
  // Toujours 5 plateformes (Always 5 platforms)
  av_nbPlat = 5;
  
  // Plateforme de depart (Starting platform)
  av_plat[0][0] = 0;   av_plat[0][1] = 56; av_plat[0][2] = 40;
  
  // Les autres plateformes changent selon le niveau
  // (Other platforms change based on level)
  if (av_niveau == 1) {
    av_plat[1][0] = 45;  av_plat[1][1] = 46; av_plat[1][2] = 30;
    av_plat[2][0] = 80;  av_plat[2][1] = 38; av_plat[2][2] = 30;
    av_plat[3][0] = 50;  av_plat[3][1] = 28; av_plat[3][2] = 35;
    av_plat[4][0] = 95;  av_plat[4][1] = 18; av_plat[4][2] = 33;
    av_porteX = 110; av_porteY = 3;
  }
  else if (av_niveau == 2) {
    av_plat[1][0] = 35;  av_plat[1][1] = 46; av_plat[1][2] = 25;
    av_plat[2][0] = 65;  av_plat[2][1] = 36; av_plat[2][2] = 25;
    av_plat[3][0] = 95;  av_plat[3][1] = 26; av_plat[3][2] = 33;
    av_plat[4][0] = 60;  av_plat[4][1] = 16; av_plat[4][2] = 35;
    av_porteX = 75; av_porteY = 1;
  }
  else if (av_niveau == 3) {
    av_plat[1][0] = 30;  av_plat[1][1] = 44; av_plat[1][2] = 22;
    av_plat[2][0] = 60;  av_plat[2][1] = 54; av_plat[2][2] = 22;
    av_plat[3][0] = 90;  av_plat[3][1] = 42; av_plat[3][2] = 22;
    av_plat[4][0] = 55;  av_plat[4][1] = 28; av_plat[4][2] = 25;
    av_porteX = 80; av_porteY = 13;
  }
  else {
    // Niveau 4+ (Level 4+)
    av_plat[1][0] = 28;  av_plat[1][1] = 48; av_plat[1][2] = 18;
    av_plat[2][0] = 55;  av_plat[2][1] = 38; av_plat[2][2] = 18;
    av_plat[3][0] = 82;  av_plat[3][1] = 48; av_plat[3][2] = 18;
    av_plat[4][0] = 105; av_plat[4][1] = 36; av_plat[4][2] = 23;
    av_porteX = 115; av_porteY = 21;
  }
}

// ==========================================================
// PHYSIQUE (Physics)
// ==========================================================

bool av_surPlateforme() {
  int piedY = av_joueurY + 6;
  
  for (int i = 0; i < av_nbPlat; i++) {
    int px = av_plat[i][0];
    int py = av_plat[i][1];
    int pl = av_plat[i][2];
    
    if (av_joueurX >= px - 3 && av_joueurX <= px + pl + 3) {
      if (piedY >= py - 2 && piedY <= py + 5) {
        if (av_vitesseY >= 0) {
          return true;
        }
      }
    }
  }
  return false;
}

void av_physique() {
  av_auSol = av_surPlateforme();
  
  if (av_auSol) {
    av_vitesseY = 0;
  } else {
    av_vitesseY = av_vitesseY + AV_GRAVITE;
    if (av_vitesseY > 4) av_vitesseY = 4;
  }
  
  av_joueurY = av_joueurY + av_vitesseY;
  
  // Tombé? Reset! (Fell? Reset!)
  if (av_joueurY > 64) {
    av_joueurX = 20;
    av_joueurY = 48;
    av_vitesseY = 0;
  }
}

// ==========================================================
// CONTRÔLES (Controls)
// ==========================================================

void av_controles() {
  lireJoystick();
  av_bouge = false;
  
  if (joystickGauche()) {
    av_joueurX = av_joueurX - 2;
    av_bouge = true;
    av_frame = 1 - av_frame;
  }
  if (joystickDroite()) {
    av_joueurX = av_joueurX + 2;
    av_bouge = true;
    av_frame = 1 - av_frame;
  }
  
  // Limites écran (Screen limits)
  if (av_joueurX < 5) av_joueurX = 5;
  if (av_joueurX > 123) av_joueurX = 123;
  
  // Sauter (Jump)
  if (boutonJustePresse() && av_auSol) {
    av_vitesseY = -AV_FORCE_SAUT;
    melodieTir();
  }
}

// ==========================================================
// DESSIN (Drawing)
// ==========================================================

void av_dessinerBonhomme(int x, int y) {
  // Tête (Head)
  dessinerCercle(x, y - 6, 3);
  // Corps (Body)
  dessinerRectangle(x - 2, y - 2, 4, 5);
  
  // Jambes animées (Animated legs)
  if (av_bouge && av_frame == 0) {
    dessinerLigne(x - 1, y + 3, x - 3, y + 7);
    dessinerLigne(x + 1, y + 3, x + 3, y + 7);
  } else {
    dessinerLigne(x - 1, y + 3, x - 2, y + 7);
    dessinerLigne(x + 1, y + 3, x + 2, y + 7);
  }
  
  // Bras (Arms)
  dessinerLigne(x - 2, y - 1, x - 4, y + 2);
  dessinerLigne(x + 2, y - 1, x + 4, y + 2);
}

void av_dessiner() {
  effacerEcran();
  
  // Score (Score)
  ecrireTexteNombre(0, 0, "Niv ", av_niveau, 1);
  
  // Plateformes (Platforms)
  for (int i = 0; i < av_nbPlat; i++) {
    dessinerRectangle(av_plat[i][0], av_plat[i][1], av_plat[i][2], 4);
  }
  
  // Porte (Door)
  dessinerContour(av_porteX - 4, av_porteY, 8, 14);
  dessinerCercle(av_porteX + 1, av_porteY + 7, 1);
  
  // Joueur (Player)
  av_dessinerBonhomme(av_joueurX, av_joueurY);
  
  afficherEcran();
}

// ==========================================================
// COLLISION PORTE (Door collision)
// ==========================================================

bool av_touchePorte() {
  int dx = av_joueurX - av_porteX;
  int dy = av_joueurY - av_porteY;
  if (dx < 0) dx = -dx;
  if (dy < 0) dy = -dy;
  return (dx < 8 && dy < 12);
}

void av_niveauTermine() {
  // Message simple (Simple message)
  effacerEcran();
  ecrireTexte(20, 20, "BRAVO!", 2);
  afficherEcran();
  delay(1500);
  
  // Niveau suivant (Next level)
  av_niveau = av_niveau + 1;
  if (av_niveau > 4) {
    av_niveau = 1;
  }
  
  // Reset joueur (Reset player)
  av_joueurX = 20;
  av_joueurY = 48;
  av_vitesseY = 0;
  av_creerNiveau();
}

// ==========================================================
// FONCTIONS PRINCIPALES (Main functions)
// ==========================================================

void av_setupJeu() {
  av_creerNiveau();
}

void av_resetJeu() {
  av_joueurX = 20;
  av_joueurY = 48;
  av_vitesseY = 0;
  av_niveau = 1;
  av_etoiles = 0;
  av_nbPlat = 0;
  av_etatJeu = ETAT_EN_COURS;
  av_creerNiveau();  // Creer le niveau immediatement!
}

int av_getEtatJeu() {
  return av_etatJeu;
}

void av_loopJeu() {
  // TEST 4 - COMPLET avec porte
  av_controles();
  av_physique();
  
  if (av_touchePorte()) {
    av_niveauTermine();
  }
  
  av_dessiner();
  delay(30);
}

#endif
