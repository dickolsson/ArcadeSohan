// ==========================================================
// PROGMEM.H - Stockage des données en mémoire Flash
// (Store data in Flash memory instead of RAM)
// ==========================================================
// Ce module permet de stocker des données dans la mémoire
// programme (32KB) au lieu de la RAM (2KB).
// (This module stores data in program memory (32KB)
// instead of RAM (2KB))
//
// Utilisable par TOUS les jeux! (Usable by ALL games!)
// - Données de niveau (Level data)
// - Configuration par niveau (Per-level configuration)
// - Textes et messages (Text and messages)
// - Sprites et images (Sprites and images)
//
// RAM économisée: ~100-200 octets par jeu!
// (RAM saved: ~100-200 bytes per game!)
// ==========================================================

#ifndef PROGMEM_H
#define PROGMEM_H

#include <avr/pgmspace.h>

// ==========================================================
// MACROS GÉNÉRIQUES (Generic macros)
// ==========================================================
// Ces macros permettent de définir n'importe quel type
// de données en PROGMEM facilement.
// (These macros let you define any type of data in PROGMEM)

// Tableau de bytes (Array of bytes) - valeurs 0-255
#define DONNEES_BYTE(nom, ...) \
  const uint8_t nom[] PROGMEM = __VA_ARGS__

// Tableau d'entiers (Array of integers) - valeurs -32768 à 32767
#define DONNEES_INT(nom, ...) \
  const int16_t nom[] PROGMEM = __VA_ARGS__

// Texte (Text string)
#define TEXTE_PROGMEM(nom, texte) \
  const char nom[] PROGMEM = texte

// Alias pour compatibilité (Compatibility aliases)
#define NIVEAU_PROGMEM(nom, ...) DONNEES_BYTE(nom, __VA_ARGS__)
#define SPRITE_PROGMEM(nom, ...) DONNEES_BYTE(nom, __VA_ARGS__)
#define CONFIG_PROGMEM(nom, ...) DONNEES_BYTE(nom, __VA_ARGS__)

// ==========================================================
// FONCTIONS DE LECTURE GÉNÉRIQUES (Generic read functions)
// ==========================================================

// Lire un octet (0-255) depuis PROGMEM
// (Read a byte from PROGMEM)
inline uint8_t pm_lireByte(const uint8_t* tableau, int index) {
  return pgm_read_byte(&tableau[index]);
}

// Lire un entier signé (-32768 à 32767) depuis PROGMEM
// (Read a signed integer from PROGMEM)
inline int16_t pm_lireInt(const int16_t* tableau, int index) {
  return (int16_t)pgm_read_word(&tableau[index]);
}

// ==========================================================
// CHARGEMENT DE TABLEAUX 2D (Loading 2D arrays)
// ==========================================================
// Pour charger des données structurées en colonnes
// (For loading data structured in columns)

// Charger un tableau [n][2] (ex: positions x,y)
// (Load an array [n][2] - e.g., x,y positions)
inline void pm_charger2Colonnes(const uint8_t* source, int dest[][2], int nbLignes) {
  for (int i = 0; i < nbLignes; i++) {
    int base = i * 2;
    dest[i][0] = pgm_read_byte(&source[base]);
    dest[i][1] = pgm_read_byte(&source[base + 1]);
  }
}

// Charger un tableau [n][3] (ex: plateformes x,y,largeur)
// (Load an array [n][3] - e.g., platforms x,y,width)
inline void pm_charger3Colonnes(const uint8_t* source, int dest[][3], int nbLignes) {
  for (int i = 0; i < nbLignes; i++) {
    int base = i * 3;
    dest[i][0] = pgm_read_byte(&source[base]);
    dest[i][1] = pgm_read_byte(&source[base + 1]);
    dest[i][2] = pgm_read_byte(&source[base + 2]);
  }
}

// Charger un tableau [n][4] (ex: objets x,y,largeur,hauteur)
// (Load an array [n][4] - e.g., objects x,y,width,height)
inline void pm_charger4Colonnes(const uint8_t* source, int dest[][4], int nbLignes) {
  for (int i = 0; i < nbLignes; i++) {
    int base = i * 4;
    dest[i][0] = pgm_read_byte(&source[base]);
    dest[i][1] = pgm_read_byte(&source[base + 1]);
    dest[i][2] = pgm_read_byte(&source[base + 2]);
    dest[i][3] = pgm_read_byte(&source[base + 3]);
  }
}

// Alias pour compatibilité (Compatibility alias)
#define pm_chargerNiveau(src, dest, n) pm_charger3Colonnes(src, dest, n)

// ==========================================================
// CHARGEMENT DE POINTS/POSITIONS (Loading points/positions)
// ==========================================================

// Charger une paire de valeurs (x, y)
// (Load a pair of values)
inline void pm_chargerPaire(const uint8_t* source, int* a, int* b) {
  *a = pgm_read_byte(&source[0]);
  *b = pgm_read_byte(&source[1]);
}

// Alias pour compatibilité
#define pm_chargerPorte(src, x, y) pm_chargerPaire(src, x, y)

// ==========================================================
// CONFIGURATION PAR NIVEAU (Per-level configuration)
// ==========================================================
// Parfait pour les jeux avec difficulté progressive!
// (Perfect for games with progressive difficulty!)
//
// Exemple: vitesse monstre par niveau
// CONFIG_PROGMEM(mh_vitessesParNiveau, { 1, 2, 3, 4, 5, 6, 7, 8 });
// int vitesse = pm_lireConfig(mh_vitessesParNiveau, niveau - 1);

inline int pm_lireConfig(const uint8_t* config, int niveau) {
  return pgm_read_byte(&config[niveau]);
}

// Lire config avec valeur par défaut si niveau dépasse le tableau
// (Read config with default value if level exceeds array)
inline int pm_lireConfigOuDefaut(const uint8_t* config, int niveau, int taille, int defaut) {
  if (niveau >= taille) return defaut;
  return pgm_read_byte(&config[niveau]);
}

// ==========================================================
// TEXTE EN PROGMEM (Text in PROGMEM)
// ==========================================================

// Buffer partagé pour lire du texte (max 24 caractères)
#define PM_BUFFER_TAILLE 25
char pm_buffer[PM_BUFFER_TAILLE];

// Lire texte PROGMEM vers buffer RAM
// Usage: ecrireTexte(0, 0, pm_lireTexte(msgBravo), 1);
inline char* pm_lireTexte(const char* texteProgmem) {
  strncpy_P(pm_buffer, texteProgmem, PM_BUFFER_TAILLE - 1);
  pm_buffer[PM_BUFFER_TAILLE - 1] = '\0';
  return pm_buffer;
}

// ==========================================================
// EXEMPLES D'UTILISATION (Usage examples)
// ==========================================================
/*

// ===== PLATFORMER (Aventurier) =====

// Définir un niveau de plateforme
NIVEAU_PROGMEM(av_niveau1, {
  0, 56, 40,     // x, y, largeur
  45, 46, 30,
  80, 38, 30
});

// Charger dans RAM
int av_plat[5][3];
pm_chargerNiveau(av_niveau1, av_plat, 3);


// ===== ACTION GAME (Monster Hunter) =====

// Vitesse du monstre par niveau (index 0 = niveau 1)
CONFIG_PROGMEM(mh_vitesseParNiveau, { 1, 2, 4, 5, 6, 7, 8, 9, 10 });

// Vie du boss par niveau
CONFIG_PROGMEM(mh_vieBossParNiveau, { 3, 4, 5, 6, 7, 8, 9, 10 });

// Points requis par niveau
DONNEES_INT(mh_pointsParNiveau, { 100, 250, 400, 600, 850, 1100 });

// Utilisation:
int vitesse = pm_lireConfig(mh_vitesseParNiveau, niveau - 1);
int vieBoss = pm_lireConfigOuDefaut(mh_vieBossParNiveau, niveau - 1, 8, 10);


// ===== TEXTES =====

TEXTE_PROGMEM(txt_gameOver, "GAME OVER");
TEXTE_PROGMEM(txt_bravo, "BRAVO!");

ecrireTexte(10, 10, pm_lireTexte(txt_gameOver), 2);

*/

#endif
