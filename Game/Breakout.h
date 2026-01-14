#ifndef BREAKOUT_H
#define BREAKOUT_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"
#include "Physics.h"
#include "Melodies.h"
#include "Personnages.h"

// ==========================================================
// INFORMATIONS DU JEU (Game information)
// ==========================================================

InfoJeu infoBreakout = { "Breakout", "Casse-briques!" };

// ==========================================================
// CONSTANTES (Constants)
// ==========================================================

#define BR_LARGEUR_RAQUETTE 20  // Paddle width
#define BR_HAUTEUR_RAQUETTE 3   // Paddle height
#define BR_VITESSE_RAQUETTE 3   // Paddle speed
#define BR_TAILLE_BALLE 2       // Ball size
#define BR_MAX_BLOCS 24         // Max blocks (6 cols × 4 rows)
#define BR_VIES_DEBUT 3         // Starting lives

// ==========================================================
// VARIABLES DU JEU (Game variables)
// ==========================================================

// État du jeu (Game state)
int br_etatJeu = ETAT_EN_COURS;
int br_score = 0;
int br_vies = BR_VIES_DEBUT;
int br_niveau = 1;

// Raquette (Paddle)
int br_raquetteX = 54;  // Center: (128 - 20) / 2 = 54
int br_raquetteY = 58;

// Balle (Ball)
int br_balleX = 64;
int br_balleY = 50;
int br_balleVX = 2;   // X velocity
int br_balleVY = -2;  // Y velocity (negative = up)
bool br_balleCollee = true;  // Ball stuck to paddle at start

// Blocs (Blocks) - x, y, actif
int8_t br_blocs[BR_MAX_BLOCS][3];
int br_blocsRestants = 0;

// ==========================================================
// CRÉATION DES BLOCS (Block creation)
// ==========================================================

void br_creerBlocs() {
  // 6 colonnes × 4 rangées de blocs (6 cols × 4 rows)
  int idx = 0;
  int largeurBloc = 18;  // Block width
  int hauteurBloc = 5;   // Block height
  int espacementX = 3;   // Horizontal spacing
  int espacementY = 2;   // Vertical spacing
  int debutY = 14;       // Start below score bar
  
  for (int rangee = 0; rangee < 4; rangee++) {
    for (int col = 0; col < 6; col++) {
      if (idx < BR_MAX_BLOCS) {
        br_blocs[idx][0] = col * (largeurBloc + espacementX) + 2;  // x
        br_blocs[idx][1] = debutY + rangee * (hauteurBloc + espacementY);  // y
        br_blocs[idx][2] = 1;  // actif (active)
        idx++;
      }
    }
  }
  br_blocsRestants = BR_MAX_BLOCS;
}

// ==========================================================
// INITIALISATION ET RESET
// ==========================================================

void br_setupJeu() {
  br_creerBlocs();
}

void br_resetJeu() {
  br_etatJeu = ETAT_EN_COURS;
  br_score = 0;
  br_vies = BR_VIES_DEBUT;
  br_niveau = 1;
  br_raquetteX = 54;
  br_balleX = 64;
  br_balleY = 50;
  br_balleVX = 2;
  br_balleVY = -2;
  br_balleCollee = true;
  br_creerBlocs();
}

int br_getEtatJeu() {
  return br_etatJeu;
}

// ==========================================================
// CONTRÔLES (Controls)
// ==========================================================

void br_controles() {
  lireJoystick();
  
  // Déplacer la raquette (Move paddle)
  if (joystickGauche()) {
    br_raquetteX -= BR_VITESSE_RAQUETTE;
    if (br_raquetteX < 0) br_raquetteX = 0;
  }
  if (joystickDroite()) {
    br_raquetteX += BR_VITESSE_RAQUETTE;
    if (br_raquetteX > 128 - BR_LARGEUR_RAQUETTE) {
      br_raquetteX = 128 - BR_LARGEUR_RAQUETTE;
    }
  }
  
  // Lancer la balle (Launch ball)
  if (br_balleCollee && boutonJustePresse()) {
    br_balleCollee = false;
    melodieTir();
  }
}

// ==========================================================
// PHYSIQUE DE LA BALLE (Ball physics)
// ==========================================================

void br_bougerBalle() {
  if (br_balleCollee) {
    // Balle collée à la raquette (Ball stuck to paddle)
    br_balleX = br_raquetteX + BR_LARGEUR_RAQUETTE / 2;
    br_balleY = br_raquetteY - BR_TAILLE_BALLE - 1;
    return;
  }
  
  // Déplacer la balle (Move ball)
  br_balleX += br_balleVX;
  br_balleY += br_balleVY;
  
  // Rebond sur les murs gauche/droite (Bounce on left/right walls)
  if (br_balleX <= 0 || br_balleX >= 128 - BR_TAILLE_BALLE) {
    br_balleVX = -br_balleVX;
    br_balleX = phys_clamp(br_balleX, 0, 128 - BR_TAILLE_BALLE);
    melodieMenuSelect();
  }
  
  // Rebond sur le mur du haut (Bounce on top wall)
  if (br_balleY <= 10) {  // Score bar at top
    br_balleVY = -br_balleVY;
    br_balleY = 10;
    melodieMenuSelect();
  }
  
  // Rebond sur la raquette (Bounce on paddle)
  if (phys_toucheBoite(br_balleX, br_balleY, BR_TAILLE_BALLE, BR_TAILLE_BALLE,
                       br_raquetteX, br_raquetteY, BR_LARGEUR_RAQUETTE, BR_HAUTEUR_RAQUETTE)) {
    br_balleVY = -br_balleVY;
    br_balleY = br_raquetteY - BR_TAILLE_BALLE - 1;
    
    // Changer angle selon où on touche la raquette (Change angle based on hit position)
    int centreRaquette = br_raquetteX + BR_LARGEUR_RAQUETTE / 2;
    int offset = br_balleX - centreRaquette;
    br_balleVX = offset / 4;  // -5 to +5
    if (br_balleVX == 0) br_balleVX = 1;  // Toujours un peu de mouvement X
    
    melodieRecharge();
  }
  
  // Balle tombée en bas (Ball fell down)
  if (br_balleY >= 64) {
    br_vies--;
    if (br_vies <= 0) {
      br_etatJeu = ETAT_TERMINE;
      melodieGameOver();
    } else {
      melodiePasDeMunitions();
      br_balleCollee = true;
      br_balleX = 64;
      br_balleY = 50;
      br_balleVX = 2;
      br_balleVY = -2;
    }
  }
}

// ==========================================================
// COLLISION AVEC LES BLOCS (Block collision)
// ==========================================================

void br_verifierBlocsCollision() {
  if (br_balleCollee) return;
  
  for (int i = 0; i < BR_MAX_BLOCS; i++) {
    if (br_blocs[i][2] == 1) {  // Si bloc actif (If block active)
      int blocX = br_blocs[i][0];
      int blocY = br_blocs[i][1];
      
      if (phys_toucheBoite(br_balleX, br_balleY, BR_TAILLE_BALLE, BR_TAILLE_BALLE,
                           blocX, blocY, 18, 5)) {
        // Détruire le bloc (Destroy block)
        br_blocs[i][2] = 0;
        br_blocsRestants--;
        br_score += 10;
        melodieMonstreTouche();
        
        // Rebond (Bounce)
        br_balleVY = -br_balleVY;
        
        // Vérifier si niveau terminé (Check if level complete)
        if (br_blocsRestants == 0) {
          br_niveau++;
          br_score += 100;
          melodieNiveauSup();
          delay(1000);
          br_creerBlocs();
          br_balleCollee = true;
          br_balleX = 64;
          br_balleY = 50;
          
          // Augmenter vitesse (Increase speed)
          if (br_balleVX > 0) br_balleVX++;
          else br_balleVX--;
          if (br_balleVY > 0) br_balleVY++;
          else br_balleVY--;
        }
        break;  // Un seul bloc à la fois (One block at a time)
      }
    }
  }
}

// ==========================================================
// DESSIN (Drawing)
// ==========================================================

void br_dessinerContenu() {
  // HUD - Score et vies (Score and lives)
  ecrireTexte(0, 0, "Score:", 1);
  ecrireNombre(35, 0, br_score, 1);
  ecrireTexte(70, 0, "Vies:", 1);
  ecrireNombre(100, 0, br_vies, 1);
  dessinerLigne(0, 9, 127, 9);
  
  // Blocs (Blocks)
  for (int i = 0; i < BR_MAX_BLOCS; i++) {
    if (br_blocs[i][2] == 1) {
      dessinerRectangle(br_blocs[i][0], br_blocs[i][1], 18, 5);
    }
  }
  
  // Raquette (Paddle)
  dessinerRectangle(br_raquetteX, br_raquetteY, BR_LARGEUR_RAQUETTE, BR_HAUTEUR_RAQUETTE);
  
  // Balle (Ball)
  dessinerRectangle(br_balleX, br_balleY, BR_TAILLE_BALLE, BR_TAILLE_BALLE);
}

void br_dessiner() {
  DESSINER_ECRAN {
    br_dessinerContenu();
  }
}

// ==========================================================
// ÉCRAN GAME OVER
// ==========================================================

void br_afficherGameOver() {
  DESSINER_ECRAN {
    ecrireTexte(centrerX("GAME OVER", 2), 15, "GAME OVER", 2);
    ecrireTexte(centrerX("Score:", 1), 35, "Score:", 1);
    ecrireNombre(centrerX("0000", 1), 45, br_score, 1);
    ecrireTexte(centrerX("Appuie bouton", 1), 56, "Appuie bouton", 1);
  }
}

// ==========================================================
// BOUCLE PRINCIPALE (Main loop)
// ==========================================================

void br_loopJeu() {
  // Game over
  if (br_etatJeu == ETAT_TERMINE) {
    br_afficherGameOver();
    lireJoystick();
    if (boutonJustePresse()) {
      br_resetJeu();
      melodieRestart();
    }
    return;
  }
  
  // Jeu en cours (Game running)
  br_controles();
  br_bougerBalle();
  br_verifierBlocsCollision();
  br_dessiner();
  delay(30);
}

#endif
