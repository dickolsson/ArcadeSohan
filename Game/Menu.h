// ==========================================================
// MENU.H - Menu principal pour choisir un jeu
// (Main menu to choose a game)
// ==========================================================
// Ce fichier affiche le menu et laisse le joueur choisir!
// (This file shows the menu and lets the player choose!)
// ==========================================================

#ifndef MENU_H
#define MENU_H

#include "Display.h"
#include "Input.h"
#include "Melodies.h"
#include "GameBase.h"

// ==========================================================
// VARIABLES DU MENU (Menu variables)
// ==========================================================

// Jeu sélectionné actuellement (Currently selected game)
int menu_jeuSelectionne = 0;

// Nombre de jeux disponibles (Number of available games)
int menu_nombreJeux = 0;

// Liste des noms de jeux (List of game names)
const char* menu_nomsJeux[MAX_JEUX];

// Délai pour éviter le mouvement trop rapide (Delay to avoid too fast movement)
unsigned long menu_dernierMouvement = 0;
int menu_delaiMouvement = 200;  // 200 millisecondes entre chaque mouvement

// ==========================================================
// FONCTIONS DU MENU (Menu functions)
// ==========================================================

// Ajouter un jeu au menu (Add a game to the menu)
void menu_ajouterJeu(const char* nom) {
  if (menu_nombreJeux < MAX_JEUX) {
    menu_nomsJeux[menu_nombreJeux] = nom;
    menu_nombreJeux = menu_nombreJeux + 1;
  }
}

// Dessiner le menu (Draw the menu)
void menu_dessiner() {
  effacerEcran();
  
  // Titre du menu (Menu title)
  ecrireTexte(15, 0, "ARCADE SOHAN", 1);
  dessinerLigne(0, 10, 127, 10);
  
  // Afficher les jeux (Show games)
  for (int i = 0; i < menu_nombreJeux; i++) {
    int y = 15 + i * 12;  // Position verticale (Vertical position)
    
    // Si c'est le jeu sélectionné, afficher une flèche
    // (If it's the selected game, show an arrow)
    if (i == menu_jeuSelectionne) {
      ecrireTexte(5, y, ">", 1);
      // Dessiner un rectangle autour (Draw rectangle around)
      dessinerContour(15, y - 2, 110, 12);
    }
    
    // Afficher le nom du jeu (Show game name)
    ecrireTexte(20, y, menu_nomsJeux[i], 1);
  }
  
  // Instructions en bas (Instructions at bottom)
  ecrireTexte(5, 55, "Haut/Bas + Bouton", 1);
  
  afficherEcran();
}

// Mettre à jour le menu (Update the menu)
// Retourne -1 si rien sélectionné, sinon le numéro du jeu
// (Returns -1 if nothing selected, else the game number)
int menu_update() {
  lireJoystick();
  
  // Vérifier le délai (Check delay)
  unsigned long maintenant = millis();
  
  if (maintenant - menu_dernierMouvement > menu_delaiMouvement) {
    // Mouvement vers le haut (Move up)
    if (joystickHaut()) {
      if (menu_jeuSelectionne > 0) {
        menu_jeuSelectionne = menu_jeuSelectionne - 1;
        melodieMenuSelect();
        menu_dernierMouvement = maintenant;
      }
    }
    
    // Mouvement vers le bas (Move down)
    if (joystickBas()) {
      if (menu_jeuSelectionne < menu_nombreJeux - 1) {
        menu_jeuSelectionne = menu_jeuSelectionne + 1;
        melodieMenuSelect();
        menu_dernierMouvement = maintenant;
      }
    }
  }
  
  // Vérifier le bouton pour confirmer (Check button to confirm)
  if (boutonJustePresse()) {
    melodieConfirm();
    delay(200);
    return menu_jeuSelectionne;
  }
  
  // Dessiner le menu (Draw menu)
  menu_dessiner();
  
  return -1;  // Rien sélectionné (Nothing selected)
}

// Afficher l'écran de démarrage (Show startup screen)
void menu_afficherDemarrage() {
  effacerEcran();
  
  // Titre principal (Main title)
  ecrireTexte(22, 5, "ARCADE SOHAN", 1);
  
  // Décoration (Decoration)
  dessinerLigne(0, 15, 127, 15);
  
  // Sous-titre (Subtitle)
  ecrireTexte(25, 22, "Console de jeux", 1);
  ecrireTexte(35, 32, "Arduino!", 1);
  
  // Instructions (Instructions)
  ecrireTexte(5, 55, "Appuie pour jouer!", 1);
  
  afficherEcran();
  
  melodieStartup();
}

// Attendre que le joueur appuie (Wait for player to press)
void menu_attendreBouton() {
  // Attendre que le bouton soit relâché d'abord
  // (Wait for button to be released first)
  while (digitalRead(JOYSTICK_BUTTON) == LOW) {
    delay(10);
  }
  
  // Attendre une nouvelle pression
  // (Wait for new press)
  while (digitalRead(JOYSTICK_BUTTON) == HIGH) {
    delay(10);
  }
  
  melodieConfirm();
  delay(200);
}

#endif
