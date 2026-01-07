// ==========================================================
// ARCADE SOHAN - Console de jeux Arduino!
// (ARCADE SOHAN - Arduino Game Console!)
// ==========================================================
// Ce fichier est le programme principal.
// Il affiche le menu et lance les jeux!
// (This file is the main program.
// It shows the menu and launches games!)
// ==========================================================

// Inclure tous les modules (Include all modules)
#include "Display.h"    // Écran OLED (OLED screen)
#include "Input.h"      // Joystick et bouton (Joystick and button)
#include "Melodies.h"   // Sons et mélodies (Sounds and melodies)
#include "GameBase.h"   // Structure des jeux (Game structure)
#include "Menu.h"       // Menu principal (Main menu)

// Inclure les jeux (Include games)
#include "MonsterHunter.h"  // Jeu Monster Hunter
#include "Aventurier.h"     // TEST: include mais pas dans menu

// ==========================================================
// ÉTATS DU SYSTÈME (System states)
// ==========================================================

#define SYSTEME_DEMARRAGE 0   // Écran de démarrage (Startup screen)
#define SYSTEME_MENU 1        // Menu de sélection (Selection menu)
#define SYSTEME_JEU 2         // En train de jouer (Playing)

int etatSysteme = SYSTEME_DEMARRAGE;  // État actuel (Current state)
int jeuActuel = -1;                    // Jeu en cours (-1 = aucun) (Current game, -1 = none)

// ==========================================================
// SETUP - Préparation du système
// ==========================================================

void setup() {
  // Configurer les entrées (Configure inputs)
  setupInput();
  
  // Configurer le buzzer (Configure buzzer)
  setupBuzzer();
  
  // Démarrer l'écran (Start screen)
  if (!setupDisplay()) {
    // Erreur - écran non trouvé!  (Error - screen not found!)
    while (true);  // Arrêter ici (Stop here)
  }
  
  // Ajouter les jeux au menu (Add games to menu)
  // Pour ajouter un nouveau jeu, ajoute une ligne ici!
  // (To add a new game, add a line here!)
  menu_ajouterJeu(infoMonsterHunter.nom);
  menu_ajouterJeu(infoAventurier.nom);  // TEST ACTIVE
  
  // Afficher l'écran de démarrage (Show startup screen)
  menu_afficherDemarrage();
  
  // Attendre que le joueur appuie (Wait for player to press)
  menu_attendreBouton();
  
  // Passer au menu (Go to menu)
  etatSysteme = SYSTEME_MENU;
}

// ==========================================================
// LOOP - Boucle principale
// ==========================================================

void loop() {
  // Selon l'état du système (Depending on system state)
  
  // ===== MENU =====
  if (etatSysteme == SYSTEME_MENU) {
    // Mettre à jour le menu (Update menu)
    int selection = menu_update();
    
    // Si un jeu a été sélectionné (If a game was selected)
    if (selection >= 0) {
      jeuActuel = selection;
      etatSysteme = SYSTEME_JEU;
      
      // Lancer le jeu sélectionné (Launch selected game)
      lancerJeu(jeuActuel);
    }
  }
  
  // ===== JEU EN COURS =====
  if (etatSysteme == SYSTEME_JEU) {
    // Exécuter la boucle du jeu (Run game loop)
    executerJeu(jeuActuel);
  }
}

// ==========================================================
// FONCTIONS DE GESTION DES JEUX (Game management functions)
// ==========================================================

// Lancer un jeu (Launch a game)
void lancerJeu(int numeroJeu) {
  // Choisir quel jeu lancer (Choose which game to launch)
  
  if (numeroJeu == 0) {
    // Monster Hunter!
    mh_resetJeu();
    mh_setupJeu();
  }
  
  if (numeroJeu == 1) {
    // Aventurier!
    av_resetJeu();
    av_setupJeu();
  }
}

// Exécuter la boucle d'un jeu (Run a game's loop)
void executerJeu(int numeroJeu) {
  if (numeroJeu == 0) {
    // Monster Hunter!
    mh_loopJeu();
  }
  
  if (numeroJeu == 1) {
    // Aventurier!
    av_loopJeu();
  }
}
