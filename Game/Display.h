// ==========================================================
// DISPLAY.H - Fonctions d'affichage OLED
// (OLED display functions)
// ==========================================================
// Ce fichier contient les fonctions pour l'écran OLED.
// Réutilisable dans tous les jeux et le menu!
// (This file contains OLED screen functions - reusable everywhere!)
// ==========================================================

#ifndef DISPLAY_H
#define DISPLAY_H

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Configuration de l'écran OLED (OLED screen configuration)
#define LARGEUR_ECRAN 128  // Largeur en pixels (Width in pixels)
#define HAUTEUR_ECRAN 64   // Hauteur en pixels (Height in pixels)

// L'objet écran - utilisé partout dans le programme!
// (The screen object - used everywhere in the program!)
Adafruit_SSD1306 ecran(LARGEUR_ECRAN, HAUTEUR_ECRAN, &Wire, -1);

// ==========================================================
// FONCTION DE CONFIGURATION (Setup function)
// ==========================================================

// Démarrer l'écran OLED (Start OLED screen)
// Retourne true si l'écran fonctionne (Returns true if screen works)
bool setupDisplay() {
  if (!ecran.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    // Erreur - écran non trouvé!  (Error - screen not found!)
    return false;
  }
  
  // Initialiser le générateur de nombres aléatoires (Initialize random number generator)
  randomSeed(analogRead(A2));
  
  // Effacer l'écran (Clear screen)
  ecran.clearDisplay();
  ecran.display();
  
  return true;
}

// ==========================================================
// FONCTIONS D'AFFICHAGE DE BASE (Basic display functions)
// ==========================================================

// Effacer l'écran (Clear the screen)
void effacerEcran() {
  ecran.clearDisplay();
}

// Afficher le contenu (Show the content)
void afficherEcran() {
  ecran.display();
}

// ==========================================================
// FONCTIONS DE TEXTE (Text functions)
// ==========================================================

// Écrire du texte à une position (Write text at a position)
// taille = 1 (petit), 2 (moyen), 3 (grand)
// (size = 1 small, 2 medium, 3 large)
void ecrireTexte(int x, int y, const char* texte, int taille = 1) {
  ecran.setTextSize(taille);
  ecran.setTextColor(SSD1306_WHITE);
  ecran.setCursor(x, y);
  ecran.print(texte);
}

// Écrire du texte avec un nombre (Write text with a number)
void ecrireTexteNombre(int x, int y, const char* texte, int nombre, int taille = 1) {
  ecran.setTextSize(taille);
  ecran.setTextColor(SSD1306_WHITE);
  ecran.setCursor(x, y);
  ecran.print(texte);
  ecran.print(nombre);
}

// Écrire juste un nombre (Write just a number)
void ecrireNombre(int x, int y, int nombre, int taille = 1) {
  ecran.setTextSize(taille);
  ecran.setTextColor(SSD1306_WHITE);
  ecran.setCursor(x, y);
  ecran.print(nombre);
}

// Centrer du texte horizontalement (Center text horizontally)
// Pour taille 1: chaque caractère = 6 pixels de large
// Pour taille 2: chaque caractère = 12 pixels de large
// (For size 1: each char = 6 pixels wide, size 2: 12 pixels)
int centrerX(const char* texte, int taille = 1) {
  int longueur = strlen(texte);
  int largeurCaractere = 6 * taille;
  int largeurTexte = longueur * largeurCaractere;
  return (LARGEUR_ECRAN - largeurTexte) / 2;
}

// ==========================================================
// FONCTIONS DE DESSIN (Drawing functions)
// ==========================================================

// Dessiner un rectangle plein (Draw filled rectangle)
void dessinerRectangle(int x, int y, int largeur, int hauteur) {
  ecran.fillRect(x, y, largeur, hauteur, SSD1306_WHITE);
}

// Dessiner un cercle plein (Draw filled circle)
void dessinerCercle(int x, int y, int rayon) {
  ecran.fillCircle(x, y, rayon, SSD1306_WHITE);
}

// Dessiner une ligne (Draw a line)
void dessinerLigne(int x1, int y1, int x2, int y2) {
  ecran.drawLine(x1, y1, x2, y2, SSD1306_WHITE);
}

// Dessiner un triangle plein (Draw filled triangle)
void dessinerTriangle(int x1, int y1, int x2, int y2, int x3, int y3) {
  ecran.fillTriangle(x1, y1, x2, y2, x3, y3, SSD1306_WHITE);
}

// Dessiner un rectangle vide (contour) (Draw empty rectangle - outline)
void dessinerContour(int x, int y, int largeur, int hauteur) {
  ecran.drawRect(x, y, largeur, hauteur, SSD1306_WHITE);
}

// ==========================================================
// ÉCRANS SPÉCIAUX (Special screens)
// ==========================================================

// Afficher un écran de titre (Show a title screen)
void afficherTitre(const char* titre, const char* sousTitre = nullptr) {
  effacerEcran();
  
  // Titre centré en haut (Centered title at top)
  int xTitre = centrerX(titre, 2);
  ecrireTexte(xTitre, 15, titre, 2);
  
  // Sous-titre si fourni (Subtitle if provided)
  if (sousTitre != nullptr) {
    int xSousTitre = centrerX(sousTitre, 1);
    ecrireTexte(xSousTitre, 40, sousTitre, 1);
  }
  
  afficherEcran();
}

// Afficher "Appuie pour continuer" (Show "Press to continue")
void afficherAppuieContinuer() {
  ecrireTexte(5, 56, "Appuie pour jouer!", 1);
}

#endif
