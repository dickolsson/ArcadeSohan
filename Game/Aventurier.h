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
#include "ProgMem.h"    // Pour stocker niveaux en Flash!
#include "Procedural.h" // Pour niveaux infinis!

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
// DONNÉES NIVEAUX EN PROGMEM (Level data in PROGMEM)
// ==========================================================
// Ces données sont stockées en Flash (32KB) pas en RAM (2KB)!
// Économie: ~72 octets de RAM sauvés!
// (This data is stored in Flash, not RAM! Saves ~72 bytes!)

// Format: x, y, largeur pour chaque plateforme
// (Format: x, y, width for each platform)

// Niveau 1 - 5 plateformes + porte
NIVEAU_PROGMEM(av_niv1_plat, {
  0, 56, 40,      // Départ (start)
  45, 46, 30,
  80, 38, 30,
  50, 28, 35,
  95, 18, 33      // Finale
});
const uint8_t av_niv1_porte[] PROGMEM = { 110, 3 };

// Niveau 2
NIVEAU_PROGMEM(av_niv2_plat, {
  0, 56, 40,
  35, 46, 25,
  65, 36, 25,
  95, 26, 33,
  60, 16, 35
});
const uint8_t av_niv2_porte[] PROGMEM = { 75, 1 };

// Niveau 3
NIVEAU_PROGMEM(av_niv3_plat, {
  0, 56, 40,
  30, 44, 22,
  60, 54, 22,
  90, 42, 22,
  55, 28, 25
});
const uint8_t av_niv3_porte[] PROGMEM = { 80, 13 };

// Niveau 4+
NIVEAU_PROGMEM(av_niv4_plat, {
  0, 56, 40,
  28, 48, 18,
  55, 38, 18,
  82, 48, 18,
  105, 36, 23
});
const uint8_t av_niv4_porte[] PROGMEM = { 115, 21 };

// ==========================================================
// CRÉER NIVEAU (Create level)
// ==========================================================

void av_creerNiveau() {
  // Toujours 5 plateformes (Always 5 platforms)
  av_nbPlat = 5;
  
  // Niveaux 1-4: chargés depuis PROGMEM (hand-crafted)
  // Niveaux 5+: générés procéduralement (infinite!)
  
  if (av_niveau == 1) {
    pm_chargerNiveau(av_niv1_plat, av_plat, 5);
    pm_chargerPorte(av_niv1_porte, &av_porteX, &av_porteY);
  }
  else if (av_niveau == 2) {
    pm_chargerNiveau(av_niv2_plat, av_plat, 5);
    pm_chargerPorte(av_niv2_porte, &av_porteX, &av_porteY);
  }
  else if (av_niveau == 3) {
    pm_chargerNiveau(av_niv3_plat, av_plat, 5);
    pm_chargerPorte(av_niv3_porte, &av_porteX, &av_porteY);
  }
  else if (av_niveau == 4) {
    pm_chargerNiveau(av_niv4_plat, av_plat, 5);
    pm_chargerPorte(av_niv4_porte, &av_porteX, &av_porteY);
  }
  else {
    // Niveau 5+: génération procédurale!
    // (Level 5+: procedural generation!)
    int difficulte = proc_calculerDifficulte(av_niveau);
    proc_genererPlateformes(av_niveau, av_plat, 5, difficulte);
    proc_genererPorte(av_plat, 5, &av_porteX, &av_porteY);
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
  
  // Niveau suivant - maintenant infini!
  // (Next level - now infinite!)
  av_niveau = av_niveau + 1;
  // Plus de limite! Les niveaux 5+ sont générés automatiquement
  // (No more limit! Levels 5+ are generated automatically)
  
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
