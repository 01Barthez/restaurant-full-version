# Guide de Contribution

Bienvenue dans le projet ! Nous sommes ravis que vous souhaitiez contribuer. Voici comment vous pouvez nous aider à améliorer ce projet.

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure) ou Yarn (version 1.22 ou supérieure)
- Git

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_REPO]
   cd [NOM_DU_PROJET]
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

## Configuration de l'environnement de développement

1. **Configurer VS Code (recommandé)**
   - Installez les extensions recommandées (elles devraient s'installer automatiquement)
   - Copiez le contenu de `vscode-settings.json` dans vos paramètres utilisateur VS Code

2. **Variables d'environnement**
   - Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example`
   - Remplissez les variables nécessaires

## Commandes disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévient l'application de production localement
- `npm run lint` - Exécute le linter
- `npm run lint:fix` - Corrige automatiquement les problèmes de style
- `npm run format` - Formate le code avec Prettier
- `npm run type-check` - Vérifie les types TypeScript
- `npm run validate` - Exécute le linter et la vérification de types

## Standards de code

- Nous utilisons ESLint et Prettier pour maintenir une cohérence de code
- Tous les fichiers doivent passer la validation (`npm run validate`) avant d'être commités
- Les messages de commit doivent suivre le format [Conventional Commits](https://www.conventionalcommits.org/)

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── styles/        # Styles globaux
├── utils/         # Utilitaires et helpers
└── types/         # Définitions de types TypeScript
```

## Processus de contribution

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nom-de-la-fonctionnalite`)
2. Committez vos changements (`git commit -m 'feat: ajouter une nouvelle fonctionnalité'`)
3. Poussez vers la branche (`git push origin feature/nom-de-la-fonctionnalite`)
4. Ouvrez une Pull Request

## Tests

- Assurez-vous que tous les tests passent avant de soumettre une PR
- Ajoutez des tests pour les nouvelles fonctionnalités

## Questions ?

Si vous avez des questions, n'hésitez pas à ouvrir une issue ou à contacter l'équipe de développement.
