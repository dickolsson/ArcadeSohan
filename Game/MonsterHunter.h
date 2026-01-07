// ==========================================================
// MONSTER_HUNTER.H - Jeu de chasse au monstre!
// (Monster Hunter Game!)
// ==========================================================
// Échappe au monstre triangle et tire dessus!
// (Escape the triangle monster and shoot it!)
// ==========================================================

#ifndef MONSTER_HUNTER_H
#define MONSTER_HUNTER_H

#include "GameBase.h"
#include "Display.h"
#include "Input.h"
#include "Melodies.h"

// ==========================================================
// INFORMATIONS DU JEU (Game information)
// ==========================================================

InfoJeu infoMonsterHunter = {
  "Monster Hunter",      // Nom (Name)
  "Chasse le monstre!"   // Description
};

// ==========================================================
// VARIABLES DU JEU (Game variables)
// ==========================================================

// Position du joueur (Player position)
int mh_joueurX = 64;
int mh_joueurY = 32;
int mh_tailleJoueur = 6;

// Dernière direction du joueur (Last player direction)
int mh_derniereDirectionX = 1;
int mh_derniereDirectionY = 0;

// Position de la nourriture (Food position)
int mh_nourritureX = 0;
int mh_nourritureY = 0;
int mh_tailleNourriture = 4;

// Position du monstre (Monster position)
int mh_monstreX = 0;
int mh_monstreY = 0;
int mh_tailleMonstre = 8;
int mh_tailleMonstreActuelle = 8;
int mh_distanceMinMonstre = 40;

// Configuration du Boss (Boss configuration)
bool mh_estBoss = false;
int mh_tailleBoss = 14;
int mh_vieBoss = 0;
int mh_vieMaxBoss = 5;
int mh_bonusVitesseBoss = 2;

// Position du tir (Shot position)
int mh_tirX = 0;
int mh_tirY = 0;
int mh_tirDirectionX = 0;
int mh_tirDirectionY = 0;
bool mh_tirActif = false;
int mh_vitesseTir = 4;

// Munitions (Ammo)
int mh_munitions = 3;
int mh_munitionsMax = 3;

// Vitesses (Speeds)
int mh_vitesseJoueur = 3;
int mh_vitesseMonstre = 1;
int mh_vitesseMonstreBase = 1;
int mh_vitesseMonstreMax = 8;
int mh_bonusVitesseNourriture = 2;
int mh_bonusVitesseNiveau = 3;

// Compteur monstre (Monster counter)
int mh_compteurMonstre = 0;
int mh_delaiMonstre = 3;

// Score et niveau (Score and level)
int mh_score = 0;
int mh_niveau = 1;
int mh_pointsParNiveau = 250;
int mh_monstresTues = 0;
int mh_bossTues = 0;

// État du jeu (Game state)
int mh_etatJeu = ETAT_EN_COURS;

// ==========================================================
// FONCTIONS UTILITAIRES (Utility functions)
// ==========================================================

// Calculer la distance entre deux points (Calculate distance between two points)
int mh_calculerDistance(int x1, int y1, int x2, int y2) {
  int diffX = x1 - x2;
  int diffY = y1 - y2;
  
  if (diffX < 0) diffX = -diffX;
  if (diffY < 0) diffY = -diffY;
  
  if (diffX > diffY) {
    return diffX + diffY / 2;
  } else {
    return diffY + diffX / 2;
  }
}

// Placer la nourriture au hasard (Place food randomly)
void mh_placerNourriture() {
  mh_nourritureX = random(10, LARGEUR_ECRAN - 10);
  mh_nourritureY = random(15, HAUTEUR_ECRAN - 10);
}

// Placer le monstre au hasard (Place monster randomly)
void mh_placerMonstre() {
  int tentatives = 0;
  int maxTentatives = 20;
  int distance = 0;
  int distanceMin = mh_distanceMinMonstre;
  
  if (mh_estBoss) {
    distanceMin = mh_distanceMinMonstre + 10;
  }
  
  do {
    int coin = random(0, 4);
    
    if (coin == 0) {
      mh_monstreX = random(5, 30);
      mh_monstreY = random(12, 25);
    }
    if (coin == 1) {
      mh_monstreX = random(90, 115);
      mh_monstreY = random(12, 25);
    }
    if (coin == 2) {
      mh_monstreX = random(5, 30);
      mh_monstreY = random(45, 55);
    }
    if (coin == 3) {
      mh_monstreX = random(90, 115);
      mh_monstreY = random(45, 55);
    }
    
    distance = mh_calculerDistance(mh_monstreX, mh_monstreY, mh_joueurX, mh_joueurY);
    tentatives = tentatives + 1;
    
  } while (distance < distanceMin && tentatives < maxTentatives);
  
  if (distance < distanceMin) {
    if (mh_joueurX < LARGEUR_ECRAN / 2) {
      mh_monstreX = random(90, 115);
    } else {
      mh_monstreX = random(5, 30);
    }
    
    if (mh_joueurY < HAUTEUR_ECRAN / 2) {
      mh_monstreY = random(45, 55);
    } else {
      mh_monstreY = random(12, 25);
    }
  }
}

// Vérifier collision avec nourriture (Check collision with food)
bool mh_verifierCollisionNourriture() {
  int distanceX = mh_joueurX - mh_nourritureX;
  int distanceY = mh_joueurY - mh_nourritureY;
  
  if (distanceX < 0) distanceX = -distanceX;
  if (distanceY < 0) distanceY = -distanceY;
  
  if (distanceX < (mh_tailleJoueur + mh_tailleNourriture) / 2 + 3) {
    if (distanceY < (mh_tailleJoueur + mh_tailleNourriture) / 2 + 3) {
      return true;
    }
  }
  return false;
}

// Vérifier collision avec monstre (Check collision with monster)
bool mh_verifierCollisionMonstre() {
  int distanceX = mh_joueurX - mh_monstreX;
  int distanceY = mh_joueurY - mh_monstreY;
  
  if (distanceX < 0) distanceX = -distanceX;
  if (distanceY < 0) distanceY = -distanceY;
  
  if (distanceX < (mh_tailleJoueur + mh_tailleMonstreActuelle) / 2 + 2) {
    if (distanceY < (mh_tailleJoueur + mh_tailleMonstreActuelle) / 2 + 2) {
      return true;
    }
  }
  return false;
}

// Vérifier collision tir-monstre (Check shot-monster collision)
bool mh_verifierCollisionTirMonstre() {
  int distanceX = mh_tirX - mh_monstreX - mh_tailleMonstreActuelle / 2;
  int distanceY = mh_tirY - mh_monstreY - mh_tailleMonstreActuelle / 2;
  
  if (distanceX < 0) distanceX = -distanceX;
  if (distanceY < 0) distanceY = -distanceY;
  
  if (distanceX < mh_tailleMonstreActuelle / 2 + 2) {
    if (distanceY < mh_tailleMonstreActuelle / 2 + 2) {
      return true;
    }
  }
  return false;
}

// Activer le mode boss (Activate boss mode)
void mh_activerBoss() {
  mh_estBoss = true;
  mh_vieBoss = mh_vieMaxBoss;
  mh_tailleMonstreActuelle = mh_tailleBoss;
  mh_vitesseMonstre = mh_vitesseMonstreBase + mh_bonusVitesseBoss;
  mh_placerMonstre();
  
  // Afficher alerte BOSS (Show BOSS alert)
  effacerEcran();
  ecrireTexte(25, 10, "!! BOSS !!", 2);
  ecrireTexteNombre(15, 35, "Niveau ", mh_niveau, 1);
  ecran.print(" atteint!");
  ecrireTexte(15, 48, "Tire 5 fois!", 1);
  afficherEcran();
  
  melodieAlerteBoss();
  delay(1500);
}

// Vérifier et mettre à jour le niveau (Check and update level)
void mh_verifierNiveau() {
  int nouveauNiveau = (mh_score / mh_pointsParNiveau) + 1;
  
  if (nouveauNiveau > mh_niveau) {
    mh_niveau = nouveauNiveau;
    mh_vitesseMonstre = mh_vitesseMonstre + mh_bonusVitesseNiveau;
    mh_vitesseMonstreBase = mh_vitesseMonstre;
    
    melodieNiveauSup();
    mh_activerBoss();
  }
}

// Dessiner le monstre triangle (Draw triangle monster)
void mh_dessinerMonstre() {
  int pointeX = mh_monstreX;
  int pointeY = mh_monstreY;
  int base1X = mh_monstreX;
  int base1Y = mh_monstreY;
  int base2X = mh_monstreX;
  int base2Y = mh_monstreY;
  
  int diffX = mh_joueurX - mh_monstreX;
  int diffY = mh_joueurY - mh_monstreY;
  int absDiffX = diffX < 0 ? -diffX : diffX;
  int absDiffY = diffY < 0 ? -diffY : diffY;
  
  int taille = mh_tailleMonstreActuelle;
  
  if (absDiffX > absDiffY) {
    if (diffX > 0) {
      pointeX = mh_monstreX + taille;
      pointeY = mh_monstreY + taille / 2;
      base1X = mh_monstreX;
      base1Y = mh_monstreY;
      base2X = mh_monstreX;
      base2Y = mh_monstreY + taille;
    } else {
      pointeX = mh_monstreX;
      pointeY = mh_monstreY + taille / 2;
      base1X = mh_monstreX + taille;
      base1Y = mh_monstreY;
      base2X = mh_monstreX + taille;
      base2Y = mh_monstreY + taille;
    }
  } else {
    if (diffY > 0) {
      pointeX = mh_monstreX + taille / 2;
      pointeY = mh_monstreY + taille;
      base1X = mh_monstreX;
      base1Y = mh_monstreY;
      base2X = mh_monstreX + taille;
      base2Y = mh_monstreY;
    } else {
      pointeX = mh_monstreX + taille / 2;
      pointeY = mh_monstreY;
      base1X = mh_monstreX;
      base1Y = mh_monstreY + taille;
      base2X = mh_monstreX + taille;
      base2Y = mh_monstreY + taille;
    }
  }
  
  dessinerTriangle(pointeX, pointeY, base1X, base1Y, base2X, base2Y);
}

// Dessiner le jeu (Draw the game)
void mh_dessinerJeu() {
  effacerEcran();
  
  // Score et niveau en haut (Score and level at top)
  ecran.setTextSize(1);
  ecran.setTextColor(SSD1306_WHITE);
  ecran.setCursor(0, 0);
  ecran.print("Nv:");
  ecran.print(mh_niveau);
  ecran.print(" ");
  ecran.print(mh_score);
  ecran.print("p");
  ecran.print(" Tir:");
  ecran.print(mh_munitions);
  
  if (mh_estBoss) {
    ecran.print(" B:");
    ecran.print(mh_vieBoss);
    ecran.print("/");
    ecran.print(mh_vieMaxBoss);
  }
  
  // Ligne sous le score (Line under score)
  dessinerLigne(0, 9, 127, 9);
  
  // Joueur (Player)
  dessinerRectangle(mh_joueurX, mh_joueurY, mh_tailleJoueur, mh_tailleJoueur);
  
  // Nourriture (Food)
  dessinerCercle(mh_nourritureX, mh_nourritureY, mh_tailleNourriture / 2);
  
  // Tir (Shot)
  if (mh_tirActif) {
    dessinerRectangle(mh_tirX, mh_tirY, 2, 2);
  }
  
  // Monstre (Monster)
  mh_dessinerMonstre();
  
  afficherEcran();
}

// Fin du jeu (Game over)
void mh_finDuJeu() {
  mh_etatJeu = ETAT_TERMINE;
  
  melodieGameOver();
  
  effacerEcran();
  ecrireTexte(10, 0, "GAME OVER", 2);
  
  ecrireTexteNombre(10, 22, "Score: ", mh_score, 1);
  ecran.print(" Nv:");
  ecran.print(mh_niveau);
  
  ecrireTexteNombre(10, 34, "Monstres: ", mh_monstresTues, 1);
  ecran.print(" Boss: ");
  ecran.print(mh_bossTues);
  
  ecrireTexte(5, 56, "Bouton = Recommencer", 1);
  
  afficherEcran();
}

// ==========================================================
// FONCTIONS PRINCIPALES DU JEU (Main game functions)
// ==========================================================

// Préparer le jeu (Setup the game)
void mh_setupJeu() {
  // Afficher instructions (Show instructions)
  effacerEcran();
  ecrireTexte(20, 10, "MONSTER HUNTER!", 1);
  ecrireTexte(10, 25, "Bouge = direction", 1);
  ecrireTexte(10, 37, "Bouton = TIRE!", 1);
  ecrireTexte(10, 52, "Mange pour recharger!", 1);
  afficherEcran();
  
  melodieStartup();
  delay(2500);
  
  // Placer nourriture et monstre (Place food and monster)
  mh_placerNourriture();
  mh_placerMonstre();
  
  mh_etatJeu = ETAT_EN_COURS;
}

// Réinitialiser le jeu (Reset the game)
void mh_resetJeu() {
  mh_joueurX = 64;
  mh_joueurY = 32;
  mh_derniereDirectionX = 1;
  mh_derniereDirectionY = 0;
  mh_score = 0;
  mh_niveau = 1;
  mh_monstresTues = 0;
  mh_bossTues = 0;
  mh_vitesseMonstre = 1;
  mh_vitesseMonstreBase = 1;
  mh_compteurMonstre = 0;
  mh_tirActif = false;
  mh_munitions = mh_munitionsMax;
  mh_estBoss = false;
  mh_vieBoss = 0;
  mh_tailleMonstreActuelle = mh_tailleMonstre;
  mh_etatJeu = ETAT_EN_COURS;
  
  mh_placerNourriture();
  mh_placerMonstre();
  
  melodieRestart();
}

// Boucle principale du jeu (Main game loop)
void mh_loopJeu() {
  // Si le jeu est terminé (If game is over)
  if (mh_etatJeu == ETAT_TERMINE) {
    lireJoystick();
    if (boutonJustePresse()) {
      mh_resetJeu();
    }
    return;
  }
  
  // Lire le joystick (Read joystick)
  lireJoystick();
  
  // ===== MOUVEMENT DU JOUEUR (PLAYER MOVEMENT) =====
  if (joystickGauche()) {
    mh_joueurX = mh_joueurX - mh_vitesseJoueur;
    mh_derniereDirectionX = -1;
    mh_derniereDirectionY = 0;
  }
  if (joystickDroite()) {
    mh_joueurX = mh_joueurX + mh_vitesseJoueur;
    mh_derniereDirectionX = 1;
    mh_derniereDirectionY = 0;
  }
  if (joystickHaut()) {
    mh_joueurY = mh_joueurY - mh_vitesseJoueur;
    mh_derniereDirectionY = -1;
    mh_derniereDirectionX = 0;
  }
  if (joystickBas()) {
    mh_joueurY = mh_joueurY + mh_vitesseJoueur;
    mh_derniereDirectionY = 1;
    mh_derniereDirectionX = 0;
  }
  
  // Garder le joueur dans l'écran (Keep player on screen)
  if (mh_joueurX < 0) mh_joueurX = 0;
  if (mh_joueurX > LARGEUR_ECRAN - mh_tailleJoueur) mh_joueurX = LARGEUR_ECRAN - mh_tailleJoueur;
  if (mh_joueurY < 10) mh_joueurY = 10;
  if (mh_joueurY > HAUTEUR_ECRAN - mh_tailleJoueur) mh_joueurY = HAUTEUR_ECRAN - mh_tailleJoueur;
  
  // ===== TIR DU JOUEUR (PLAYER SHOOTING) =====
  if (boutonJustePresse() && !mh_tirActif) {
    if (mh_munitions > 0) {
      mh_tirActif = true;
      mh_tirX = mh_joueurX + mh_tailleJoueur / 2;
      mh_tirY = mh_joueurY + mh_tailleJoueur / 2;
      mh_tirDirectionX = mh_derniereDirectionX;
      mh_tirDirectionY = mh_derniereDirectionY;
      mh_munitions = mh_munitions - 1;
      melodieTir();
    } else {
      melodiePasDeMunitions();
    }
  }
  
  // Déplacer le tir (Move the shot)
  if (mh_tirActif) {
    mh_tirX = mh_tirX + mh_tirDirectionX * mh_vitesseTir;
    mh_tirY = mh_tirY + mh_tirDirectionY * mh_vitesseTir;
    
    // Vérifier si hors écran (Check if off screen)
    if (mh_tirX < 0 || mh_tirX > LARGEUR_ECRAN || mh_tirY < 10 || mh_tirY > HAUTEUR_ECRAN) {
      mh_tirActif = false;
    }
    
    // Vérifier collision avec monstre (Check collision with monster)
    if (mh_verifierCollisionTirMonstre()) {
      mh_tirActif = false;
      
      if (mh_estBoss) {
        mh_vieBoss = mh_vieBoss - 1;
        melodieBossTouche();
        
        if (mh_vieBoss <= 0) {
          mh_bossTues = mh_bossTues + 1;
          mh_monstresTues = mh_monstresTues + 1;
          mh_score = mh_score + 50;
          melodieVictoireBoss();
          
          mh_estBoss = false;
          mh_tailleMonstreActuelle = mh_tailleMonstre;
          mh_vitesseMonstre = mh_vitesseMonstreBase;
          mh_placerMonstre();
        }
      } else {
        mh_monstresTues = mh_monstresTues + 1;
        mh_score = mh_score + 25;
        melodieMonstreTouche();
        mh_verifierNiveau();
        mh_placerMonstre();
        mh_vitesseMonstre = 1 + (mh_niveau - 1) * mh_bonusVitesseNiveau;
        mh_vitesseMonstreBase = mh_vitesseMonstre;
      }
    }
  }
  
  // ===== MOUVEMENT DU MONSTRE (MONSTER MOVEMENT) =====
  mh_compteurMonstre = mh_compteurMonstre + mh_vitesseMonstre;
  
  if (mh_compteurMonstre >= mh_delaiMonstre) {
    mh_compteurMonstre = 0;
    
    if (mh_monstreX < mh_joueurX) mh_monstreX = mh_monstreX + 1;
    if (mh_monstreX > mh_joueurX) mh_monstreX = mh_monstreX - 1;
    if (mh_monstreY < mh_joueurY) mh_monstreY = mh_monstreY + 1;
    if (mh_monstreY > mh_joueurY) mh_monstreY = mh_monstreY - 1;
  }
  
  // Vérifier collision avec nourriture (Check collision with food)
  if (mh_verifierCollisionNourriture()) {
    mh_score = mh_score + 10;
    mh_munitions = mh_munitionsMax;
    melodieRecharge();
    mh_verifierNiveau();
    mh_placerNourriture();
    
    mh_vitesseMonstre = mh_vitesseMonstre + mh_bonusVitesseNourriture;
    int vitesseMax = mh_vitesseMonstreMax + (mh_niveau - 1) * 2;
    if (mh_vitesseMonstre > vitesseMax) mh_vitesseMonstre = vitesseMax;
    mh_vitesseMonstreBase = mh_vitesseMonstre;
    
    if (mh_estBoss) {
      mh_vitesseMonstre = mh_vitesseMonstreBase + mh_bonusVitesseBoss;
    }
  }
  
  // Vérifier collision avec monstre (Check collision with monster)
  if (mh_verifierCollisionMonstre()) {
    mh_finDuJeu();
    return;
  }
  
  // Dessiner le jeu (Draw the game)
  mh_dessinerJeu();
  
  delay(30);
}

// Obtenir l'état du jeu (Get game state)
int mh_getEtatJeu() {
  return mh_etatJeu;
}

// Mettre l'état du jeu (Set game state)
void mh_setEtatJeu(int etat) {
  mh_etatJeu = etat;
}

#endif
