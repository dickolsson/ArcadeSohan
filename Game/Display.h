// ==========================================================
// DISPLAY.H - Fonctions d'affichage OLED (U8g2 Page Buffer)
// (OLED display functions using U8g2 page buffer mode)
// ==========================================================
// OPTIMISÉ pour Arduino Uno:
// - Buffer page: 128 octets (au lieu de 1024!)
// - Polices compactes pour économiser la Flash
// - Variables minimales en RAM
// ==========================================================

#ifndef DISPLAY_H
#define DISPLAY_H

#include <Wire.h>
#include <U8g2lib.h>

// Configuration de l'écran OLED (OLED screen configuration)
#define LARGEUR_ECRAN 128
#define HAUTEUR_ECRAN 64

// L'objet écran U8g2 en mode page buffer (128 octets!)
// "_1_" = page buffer mode
U8G2_SSD1306_128X64_NONAME_1_HW_I2C ecran(U8G2_R0, U8X8_PIN_NONE);

// ==========================================================
// CONFIGURATION DES POLICES (Font configuration)
// ==========================================================
// Seulement 2 polices pour économiser la Flash!
// u8g2_font_6x10_tf  = taille 1 (petit, pour le texte)
// u8g2_font_7x14_tf  = taille 2+ (moyen, pour les titres)

// Taille de police actuelle (évite les appels setFont inutiles)
static int8_t _taillePoliceActuelle = 0;

// Largeur et hauteur de baseline pour chaque taille
static const int8_t _largeurPolice[] = { 6, 7, 7 };
static const int8_t _hauteurPolice[] = { 8, 12, 12 };

// Sélectionner la police selon la taille (avec cache)
inline void _selectionnerPolice(int8_t taille) {
  if (taille == _taillePoliceActuelle) return;  // Déjà sélectionnée!
  _taillePoliceActuelle = taille;
  
  if (taille >= 2) {
    ecran.setFont(u8g2_font_7x14_tf);   // Medium font
  } else {
    ecran.setFont(u8g2_font_6x10_tf);   // Small font
  }
}

// ==========================================================
// FONCTION DE CONFIGURATION (Setup function)
// ==========================================================

bool setupDisplay() {
  ecran.begin();
  ecran.setFont(u8g2_font_6x10_tf);
  _taillePoliceActuelle = 1;
  
  // Initialiser le générateur de nombres aléatoires
  randomSeed(analogRead(A2));
  
  return true;
}

// ==========================================================
// FONCTIONS DE TEXTE (Text functions)
// ==========================================================

// Buffer partagé pour les nombres (taille minimale: "-32768" = 6 + texte)
// (Shared buffer for numbers - minimal size)
static char _buffer[12];

// Écrire du texte à une position
// taille = 1 (petit), 2 (moyen), 3 (grand)
inline void ecrireTexte(int x, int y, const char* texte, int8_t taille = 1) {
  _selectionnerPolice(taille);
  ecran.drawStr(x, y + _hauteurPolice[taille - 1], texte);
}

// Écrire du texte avec un nombre
void ecrireTexteNombre(int x, int y, const char* texte, int nombre, int8_t taille = 1) {
  _selectionnerPolice(taille);
  
  // Construire la chaîne directement
  char* p = _buffer;
  const char* t = texte;
  while (*t) *p++ = *t++;
  itoa(nombre, p, 10);
  
  ecran.drawStr(x, y + _hauteurPolice[taille - 1], _buffer);
}

// Écrire juste un nombre
inline void ecrireNombre(int x, int y, int nombre, int8_t taille = 1) {
  _selectionnerPolice(taille);
  itoa(nombre, _buffer, 10);
  ecran.drawStr(x, y + _hauteurPolice[taille - 1], _buffer);
}

// Centrer du texte horizontalement
int centrerX(const char* texte, int8_t taille = 1) {
  int8_t largeur = _largeurPolice[taille - 1];
  return (LARGEUR_ECRAN - (strlen(texte) * largeur)) / 2;
}

// ==========================================================
// FONCTIONS DE DESSIN (Drawing functions)
// ==========================================================

inline void dessinerRectangle(int x, int y, int largeur, int hauteur) {
  ecran.drawBox(x, y, largeur, hauteur);
}

inline void dessinerCercle(int x, int y, int rayon) {
  ecran.drawDisc(x, y, rayon);
}

inline void dessinerLigne(int x1, int y1, int x2, int y2) {
  ecran.drawLine(x1, y1, x2, y2);
}

inline void dessinerTriangle(int x1, int y1, int x2, int y2, int x3, int y3) {
  ecran.drawTriangle(x1, y1, x2, y2, x3, y3);
}

inline void dessinerContour(int x, int y, int largeur, int hauteur) {
  ecran.drawFrame(x, y, largeur, hauteur);
}

inline void dessinerPixel(int x, int y) {
  ecran.drawPixel(x, y);
}

// ==========================================================
// FONCTIONS LEGACY (pour compatibilité)
// ==========================================================
// Ces fonctions ne font rien mais évitent les erreurs de compilation
// si du vieux code les utilise encore.

inline void effacerEcran() { }
inline void afficherEcran() { }

// ==========================================================
// FONCTIONS D'AFFICHAGE SIMPLE (Simple display functions)
// ==========================================================

// Afficher un écran de titre
void afficherTitre(const char* titre, const char* sousTitre = nullptr) {
  ecran.firstPage();
  do {
    int xTitre = centrerX(titre, 2);
    ecrireTexte(xTitre, 15, titre, 2);
    
    if (sousTitre != nullptr) {
      int xSousTitre = centrerX(sousTitre, 1);
      ecrireTexte(xSousTitre, 40, sousTitre, 1);
    }
  } while (ecran.nextPage());
}

// Afficher "Appuie pour continuer"
inline void afficherAppuieContinuer() {
  ecrireTexte(5, 56, "Appuie pour jouer!", 1);
}

// ==========================================================
// MACRO POUR LE RENDU (Render macro)
// ==========================================================
// Utilise cette macro pour dessiner:
//
//   DESSINER_ECRAN {
//     dessinerRectangle(10, 10, 20, 20);
//     ecrireTexte(0, 0, "Score:", 1);
//   }
//
#define DESSINER_ECRAN \
  for (bool _p = (ecran.firstPage(), true); _p || ecran.nextPage(); _p = false)

#endif
