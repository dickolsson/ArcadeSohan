// ==========================================================
// AVENTURIER.H - Jeu d'aventure avec plateformes!
// (Adventure game with platforms!)
// ==========================================================
// Saute sur les plateformes et atteins la porte!
// (Jump on platforms and reach the door!)
// ==========================================================

#ifndef AVENTURIER_H
#define AVENTURIER_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"
#include "Melodies.h"
// #include "Personnages.h"  // DÉSACTIVÉ - on utilise un cercle simple pour l'instant

// ==========================================================
// INFORMATIONS DU JEU (Game information)
// ==========================================================

InfoJeu infoAventurier = {
  "Aventurier",           // Nom (Name)
  "Saute et cours!"       // Description
};

// ==========================================================
// CONFIGURATION DU JEU (Game configuration)
// ==========================================================

// Taille de l'écran de jeu (Game screen size)
#define AV_ZONE_JEU_Y 10  // Le jeu commence à Y=10 (sous le score)

// Gravité et saut (Gravity and jump)
#define AV_GRAVITE 1        // Force de la gravité (Gravity force)
#define AV_FORCE_SAUT 6     // Force du saut (Jump force)
#define AV_VITESSE_MAX 4    // Vitesse max de chute (Max fall speed)

// Plateformes (Platforms)
#define AV_MAX_PLATEFORMES 6   // Nombre max de plateformes (Max platforms)
#define AV_HAUTEUR_PLATEFORME 4  // Hauteur des plateformes (Platform height)

// ==========================================================
// VARIABLES DU JEU (Game variables)
// ==========================================================

// Position du joueur (Player position)
int av_joueurX = 10;
int av_joueurY = 50;
int av_vitesseY = 0;        // Vitesse verticale (Vertical speed)
bool av_auSol = false;      // Est-ce qu'on touche le sol? (Touching ground?)
int av_vitesseJoueur = 2;   // Vitesse horizontale (Horizontal speed)

// Position de la porte (Door position)
int av_porteX = 115;
int av_porteY = 20;

// Les plateformes (Platforms)
// Chaque plateforme: x, y, largeur (Each platform: x, y, width)
int av_plateformes[AV_MAX_PLATEFORMES][3];
int av_nombrePlateformes = 0;

// Niveau et score (Level and score)
int av_niveau = 1;
int av_etoilesNiveau = 50;    // Étoiles gagnées par niveau (Stars per level)
int av_etoilesGagnees = 0;    // Étoiles de cette partie (Stars this game)

// État du jeu (Game state)
int av_etatJeu = ETAT_EN_COURS;

// ==========================================================
// CRÉATION DES NIVEAUX (Level creation)
// ==========================================================

// Créer le niveau 1 - Facile! (Level 1 - Easy!)
void av_creerNiveau1() {
  av_nombrePlateformes = 4;
  
  // Sol de départ (Starting ground)
  av_plateformes[0][0] = 0;    // x
  av_plateformes[0][1] = 56;   // y
  av_plateformes[0][2] = 40;   // largeur
  
  // Plateforme du milieu (Middle platform)
  av_plateformes[1][0] = 45;
  av_plateformes[1][1] = 45;
  av_plateformes[1][2] = 35;
  
  // Plateforme haute (High platform)
  av_plateformes[2][0] = 85;
  av_plateformes[2][1] = 35;
  av_plateformes[2][2] = 40;
  
  // Plateforme de la porte (Door platform)
  av_plateformes[3][0] = 100;
  av_plateformes[3][1] = 25;
  av_plateformes[3][2] = 28;
  
  // Position de la porte (Door position)
  av_porteX = 112;
  av_porteY = 15;
}

// Créer le niveau 2 - Un peu plus dur! (Level 2 - A bit harder!)
void av_creerNiveau2() {
  av_nombrePlateformes = 5;
  
  // Sol de départ (Starting ground)
  av_plateformes[0][0] = 0;
  av_plateformes[0][1] = 56;
  av_plateformes[0][2] = 25;
  
  // Petites plateformes (Small platforms)
  av_plateformes[1][0] = 30;
  av_plateformes[1][1] = 48;
  av_plateformes[1][2] = 20;
  
  av_plateformes[2][0] = 55;
  av_plateformes[2][1] = 38;
  av_plateformes[2][2] = 20;
  
  av_plateformes[3][0] = 80;
  av_plateformes[3][1] = 28;
  av_plateformes[3][2] = 20;
  
  // Plateforme de la porte (Door platform)
  av_plateformes[4][0] = 100;
  av_plateformes[4][1] = 18;
  av_plateformes[4][2] = 28;
  
  av_porteX = 112;
  av_porteY = 8;
}

// Créer le niveau 3 - Difficile! (Level 3 - Hard!)
void av_creerNiveau3() {
  av_nombrePlateformes = 6;
  
  // Sol de départ (Starting ground)
  av_plateformes[0][0] = 0;
  av_plateformes[0][1] = 56;
  av_plateformes[0][2] = 20;
  
  // Zigzag de plateformes! (Zigzag platforms!)
  av_plateformes[1][0] = 25;
  av_plateformes[1][1] = 45;
  av_plateformes[1][2] = 18;
  
  av_plateformes[2][0] = 10;
  av_plateformes[2][1] = 32;
  av_plateformes[2][2] = 18;
  
  av_plateformes[3][0] = 35;
  av_plateformes[3][1] = 22;
  av_plateformes[3][2] = 18;
  
  av_plateformes[4][0] = 60;
  av_plateformes[4][1] = 32;
  av_plateformes[4][2] = 20;
  
  // Plateforme de la porte (Door platform)
  av_plateformes[5][0] = 90;
  av_plateformes[5][1] = 20;
  av_plateformes[5][2] = 38;
  
  av_porteX = 108;
  av_porteY = 10;
}

// Charger un niveau (Load a level)
void av_chargerNiveau(int numero) {
  // Remettre le joueur au début (Reset player to start)
  av_joueurX = 15;
  av_joueurY = 48;   // Sur la première plateforme (On first platform)
  av_vitesseY = 0;
  av_auSol = true;   // Commence au sol (Start on ground)
  
  // Charger les plateformes du niveau (Load level platforms)
  if (numero == 1) {
    av_creerNiveau1();
  } else if (numero == 2) {
    av_creerNiveau2();
  } else if (numero == 3) {
    av_creerNiveau3();
  } else {
    // Niveaux 4+ = répéter niveau 3 (Level 4+ = repeat level 3)
    av_creerNiveau3();
  }
}

// ==========================================================
// PHYSIQUE DU JEU (Game physics)
// ==========================================================

// Vérifier si le joueur est sur une plateforme
// (Check if player is on a platform)
bool av_surPlateforme() {
  // Position des pieds du joueur (Player's feet position)
  int piedsY = av_joueurY + 6;  // 6 = taille du personnage
  
  // Vérifier chaque plateforme (Check each platform)
  for (int i = 0; i < av_nombrePlateformes; i++) {
    int platX = av_plateformes[i][0];
    int platY = av_plateformes[i][1];
    int platLargeur = av_plateformes[i][2];
    
    // Est-ce que les pieds touchent la plateforme?
    // (Do feet touch the platform?)
    bool surX = (av_joueurX >= platX - 3) && (av_joueurX <= platX + platLargeur + 3);
    bool surY = (piedsY >= platY - 2) && (piedsY <= platY + 6);
    
    if (surX && surY && av_vitesseY >= 0) {
      return true;
    }
  }
  return false;
}

// Appliquer la gravité et gérer le saut
// (Apply gravity and handle jumping)
void av_appliquerPhysique() {
  // Vérifier si on est au sol (Check if on ground)
  av_auSol = av_surPlateforme();
  
  if (av_auSol) {
    // On est au sol - arrêter de tomber (On ground - stop falling)
    av_vitesseY = 0;
    
    // Ajuster la position sur la plateforme (Adjust position on platform)
    for (int i = 0; i < av_nombrePlateformes; i++) {
      int platX = av_plateformes[i][0];
      int platY = av_plateformes[i][1];
      int platLargeur = av_plateformes[i][2];
      
      bool surX = (av_joueurX >= platX - 3) && (av_joueurX <= platX + platLargeur + 3);
      int piedsY = av_joueurY + 6;
      bool surY = (piedsY >= platY - 2) && (piedsY <= platY + 6);
      
      if (surX && surY) {
        av_joueurY = platY - 6;  // Poser les pieds sur la plateforme
        break;
      }
    }
  } else {
    // En l'air - appliquer la gravité (In air - apply gravity)
    av_vitesseY = av_vitesseY + AV_GRAVITE;
    
    // Limiter la vitesse de chute (Limit fall speed)
    if (av_vitesseY > AV_VITESSE_MAX) {
      av_vitesseY = AV_VITESSE_MAX;
    }
  }
  
  // Appliquer la vitesse verticale (Apply vertical speed)
  av_joueurY = av_joueurY + av_vitesseY;
  
  // Vérifier si on tombe hors de l'écran (Check if fell off screen)
  if (av_joueurY > HAUTEUR_ECRAN) {
    // Tombé! Recommencer le niveau (Fell! Restart level)
    av_joueurX = 15;
    av_joueurY = 48;
    av_vitesseY = 0;
    av_auSol = true;
  }
}

// ==========================================================
// CONTRÔLES DU JOUEUR (Player controls)
// ==========================================================

void av_gererControles() {
  // Lire le joystick (Read joystick)
  lireJoystick();
  
  // Mouvement gauche/droite (Left/right movement)
  if (joystickGauche()) {
    av_joueurX = av_joueurX - av_vitesseJoueur;
  }
  if (joystickDroite()) {
    av_joueurX = av_joueurX + av_vitesseJoueur;
  }
  
  // Limiter aux bords de l'écran (Keep on screen)
  if (av_joueurX < 0) av_joueurX = 0;
  if (av_joueurX > LARGEUR_ECRAN - 5) av_joueurX = LARGEUR_ECRAN - 5;
  
  // Sauter avec le bouton (Jump with button)
  if (boutonJustePresse() && av_auSol) {
    av_vitesseY = -AV_FORCE_SAUT;
    av_auSol = false;
    melodieTir();  // Son de saut (Jump sound)
  }
}

// ==========================================================
// COLLISION AVEC LA PORTE (Door collision)
// ==========================================================

bool av_touchePorte() {
  int distanceX = av_joueurX - av_porteX;
  int distanceY = av_joueurY - av_porteY;
  
  if (distanceX < 0) distanceX = -distanceX;
  if (distanceY < 0) distanceY = -distanceY;
  
  return (distanceX < 10 && distanceY < 15);
}

// ==========================================================
// DESSIN DU JEU (Game drawing)
// ==========================================================

void av_dessinerJeu() {
  effacerEcran();
  
  // Afficher le score et niveau (Show score and level)
  ecrireTexteNombre(0, 0, "*", av_etoilesGagnees, 1);
  ecrireTexteNombre(70, 0, "Niv ", av_niveau, 1);
  
  // Dessiner les plateformes (Draw platforms)
  for (int i = 0; i < av_nombrePlateformes; i++) {
    int x = av_plateformes[i][0];
    int y = av_plateformes[i][1];
    int largeur = av_plateformes[i][2];
    dessinerRectangle(x, y, largeur, AV_HAUTEUR_PLATEFORME);
  }
  
  // Dessiner la porte (Draw door)
  dessinerContour(av_porteX - 5, av_porteY, 10, 15);
  // Poignée de porte (Door handle)
  dessinerCercle(av_porteX + 2, av_porteY + 8, 1);
  
  // Dessiner le joueur - un simple cercle pour commencer!
  // (Draw player - a simple circle to start!)
  dessinerCercle(av_joueurX, av_joueurY, 4);
  
  afficherEcran();
}

// ==========================================================
// ÉCRANS SPÉCIAUX (Special screens)
// ==========================================================

// Écran de niveau terminé! (Level complete screen!)
void av_ecranNiveauTermine() {
  int etoilesGagnees = av_etoilesNiveau + (av_niveau * 10);
  av_etoilesGagnees = av_etoilesGagnees + etoilesGagnees;
  
  effacerEcran();
  ecrireTexte(15, 5, "BRAVO!", 2);
  ecrireTexteNombre(20, 28, "Niveau ", av_niveau, 1);
  ecran.print(" termine!");
  ecrireTexteNombre(20, 40, "+", etoilesGagnees, 1);
  ecran.print(" etoiles!");
  
  afficherEcran();
  
  melodieVictoireBoss();
  delay(2000);
}

// ==========================================================
// FONCTIONS PRINCIPALES DU JEU (Main game functions)
// ==========================================================

// Préparer le jeu (Setup game)
void av_setupJeu() {
  av_chargerNiveau(av_niveau);
}

// Remettre le jeu à zéro (Reset game)
void av_resetJeu() {
  av_joueurX = 10;
  av_joueurY = 50;
  av_vitesseY = 0;
  av_auSol = false;
  av_niveau = 1;
  av_etoilesGagnees = 0;
  av_etatJeu = ETAT_EN_COURS;
}

// Obtenir l'état du jeu (Get game state)
int av_getEtatJeu() {
  return av_etatJeu;
}

// Boucle principale du jeu (Main game loop)
void av_loopJeu() {
  // Gérer les contrôles (Handle controls)
  av_gererControles();
  
  // Appliquer la physique (Apply physics)
  av_appliquerPhysique();
  
  // Vérifier si on touche la porte (Check door collision)
  if (av_touchePorte()) {
    // Niveau terminé! (Level complete!)
    av_ecranNiveauTermine();
    
    // Niveau suivant (Next level)
    av_niveau = av_niveau + 1;
    av_chargerNiveau(av_niveau);
  }
  
  // Dessiner le jeu (Draw game)
  av_dessinerJeu();
  
  // Petit délai pour que le jeu ne soit pas trop rapide
  // (Small delay so game isn't too fast)
  delay(30);
}

#endif
