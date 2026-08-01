const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("\n--- DÉMARRAGE DES TESTS FRONTEND (Build & Intégrité) ---\n");

const frontendPath = path.join(__dirname, '../FRONTEND/islam app');

try {
    // 1. Check dependencies
    console.log("1. Vérification des dépendances...");
    execSync('npm install', { cwd: frontendPath, stdio: 'ignore' });
    console.log("✅ Dépendances installées.");

    // 2. Run unit tests
    console.log("2. Exécution des tests unitaires Vitest...");
    execSync('npm run test', { cwd: frontendPath, stdio: 'ignore' });
    console.log("✅ Tests unitaires (Vitest) réussis.");

    // 3. Run Build
    console.log("3. Compilation de l'application (Vite Build)...");
    execSync('npm run build', { cwd: frontendPath, stdio: 'ignore' });
    console.log("✅ Build réussi.");

    // 4. Verify PWA and Build Output
    console.log("4. Vérification de l'intégrité du Build...");
    const distPath = path.join(frontendPath, 'dist');
    if (!fs.existsSync(distPath)) throw new Error("Le dossier dist/ n'existe pas.");
    if (!fs.existsSync(path.join(distPath, 'index.html'))) throw new Error("index.html manquant.");
    if (!fs.existsSync(path.join(distPath, 'manifest.webmanifest'))) throw new Error("PWA manifest manquant.");
    console.log("✅ Fichiers de production et PWA générés correctement.");

    console.log("\n--- TOUS LES TESTS FRONTEND SONT RÉUSSIS ---");
} catch (error) {
    console.error("❌ ÉCHEC DES TESTS FRONTEND:");
    console.error(error.message);
    process.exit(1);
}
