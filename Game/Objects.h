// ==========================================================
// OBJECTS.H - Gestion d'objets de jeu (Game object pools)
// ==========================================================
// Pour gérer plusieurs objets: collectibles, ennemis, balles
// Coût RAM: configurable par jeu
// (For managing multiple objects: collectibles, enemies, bullets)
// (RAM cost: configurable per game)
// ==========================================================

#ifndef OBJECTS_H
#define OBJECTS_H

#include "Physics.h"
#include "Procedural.h"

// ==========================================================
// CONFIGURATION (Configuration)
// ==========================================================
// Chaque jeu définit sa propre taille de pool!
// (Each game defines its own pool size!)

// Taille maximale recommandée par pool (Max recommended pool size)
// ATTENTION: Arduino a très peu de RAM!
// (WARNING: Arduino has very little RAM!)
#define OBJETS_MAX_RECOMMANDE 6

// ==========================================================
// STRUCTURE OBJET SIMPLE (Simple object structure)
// ==========================================================
// Un objet = position + état actif
// Coût: 5 octets par objet (5 bytes per object)

struct ObjetSimple {
  int8_t x;       // Position X (0-127)
  int8_t y;       // Position Y (0-63)
  int8_t type;    // Type d'objet (0 = inactif, 1+ = type)
  bool actif;     // Est visible/actif? (Is visible/active?)
};

// ==========================================================
// STRUCTURE OBJET MOBILE (Moving object structure)
// ==========================================================
// Objet avec vitesse - pour balles, ennemis qui bougent
// Coût: 7 octets par objet (7 bytes per object)

struct ObjetMobile {
  int8_t x;       // Position X
  int8_t y;       // Position Y
  int8_t vx;      // Vitesse X (velocity X)
  int8_t vy;      // Vitesse Y (velocity Y)
  int8_t type;    // Type d'objet (0 = inactif)
  bool actif;     // Est visible/actif?
};

// ==========================================================
// FONCTIONS POUR OBJETS SIMPLES (Simple object functions)
// ==========================================================

// Initialiser un pool d'objets (Initialize object pool)
// Met tous les objets à inactif
inline void obj_initialiser(ObjetSimple* pool, int taille) {
  for (int i = 0; i < taille; i++) {
    pool[i].x = 0;
    pool[i].y = 0;
    pool[i].type = 0;
    pool[i].actif = false;
  }
}

// Compter les objets actifs (Count active objects)
inline int obj_compterActifs(ObjetSimple* pool, int taille) {
  int compte = 0;
  for (int i = 0; i < taille; i++) {
    if (pool[i].actif) compte++;
  }
  return compte;
}

// Trouver un slot libre (Find free slot)
// Retourne -1 si aucun slot libre
// (Returns -1 if no free slot)
inline int obj_trouverLibre(ObjetSimple* pool, int taille) {
  for (int i = 0; i < taille; i++) {
    if (!pool[i].actif) return i;
  }
  return -1;
}

// Créer un objet à position donnée (Create object at given position)
// Retourne l'index, ou -1 si pool plein
inline int obj_creer(ObjetSimple* pool, int taille, 
                     int x, int y, int type) {
  int index = obj_trouverLibre(pool, taille);
  if (index >= 0) {
    pool[index].x = x;
    pool[index].y = y;
    pool[index].type = type;
    pool[index].actif = true;
  }
  return index;
}

// Créer à position procédurale (Create at procedural position)
// Utilise Procedural.h pour générer la position
inline int obj_creerProc(ObjetSimple* pool, int taille,
                         int seed, int index, int type, int marge) {
  int slot = obj_trouverLibre(pool, taille);
  if (slot >= 0) {
    int px, py;
    proc_genererPosition(seed, index, &px, &py, marge);
    pool[slot].x = px;
    pool[slot].y = py;
    pool[slot].type = type;
    pool[slot].actif = true;
  }
  return slot;
}

// Supprimer un objet (Remove an object)
inline void obj_supprimer(ObjetSimple* pool, int index) {
  pool[index].actif = false;
  pool[index].type = 0;
}

// Supprimer tous les objets (Remove all objects)
inline void obj_supprimerTous(ObjetSimple* pool, int taille) {
  for (int i = 0; i < taille; i++) {
    pool[i].actif = false;
    pool[i].type = 0;
  }
}

// Vérifier collision avec un point (Check collision with a point)
// Retourne l'index de l'objet touché, ou -1
inline int obj_touchePoint(ObjetSimple* pool, int taille,
                            int x, int y, int distance) {
  for (int i = 0; i < taille; i++) {
    if (pool[i].actif) {
      if (phys_touchePoint(pool[i].x, pool[i].y, x, y, distance)) {
        return i;
      }
    }
  }
  return -1;
}

// Vérifier collision avec un autre pool (Cross-pool collision)
// Retourne l'index dans pool1, met l'index pool2 dans *indexPool2
inline int obj_touchePool(ObjetSimple* pool1, int taille1,
                          ObjetSimple* pool2, int taille2,
                          int distance, int* indexPool2) {
  for (int i = 0; i < taille1; i++) {
    if (pool1[i].actif) {
      for (int j = 0; j < taille2; j++) {
        if (pool2[j].actif) {
          if (phys_touchePoint(pool1[i].x, pool1[i].y,
                               pool2[j].x, pool2[j].y, distance)) {
            *indexPool2 = j;
            return i;
          }
        }
      }
    }
  }
  return -1;
}

// ==========================================================
// FONCTIONS POUR OBJETS MOBILES (Moving object functions)
// ==========================================================

// Initialiser un pool mobile (Initialize mobile pool)
inline void objm_initialiser(ObjetMobile* pool, int taille) {
  for (int i = 0; i < taille; i++) {
    pool[i].x = 0;
    pool[i].y = 0;
    pool[i].vx = 0;
    pool[i].vy = 0;
    pool[i].type = 0;
    pool[i].actif = false;
  }
}

// Trouver slot libre (Find free slot)
inline int objm_trouverLibre(ObjetMobile* pool, int taille) {
  for (int i = 0; i < taille; i++) {
    if (!pool[i].actif) return i;
  }
  return -1;
}

// Créer objet mobile (Create moving object)
// Parfait pour: balles, ennemis avec direction
inline int objm_creer(ObjetMobile* pool, int taille,
                      int x, int y, int vx, int vy, int type) {
  int index = objm_trouverLibre(pool, taille);
  if (index >= 0) {
    pool[index].x = x;
    pool[index].y = y;
    pool[index].vx = vx;
    pool[index].vy = vy;
    pool[index].type = type;
    pool[index].actif = true;
  }
  return index;
}

// Supprimer objet mobile (Remove mobile object)
inline void objm_supprimer(ObjetMobile* pool, int index) {
  pool[index].actif = false;
  pool[index].type = 0;
}

// Supprimer tous les objets mobiles (Remove all mobile objects)
inline void objm_supprimerTous(ObjetMobile* pool, int taille) {
  for (int i = 0; i < taille; i++) {
    pool[i].actif = false;
    pool[i].type = 0;
  }
}

// Bouger tous les objets selon leur vitesse (Move all by velocity)
// Supprime ceux qui sortent de l'écran
inline void objm_bougerTous(ObjetMobile* pool, int taille, int marge) {
  for (int i = 0; i < taille; i++) {
    if (pool[i].actif) {
      pool[i].x = pool[i].x + pool[i].vx;
      pool[i].y = pool[i].y + pool[i].vy;
      
      // Hors écran? Supprimer! (Off screen? Remove!)
      if (pool[i].x < -marge || pool[i].x > 128 + marge ||
          pool[i].y < -marge || pool[i].y > 64 + marge) {
        pool[i].actif = false;
      }
    }
  }
}

// Bouger vers une cible (Move toward target)
// Parfait pour: ennemis qui suivent le joueur
inline void objm_bougerVersCible(ObjetMobile* pool, int taille,
                                  int cibleX, int cibleY) {
  for (int i = 0; i < taille; i++) {
    if (pool[i].actif) {
      int vit = 1;  // Vitesse fixe
      if (pool[i].x < cibleX) pool[i].x += vit;
      else if (pool[i].x > cibleX) pool[i].x -= vit;
      if (pool[i].y < cibleY) pool[i].y += vit;
      else if (pool[i].y > cibleY) pool[i].y -= vit;
    }
  }
}

// Vérifier collision avec un point (Check collision with a point)
inline int objm_touchePoint(ObjetMobile* pool, int taille,
                             int x, int y, int distance) {
  for (int i = 0; i < taille; i++) {
    if (pool[i].actif) {
      if (phys_touchePoint(pool[i].x, pool[i].y, x, y, distance)) {
        return i;
      }
    }
  }
  return -1;
}

// ==========================================================
// MACROS PRATIQUES (Convenience macros)
// ==========================================================

// Boucle sur tous les objets actifs (Loop over active objects)
// Usage: POUR_CHAQUE_OBJET(monPool, 6, obj) { dessiner(obj.x, obj.y); }
#define POUR_CHAQUE_OBJET(pool, taille, var) \
  for (int _i = 0; _i < taille; _i++) \
    if ((pool)[_i].actif) \
      for (ObjetSimple& var = (pool)[_i]; &var == &(pool)[_i]; )

// Boucle sur tous les objets mobiles actifs
#define POUR_CHAQUE_MOBILE(pool, taille, var) \
  for (int _i = 0; _i < taille; _i++) \
    if ((pool)[_i].actif) \
      for (ObjetMobile& var = (pool)[_i]; &var == &(pool)[_i]; )

#endif
