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
#include "ProgMem.h"     // Pour stocker niveaux en Flash!
#include "Procedural.h"  // Pour niveaux infinis!
#include "Physics.h"     // Pour collision!
#include "Objects.h"     // Pour gérer les plateformes!
#include "Personnages.h" // Pour dessiner le joueur!

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

// Direction du joueur (Player direction)
int av_direction = DIR_DROITE;

// Animation
int av_frame = 0;
bool av_bouge = false;

// Plateformes avec ObjetSimple (Platforms using ObjetSimple)
// Utilise le champ largeur pour la largeur de plateforme!
ObjetSimple av_plat[AV_MAX_PLATEFORMES];
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

// Niveau 4
NIVEAU_PROGMEM(av_niv4_plat, {
  0, 56, 40,
  28, 48, 18,
  55, 38, 18,
  82, 48, 18,
  105, 36, 23
});
const uint8_t av_niv4_porte[] PROGMEM = { 115, 21 };

// Niveau 5 - Avec plateforme intermédiaire (with intermediate platform)
NIVEAU_PROGMEM(av_niv5_plat, {
  0, 56, 40,      // Départ (start)
  35, 46, 22,     // Première montée (first climb)
  65, 36, 22,     // Plateforme intermédiaire (middle platform)
  95, 46, 22,     // Retour en bas (back down)
  70, 24, 35      // Plateforme finale (final platform)
});
const uint8_t av_niv5_porte[] PROGMEM = { 85, 9 };

// ==========================================================
// CRÉER NIVEAU (Create level)
// ==========================================================

void av_creerNiveau() {
  // Toujours 5 plateformes (Always 5 platforms)
  av_nbPlat = 5;
  
  // Niveaux 1-5: chargés depuis PROGMEM (hand-crafted)
  // Niveaux 6+: générés procéduralement (infinite!)
  
  if (av_niveau == 1) {
    obj_chargerPlateformes(av_niv1_plat, av_plat, 5);
    pm_chargerPorte(av_niv1_porte, &av_porteX, &av_porteY);
  }
  else if (av_niveau == 2) {
    obj_chargerPlateformes(av_niv2_plat, av_plat, 5);
    pm_chargerPorte(av_niv2_porte, &av_porteX, &av_porteY);
  }
  else if (av_niveau == 3) {
    obj_chargerPlateformes(av_niv3_plat, av_plat, 5);
    pm_chargerPorte(av_niv3_porte, &av_porteX, &av_porteY);
  }
  else if (av_niveau == 4) {
    obj_chargerPlateformes(av_niv4_plat, av_plat, 5);
    pm_chargerPorte(av_niv4_porte, &av_porteX, &av_porteY);
  }
  else if (av_niveau == 5) {
    obj_chargerPlateformes(av_niv5_plat, av_plat, 5);
    pm_chargerPorte(av_niv5_porte, &av_porteX, &av_porteY);
  }
  else {
    // Niveau 6+: génération procédurale avec ObjetSimple!
    // (Level 6+: procedural generation with ObjetSimple!)
    int difficulte = proc_calculerDifficulte(av_niveau);
    
    // Générer dans tableau temporaire puis copier
    int tempPlat[5][3];
    proc_genererPlateformes(av_niveau, tempPlat, 5, difficulte);
    
    // Copier vers ObjetSimple
    for (int i = 0; i < 5; i++) {
      av_plat[i].x = tempPlat[i][0];
      av_plat[i].y = tempPlat[i][1];
      av_plat[i].largeur = tempPlat[i][2];
      av_plat[i].type = 1;
      av_plat[i].actif = true;
    }
    
    proc_genererPorte(tempPlat, 5, &av_porteX, &av_porteY);
  }
}

// ==========================================================
// PHYSIQUE (Physics)
// ==========================================================

bool av_surPlateforme() {
  int piedY = av_joueurY + 6;
  
  // Utilise obj_surPlateforme de Objects.h!
  return obj_surPlateforme(av_plat, av_nbPlat, av_joueurX, piedY, av_vitesseY) >= 0;
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
    av_direction = DIR_GAUCHE;
  }
  if (joystickDroite()) {
    av_joueurX = av_joueurX + 2;
    av_bouge = true;
    av_frame = 1 - av_frame;
    av_direction = DIR_DROITE;
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
// Utilise Personnages.h pour dessiner le joueur!
// (Uses Personnages.h to draw the player!)

// Dessiner le contenu du jeu (Draw game content) - appelé dans la boucle page
void av_dessinerContenu() {
  // Score (Score)
  ecrireTexteNombre(0, 0, "Niv ", av_niveau, 1);
  
  // Plateformes avec ObjetSimple (Platforms with ObjetSimple)
  for (int i = 0; i < av_nbPlat; i++) {
    if (av_plat[i].actif) {
      dessinerRectangle(av_plat[i].x, av_plat[i].y, av_plat[i].largeur, 4);
    }
  }
  
  // Porte (Door)
  dessinerContour(av_porteX - 4, av_porteY, 8, 14);
  dessinerCercle(av_porteX + 1, av_porteY + 7, 1);
  
  // Joueur - utilise Personnages.h vue plateforme!
  // (Player - uses Personnages.h platform view!)
  pers_dessinerPlateforme(av_joueurX, av_joueurY, personnageActuel, 
                          av_direction, av_bouge ? av_frame : 0);
}

void av_dessiner() {
  DESSINER_ECRAN {
    av_dessinerContenu();
  }
}

// ==========================================================
// COLLISION PORTE (Door collision)
// ==========================================================
// Simplifié avec Physics.h!

bool av_touchePorte() {
  // Le joueur touche la porte? (Player touches door?)
  return phys_touchePoint(av_joueurX, av_joueurY, av_porteX, av_porteY + 6, 10);
}

void av_niveauTermine() {
  // Message simple (Simple message)
  DESSINER_ECRAN {
    ecrireTexte(20, 20, "BRAVO!", 2);
  }
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
  av_direction = DIR_DROITE;
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
