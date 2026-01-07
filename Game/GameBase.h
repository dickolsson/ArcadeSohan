// ==========================================================
// GAME_BASE.H - Structure de base pour les jeux
// (Base structure for games)
// ==========================================================
// Ce fichier définit comment un jeu doit fonctionner.
// Chaque jeu doit avoir les mêmes fonctions!
// (This file defines how a game should work.
// Each game must have the same functions!)
// ==========================================================

#ifndef GAME_BASE_H
#define GAME_BASE_H

// ==========================================================
// ÉTATS DU JEU (Game states)
// ==========================================================
// Ces constantes représentent ce que fait le jeu maintenant
// (These constants represent what the game is doing now)

#define ETAT_EN_COURS 0    // Le jeu tourne! (Game is running!)
#define ETAT_PAUSE 1       // Le jeu est en pause (Game is paused)
#define ETAT_TERMINE 2     // Le jeu est fini (Game is over)
#define ETAT_QUITTER 3     // Retour au menu (Return to menu)

// ==========================================================
// INFORMATIONS SUR LES JEUX (Game information)
// ==========================================================
// Combien de jeux on peut avoir au maximum (Max games we can have)
#define MAX_JEUX 10

// Structure pour décrire un jeu dans le menu
// (Structure to describe a game in the menu)
struct InfoJeu {
  const char* nom;         // Nom du jeu affiché dans le menu (Game name shown in menu)
  const char* description; // Petite description (Short description)
};

// ==========================================================
// EXPLICATION DU SYSTÈME (System explanation)
// ==========================================================
// Chaque jeu DOIT avoir ces fonctions:
// (Each game MUST have these functions:)
//
// 1. setupJeu()    - Prépare le jeu au démarrage (Prepares the game at start)
// 2. loopJeu()     - Boucle principale du jeu (Main game loop)
// 3. resetJeu()    - Remet le jeu à zéro (Resets the game)
// 4. getEtatJeu()  - Dit si le jeu est fini (Says if game is over)
//
// Ces fonctions sont définies dans chaque fichier de jeu!
// (These functions are defined in each game file!)
// ==========================================================

#endif
