// ==========================================================
// MELODIES.H - Mélodies et sons réutilisables
// (Reusable melodies and sounds)
// ==========================================================
// Ce fichier contient toutes les mélodies du jeu.
// Tu peux les utiliser dans n'importe quel jeu!
// (This file contains all game melodies - use them in any game!)
// ==========================================================

#ifndef MELODIES_H
#define MELODIES_H

// La broche du buzzer (Buzzer pin)
#define BUZZER_PIN 8

// ==========================================================
// FONCTION DE CONFIGURATION (Setup function)
// ==========================================================

// Configurer le buzzer (Configure the buzzer)
void setupBuzzer() {
  pinMode(BUZZER_PIN, OUTPUT);
}

// ==========================================================
// MÉLODIES DU MENU (Menu melodies)
// ==========================================================

// Son de démarrage du système (System startup sound)
// Joue 3 notes qui montent!  (Plays 3 rising notes!)
void melodieStartup() {
  tone(BUZZER_PIN, 523, 100);  // Do (C)
  delay(150);
  tone(BUZZER_PIN, 659, 100);  // Mi (E)
  delay(150);
  tone(BUZZER_PIN, 784, 200);  // Sol (G)
  delay(300);
  noTone(BUZZER_PIN);
}

// Son de sélection dans le menu (Menu selection sound)
void melodieMenuSelect() {
  tone(BUZZER_PIN, 1000, 50);
  delay(50);
  noTone(BUZZER_PIN);
}

// Son de confirmation (Confirmation sound)
void melodieConfirm() {
  tone(BUZZER_PIN, 800, 80);
  delay(100);
  tone(BUZZER_PIN, 1200, 100);
  delay(100);
  noTone(BUZZER_PIN);
}

// ==========================================================
// MÉLODIES DE JEU (Game melodies)
// ==========================================================

// Son de tir (Shooting sound)
void melodieTir() {
  tone(BUZZER_PIN, 1500, 30);
  delay(30);
  noTone(BUZZER_PIN);
}

// Son de pas de munitions (No ammo sound)
void melodiePasDeMunitions() {
  tone(BUZZER_PIN, 150, 100);
  delay(100);
  noTone(BUZZER_PIN);
}

// Son de rechargement (Reload sound)
void melodieRecharge() {
  tone(BUZZER_PIN, 880, 50);
  delay(50);
  tone(BUZZER_PIN, 1100, 50);
  delay(50);
  tone(BUZZER_PIN, 1320, 50);
  noTone(BUZZER_PIN);
}

// Son quand monstre touché (Monster hit sound)
void melodieMonstreTouche() {
  tone(BUZZER_PIN, 600, 50);
  delay(60);
  tone(BUZZER_PIN, 800, 50);
  delay(60);
  tone(BUZZER_PIN, 1000, 100);
  noTone(BUZZER_PIN);
}

// Son quand boss touché (Boss hit sound)
void melodieBossTouche() {
  tone(BUZZER_PIN, 400, 50);
  delay(60);
  tone(BUZZER_PIN, 600, 50);
  noTone(BUZZER_PIN);
}

// ==========================================================
// MÉLODIES DE VICTOIRE (Victory melodies)
// ==========================================================

// Son de niveau supérieur (Level up sound)
void melodieNiveauSup() {
  tone(BUZZER_PIN, 523, 100);
  delay(100);
  tone(BUZZER_PIN, 659, 100);
  delay(100);
  tone(BUZZER_PIN, 784, 100);
  delay(100);
  tone(BUZZER_PIN, 1047, 200);
  noTone(BUZZER_PIN);
}

// Son de victoire contre le boss (Boss defeat sound)
void melodieVictoireBoss() {
  tone(BUZZER_PIN, 523, 100);
  delay(100);
  tone(BUZZER_PIN, 659, 100);
  delay(100);
  tone(BUZZER_PIN, 784, 100);
  delay(100);
  tone(BUZZER_PIN, 1047, 300);
  noTone(BUZZER_PIN);
}

// ==========================================================
// MÉLODIES DE DÉFAITE (Defeat melodies)
// ==========================================================

// Son de défaite / game over (Defeat / game over sound)
void melodieGameOver() {
  tone(BUZZER_PIN, 400, 200);
  delay(250);
  tone(BUZZER_PIN, 300, 200);
  delay(250);
  tone(BUZZER_PIN, 200, 400);
  delay(500);
  noTone(BUZZER_PIN);
}

// ==========================================================
// MÉLODIES D'ALERTE (Alert melodies)
// ==========================================================

// Son d'alerte du boss (Boss alert sound)
void melodieAlerteBoss() {
  tone(BUZZER_PIN, 200, 200);
  delay(250);
  tone(BUZZER_PIN, 200, 200);
  delay(250);
  tone(BUZZER_PIN, 200, 200);
  delay(250);
  tone(BUZZER_PIN, 400, 400);
  noTone(BUZZER_PIN);
}

// Son de redémarrage (Restart sound)
void melodieRestart() {
  tone(BUZZER_PIN, 523, 100);
  delay(100);
  noTone(BUZZER_PIN);
}

#endif
