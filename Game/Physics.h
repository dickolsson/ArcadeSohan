// ==========================================================
// PHYSICS.H - Collision et physique de base
// (Collision and basic physics)
// ==========================================================
// Fonctions réutilisables pour TOUS les jeux!
// Coût RAM: 0 (fonctions inline)
// (Reusable functions for ALL games! RAM cost: 0)
// ==========================================================

#ifndef PHYSICS_H
#define PHYSICS_H

// ==========================================================
// FONCTIONS DE DISTANCE (Distance functions)
// ==========================================================

// Distance Manhattan - la plus rapide! (Fastest!)
// Bonne pour collision simple. (Good for simple collision.)
inline int phys_distanceManhattan(int x1, int y1, int x2, int y2) {
  int dx = x1 - x2;
  int dy = y1 - y2;
  if (dx < 0) dx = -dx;
  if (dy < 0) dy = -dy;
  return dx + dy;
}

// Distance approximative (plus précise, un peu plus lente)
// Approximate Euclidean (more precise, slightly slower)
// Formule: max(dx,dy) + min(dx,dy)/2
inline int phys_distance(int x1, int y1, int x2, int y2) {
  int dx = x1 - x2;
  int dy = y1 - y2;
  if (dx < 0) dx = -dx;
  if (dy < 0) dy = -dy;
  if (dx > dy) return dx + dy / 2;
  return dy + dx / 2;
}

// ==========================================================
// FONCTIONS DE COLLISION (Collision functions)
// ==========================================================

// Collision par distance - deux points sont proches?
// (Distance collision - two points are close?)
// Parfait pour: joueur touche nourriture, balle touche ennemi
// (Perfect for: player touches food, bullet hits enemy)
inline bool phys_touchePoint(int x1, int y1, int x2, int y2, int distance) {
  int dx = x1 - x2;
  int dy = y1 - y2;
  if (dx < 0) dx = -dx;
  if (dy < 0) dy = -dy;
  return (dx < distance && dy < distance);
}

// Collision boîte - deux rectangles se chevauchent?
// (Box collision - two rectangles overlap?)
// Parfait pour: plateformes, murs, portes
inline bool phys_toucheBoite(int x1, int y1, int w1, int h1,
                              int x2, int y2, int w2, int h2) {
  if (x1 + w1 < x2) return false;
  if (x2 + w2 < x1) return false;
  if (y1 + h1 < y2) return false;
  if (y2 + h2 < y1) return false;
  return true;
}

// Point dans un rectangle?
// (Point inside rectangle?)
// Parfait pour: souris dans bouton, joueur dans zone
inline bool phys_pointDansBoite(int px, int py,
                                 int bx, int by, int bw, int bh) {
  return (px >= bx && px <= bx + bw && py >= by && py <= by + bh);
}

// Collision cercle - pour objets ronds
// (Circle collision - for round objects)
inline bool phys_toucheCercle(int x1, int y1, int r1,
                               int x2, int y2, int r2) {
  int dist = phys_distance(x1, y1, x2, y2);
  return (dist < r1 + r2);
}

// ==========================================================
// FONCTIONS DE MOUVEMENT (Movement functions)
// ==========================================================

// Limiter une valeur entre min et max (Clamp value)
inline int phys_clamp(int valeur, int minimum, int maximum) {
  if (valeur < minimum) return minimum;
  if (valeur > maximum) return maximum;
  return valeur;
}

// Bouger vers une cible (Move toward target)
// Parfait pour: ennemis qui suivent le joueur!
// (Perfect for: enemies chasing the player!)
inline void phys_bougerVers(int* x, int* y, int cibleX, int cibleY, int vitesse) {
  if (*x < cibleX) *x = *x + vitesse;
  else if (*x > cibleX) *x = *x - vitesse;
  if (*y < cibleY) *y = *y + vitesse;
  else if (*y > cibleY) *y = *y - vitesse;
}

// Bouger loin d'une menace (Move away from threat)
// Parfait pour: IA de fuite
inline void phys_fuirDe(int* x, int* y, int menaceX, int menaceY, int vitesse) {
  if (*x < menaceX) *x = *x - vitesse;
  else if (*x > menaceX) *x = *x + vitesse;
  if (*y < menaceY) *y = *y - vitesse;
  else if (*y > menaceY) *y = *y + vitesse;
}

// Garder une position dans l'écran (Keep position on screen)
// marge = distance des bords (margin = distance from edges)
inline void phys_clampEcran(int* x, int* y, int marge, int margeHaut) {
  if (*x < marge) *x = marge;
  if (*x > 128 - marge) *x = 128 - marge;
  if (*y < margeHaut) *y = margeHaut;
  if (*y > 64 - marge) *y = 64 - marge;
}

// Version simple avec marge uniforme (Simple version with uniform margin)
inline void phys_clampEcranSimple(int* x, int* y, int marge) {
  phys_clampEcran(x, y, marge, marge);
}

#endif
