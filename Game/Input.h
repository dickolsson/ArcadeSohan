// ==========================================================
// INPUT.H - Contrôles du joystick et bouton
// (Joystick and button controls)
// ==========================================================
// Ce fichier gère le joystick et le bouton.
// Réutilisable dans tous les jeux!
// (This file handles joystick and button - reusable in all games!)
// ==========================================================

#ifndef INPUT_H
#define INPUT_H

// Broches du joystick (Joystick pins)
#define JOYSTICK_X A0
#define JOYSTICK_Y A1
#define JOYSTICK_BUTTON 7

// Seuils pour détecter le mouvement (Thresholds to detect movement)
#define SEUIL_BAS 400      // En dessous = négatif (Below = negative)
#define SEUIL_HAUT 600     // Au dessus = positif (Above = positive)

// Structure pour stocker l'état du joystick (Structure to store joystick state)
// Plus facile à comprendre qu'une liste de variables!
// (Easier to understand than a list of variables!)
struct EtatJoystick {
  int valeurX;       // Valeur brute X (0-1023) (Raw X value)
  int valeurY;       // Valeur brute Y (0-1023) (Raw Y value)
  int directionX;    // -1 = gauche, 0 = centre, 1 = droite (left/center/right)
  int directionY;    // -1 = haut, 0 = centre, 1 = bas (up/center/down)
  bool boutonPresse; // true si le bouton est enfoncé (true if button pressed)
};

// Variable globale pour l'état du joystick (Global variable for joystick state)
EtatJoystick joystick;

// Variable pour éviter les tirs répétés (Variable to avoid repeated shots)
bool boutonEtaitPresse = false;

// ==========================================================
// FONCTION DE CONFIGURATION (Setup function)
// ==========================================================

// Configurer les entrées du joystick (Configure joystick inputs)
void setupInput() {
  pinMode(JOYSTICK_BUTTON, INPUT_PULLUP);
}

// ==========================================================
// FONCTIONS DE LECTURE (Reading functions)
// ==========================================================

// Lire le joystick et mettre à jour l'état (Read joystick and update state)
void lireJoystick() {
  // Lire les valeurs analogiques (Read analog values)
  joystick.valeurX = analogRead(JOYSTICK_X);
  joystick.valeurY = analogRead(JOYSTICK_Y);
  
  // Calculer la direction X (Calculate X direction)
  if (joystick.valeurX < SEUIL_BAS) {
    joystick.directionX = -1;  // Gauche (Left)
  } else if (joystick.valeurX > SEUIL_HAUT) {
    joystick.directionX = 1;   // Droite (Right)
  } else {
    joystick.directionX = 0;   // Centre (Center)
  }
  
  // Calculer la direction Y (Calculate Y direction)
  if (joystick.valeurY < SEUIL_BAS) {
    joystick.directionY = -1;  // Haut (Up)
  } else if (joystick.valeurY > SEUIL_HAUT) {
    joystick.directionY = 1;   // Bas (Down)
  } else {
    joystick.directionY = 0;   // Centre (Center)
  }
  
  // Lire le bouton (Read button)
  joystick.boutonPresse = (digitalRead(JOYSTICK_BUTTON) == LOW);
}

// Vérifier si le bouton vient d'être pressé (Check if button was just pressed)
// Retourne true une seule fois par pression!
// (Returns true only once per press!)
bool boutonJustePresse() {
  bool resultat = false;
  
  // Si le bouton est pressé maintenant mais ne l'était pas avant
  // (If button is pressed now but wasn't before)
  if (joystick.boutonPresse && !boutonEtaitPresse) {
    resultat = true;
  }
  
  // Mémoriser l'état actuel pour la prochaine fois
  // (Remember current state for next time)
  boutonEtaitPresse = joystick.boutonPresse;
  
  return resultat;
}

// Vérifier si le joystick bouge vers le haut (Check if joystick moving up)
bool joystickHaut() {
  return joystick.directionY == -1;
}

// Vérifier si le joystick bouge vers le bas (Check if joystick moving down)
bool joystickBas() {
  return joystick.directionY == 1;
}

// Vérifier si le joystick bouge vers la gauche (Check if joystick moving left)
bool joystickGauche() {
  return joystick.directionX == -1;
}

// Vérifier si le joystick bouge vers la droite (Check if joystick moving right)
bool joystickDroite() {
  return joystick.directionX == 1;
}

#endif
