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
#include "ProgMem.h"     // Pour stocker config en Flash!
#include "Procedural.h"  // Pour génération procédurale!
#include "Physics.h"     // Pour collision et distance!
#include "Personnages.h" // Pour dessiner le joueur!

// ==========================================================
// INFORMATIONS DU JEU (Game information)
// ==========================================================

InfoJeu infoMonsterHunter = {
  "Monster Hunter",      // Nom (Name)
  "Chasse le monstre!"   // Description
};

// ==========================================================
// CONFIGURATION PAR NIVEAU EN PROGMEM
// (Per-level configuration in PROGMEM)
// ==========================================================
// Ces données sont en Flash, pas en RAM!
// Économie: ~30 octets de RAM
// (This data is in Flash, not RAM! Saves ~30 bytes)

// Vitesse de base du monstre par niveau (index 0 = niveau 1)
// (Monster base speed per level)
CONFIG_PROGMEM(mh_configVitesse, {
  1,   // Niveau 1: lent
  2,   // Niveau 2
  4,   // Niveau 3
  5,   // Niveau 4
  6,   // Niveau 5
  7,   // Niveau 6
  8,   // Niveau 7
  9,   // Niveau 8
  10,  // Niveau 9
  11   // Niveau 10+
});
#define MH_CONFIG_VITESSE_TAILLE 10

// Vie du boss par niveau
// (Boss HP per level)
CONFIG_PROGMEM(mh_configVieBoss, {
  3,   // Niveau 1: facile
  4,   // Niveau 2
  5,   // Niveau 3
  5,   // Niveau 4
  6,   // Niveau 5
  6,   // Niveau 6
  7,   // Niveau 7
  8,   // Niveau 8
  9,   // Niveau 9
  10   // Niveau 10+
});
#define MH_CONFIG_VIE_BOSS_TAILLE 10

// Points requis pour passer au niveau suivant
// (Points required for next level)
CONFIG_PROGMEM(mh_configPoints, {
  100,  // Niveau 1 -> 2
  150,  // Niveau 2 -> 3
  200,  // Niveau 3 -> 4
  250,  // Niveau 4+
});
#define MH_CONFIG_POINTS_TAILLE 4

// Textes du jeu en PROGMEM (Game texts in PROGMEM)
// Économie: ~80 octets de RAM
TEXTE_PROGMEM(mh_txtTitre, "MONSTER HUNTER!");
TEXTE_PROGMEM(mh_txtControles1, "Bouge = direction");
TEXTE_PROGMEM(mh_txtControles2, "Bouton = TIRE!");
TEXTE_PROGMEM(mh_txtControles3, "Mange pour recharger!");
TEXTE_PROGMEM(mh_txtGameOver, "GAME OVER");
TEXTE_PROGMEM(mh_txtBoss, "!! BOSS !!");
TEXTE_PROGMEM(mh_txtTire5Fois, "Tire 5 fois!");
TEXTE_PROGMEM(mh_txtRecommencer, "Bouton = Recommencer");

// ==========================================================
// FONCTIONS DE CONFIGURATION (Configuration functions)
// ==========================================================

// Obtenir la vitesse de base pour un niveau
int mh_getVitesseNiveau(int niveau) {
  return pm_lireConfigOuDefaut(mh_configVitesse, niveau - 1, 
                                MH_CONFIG_VITESSE_TAILLE, 11);
}

// Obtenir la vie du boss pour un niveau
int mh_getVieBossNiveau(int niveau) {
  return pm_lireConfigOuDefaut(mh_configVieBoss, niveau - 1,
                                MH_CONFIG_VIE_BOSS_TAILLE, 10);
}

// Obtenir les points requis pour passer un niveau
int mh_getPointsNiveau(int niveau) {
  return pm_lireConfigOuDefaut(mh_configPoints, niveau - 1,
                                MH_CONFIG_POINTS_TAILLE, 250);
}

// ==========================================================
// VARIABLES DU JEU (Game variables)
// ==========================================================

// Position du joueur (Player position)
int mh_joueurX = 64;
int mh_joueurY = 32;
int mh_tailleJoueur = 6;

// Direction du joueur pour vue de dessus (Player direction for top-view)
int mh_direction = DIR_DROITE;

// Dernière direction du joueur pour le tir (Last player direction for shooting)
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
// Note: mh_bonusVitesseNiveau est maintenant dans PROGMEM!

// Compteur monstre (Monster counter)
int mh_compteurMonstre = 0;
int mh_delaiMonstre = 3;

// Score et niveau (Score and level)
int mh_score = 0;
int mh_niveau = 1;
// Note: mh_pointsParNiveau est maintenant dans PROGMEM!
int mh_monstresTues = 0;
int mh_bossTues = 0;

// État du jeu (Game state)
int mh_etatJeu = ETAT_EN_COURS;

// Compteur de spawn pour génération procédurale
// (Spawn counter for procedural generation)
int mh_spawnNourriture = 0;
int mh_spawnMonstre = 0;

// ==========================================================
// FONCTIONS UTILITAIRES (Utility functions)
// ==========================================================
// Note: mh_calculerDistance() supprimé - utilise phys_distance() de Physics.h!
// (Note: mh_calculerDistance() removed - use phys_distance() from Physics.h!)

// Placer la nourriture au hasard (Place food randomly)
// Utilise génération procédurale!
void mh_placerNourriture() {
  mh_spawnNourriture++;
  proc_genererPosition(mh_niveau * 100 + mh_spawnNourriture, 0,
                       &mh_nourritureX, &mh_nourritureY, 10);
  // Ajuster Y pour éviter la barre de score
  if (mh_nourritureY < 15) mh_nourritureY = 15;
}

// Placer le monstre au hasard (Place monster randomly)
// Utilise génération procédurale - loin du joueur!
void mh_placerMonstre() {
  mh_spawnMonstre++;
  int distanceMin = mh_distanceMinMonstre;
  
  if (mh_estBoss) {
    distanceMin = mh_distanceMinMonstre + 10;
  }
  
  // Utiliser proc_genererLoinDe pour spawner loin du joueur!
  proc_genererLoinDe(mh_niveau * 200 + mh_spawnMonstre, 0,
                     &mh_monstreX, &mh_monstreY,
                     mh_joueurX, mh_joueurY, distanceMin, 10);
  
  // Ajuster Y pour éviter la barre de score
  if (mh_monstreY < 12) mh_monstreY = 12;
}

// Vérifier collision avec nourriture (Check collision with food)
// Simplifié avec Physics.h!
bool mh_verifierCollisionNourriture() {
  int seuil = (mh_tailleJoueur + mh_tailleNourriture) / 2 + 3;
  return phys_touchePoint(mh_joueurX, mh_joueurY,
                          mh_nourritureX, mh_nourritureY, seuil);
}

// Vérifier collision avec monstre (Check collision with monster)
// Simplifié avec Physics.h!
bool mh_verifierCollisionMonstre() {
  int seuil = (mh_tailleJoueur + mh_tailleMonstreActuelle) / 2 + 2;
  return phys_touchePoint(mh_joueurX, mh_joueurY,
                          mh_monstreX, mh_monstreY, seuil);
}

// Vérifier collision tir-monstre (Check shot-monster collision)
// Simplifié avec Physics.h!
bool mh_verifierCollisionTirMonstre() {
  int centreMX = mh_monstreX + mh_tailleMonstreActuelle / 2;
  int centreMY = mh_monstreY + mh_tailleMonstreActuelle / 2;
  int seuil = mh_tailleMonstreActuelle / 2 + 2;
  return phys_touchePoint(mh_tirX, mh_tirY, centreMX, centreMY, seuil);
}

// Activer le mode boss (Activate boss mode)
void mh_activerBoss() {
  mh_estBoss = true;
  mh_vieBoss = mh_getVieBossNiveau(mh_niveau);  // Vie depuis PROGMEM!
  mh_vieMaxBoss = mh_vieBoss;
  mh_tailleMonstreActuelle = mh_tailleBoss;
  mh_vitesseMonstre = mh_vitesseMonstreBase + mh_bonusVitesseBoss;
  mh_placerMonstre();
  
  // Afficher alerte BOSS (Show BOSS alert)
  // Note: Utilise DESSINER_ECRAN pour le mode page buffer
  DESSINER_ECRAN {
    ecrireTexte(25, 10, pm_lireTexte(mh_txtBoss), 2);
    ecrireTexteNombre(15, 35, "Niveau ", mh_niveau, 1);
    ecrireTexte(55, 35, "atteint!", 1);
    ecrireTexte(15, 48, pm_lireTexte(mh_txtTire5Fois), 1);
  }
  
  melodieAlerteBoss();
  delay(1500);
}

// Vérifier et mettre à jour le niveau (Check and update level)
void mh_verifierNiveau() {
  // Calculer le niveau basé sur les points (PROGMEM config)
  int pointsRequis = 0;
  int nouveauNiveau = 1;
  
  for (int i = 0; i < 20; i++) {
    pointsRequis = pointsRequis + mh_getPointsNiveau(i + 1);
    if (mh_score >= pointsRequis) {
      nouveauNiveau = i + 2;
    } else {
      break;
    }
  }
  
  if (nouveauNiveau > mh_niveau) {
    mh_niveau = nouveauNiveau;
    // Vitesse depuis PROGMEM!
    mh_vitesseMonstre = mh_getVitesseNiveau(mh_niveau);
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

// Buffer pour la barre de statut (Status bar buffer)
char mh_statusBuffer[32];

// Dessiner le contenu du jeu (Draw game content) - appelé dans la boucle page
void mh_dessinerContenu() {
  // Score et niveau en haut (Score and level at top)
  // Format: "Nv:X XXXp Tir:X" ou avec boss
  if (mh_estBoss) {
    sprintf(mh_statusBuffer, "Nv:%d %dp B:%d/%d", mh_niveau, mh_score, mh_vieBoss, mh_vieMaxBoss);
  } else {
    sprintf(mh_statusBuffer, "Nv:%d %dp Tir:%d", mh_niveau, mh_score, mh_munitions);
  }
  ecrireTexte(0, 0, mh_statusBuffer, 1);
  
  // Ligne sous le score (Line under score)
  dessinerLigne(0, 9, 127, 9);
  
  // Joueur - utilise Personnages.h vue de dessus!
  // (Player - uses Personnages.h top-view!)
  pers_dessinerVueHaut(mh_joueurX, mh_joueurY, mh_tailleJoueur, 
                       personnageActuel, mh_direction);
  
  // Nourriture (Food)
  dessinerCercle(mh_nourritureX, mh_nourritureY, mh_tailleNourriture / 2);
  
  // Tir (Shot)
  if (mh_tirActif) {
    dessinerRectangle(mh_tirX, mh_tirY, 2, 2);
  }
  
  // Monstre (Monster)
  mh_dessinerMonstre();
}

// Dessiner le jeu (Draw the game)
void mh_dessinerJeu() {
  DESSINER_ECRAN {
    mh_dessinerContenu();
  }
}

// Fin du jeu (Game over)
void mh_finDuJeu() {
  mh_etatJeu = ETAT_TERMINE;
  
  melodieGameOver();
  
  DESSINER_ECRAN {
    ecrireTexte(10, 0, pm_lireTexte(mh_txtGameOver), 2);
    
    sprintf(mh_statusBuffer, "Score:%d Nv:%d", mh_score, mh_niveau);
    ecrireTexte(10, 22, mh_statusBuffer, 1);
    
    sprintf(mh_statusBuffer, "Monstres:%d Boss:%d", mh_monstresTues, mh_bossTues);
    ecrireTexte(10, 34, mh_statusBuffer, 1);
    
    ecrireTexte(5, 56, pm_lireTexte(mh_txtRecommencer), 1);
  }
}

// ==========================================================
// FONCTIONS PRINCIPALES DU JEU (Main game functions)
// ==========================================================

// Préparer le jeu (Setup the game)
void mh_setupJeu() {
  // Afficher instructions (Show instructions)
  effacerEcran();
  ecrireTexte(20, 10, pm_lireTexte(mh_txtTitre), 1);
  ecrireTexte(10, 25, pm_lireTexte(mh_txtControles1), 1);
  ecrireTexte(10, 37, pm_lireTexte(mh_txtControles2), 1);
  ecrireTexte(10, 52, pm_lireTexte(mh_txtControles3), 1);
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
  mh_direction = DIR_DROITE;
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
  mh_spawnNourriture = 0;
  mh_spawnMonstre = 0;
  
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
    mh_direction = DIR_GAUCHE;
  }
  if (joystickDroite()) {
    mh_joueurX = mh_joueurX + mh_vitesseJoueur;
    mh_derniereDirectionX = 1;
    mh_derniereDirectionY = 0;
    mh_direction = DIR_DROITE;
  }
  if (joystickHaut()) {
    mh_joueurY = mh_joueurY - mh_vitesseJoueur;
    mh_derniereDirectionY = -1;
    mh_derniereDirectionX = 0;
    mh_direction = DIR_HAUT;
  }
  if (joystickBas()) {
    mh_joueurY = mh_joueurY + mh_vitesseJoueur;
    mh_derniereDirectionY = 1;
    mh_derniereDirectionX = 0;
    mh_direction = DIR_BAS;
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
        // Vitesse depuis PROGMEM!
        mh_vitesseMonstre = mh_getVitesseNiveau(mh_niveau);
        mh_vitesseMonstreBase = mh_vitesseMonstre;
      }
    }
  }
  
  // ===== MOUVEMENT DU MONSTRE (MONSTER MOVEMENT) =====
  // Simplifié avec Physics.h!
  mh_compteurMonstre = mh_compteurMonstre + mh_vitesseMonstre;
  
  if (mh_compteurMonstre >= mh_delaiMonstre) {
    mh_compteurMonstre = 0;
    // Utilise phys_bougerVers pour suivre le joueur!
    phys_bougerVers(&mh_monstreX, &mh_monstreY, mh_joueurX, mh_joueurY, 1);
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
