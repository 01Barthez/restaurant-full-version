
# GitHub Actions Documentation

Ce dossier contient toute l'infrastructure CI/CD pour Le Délice Moderne Restaurant Management App.

## Structure

```
.github/
├── actions/          # Actions réutilisables
│   ├── setup-node/   # Configuration Node.js avec cache
│   ├── build-app/    # Build optimisé de l'application
│   └── security-scan/ # Scans de sécurité
└── workflows/        # Workflows CI/CD
    ├── ci-cd-ec2-s3.yml    # Déploiement AWS EC2 & S3
    └── ci-cd-vercel.yml    # Déploiement Vercel
```

## Actions Réutilisables

### setup-node
Configure l'environnement Node.js avec mise en cache des dépendances.

**Inputs:**
- `node-version`: Version Node.js (défaut: 18)

**Outputs:**
- `cache-hit`: Indique si le cache a été utilisé

### build-app
Construit l'application avec optimisations (compression, rapport de build).

**Inputs:**
- `environment`: Environnement de build (staging/production)

**Outputs:**
- `build-path`: Chemin vers l'application construite

### security-scan
Exécute les scans de sécurité (npm audit, détection de secrets, vérification des dépendances).

## Workflows

### CI/CD - AWS EC2 & S3
Pipeline complet pour déploiement sur infrastructure AWS.

**Triggers:**
- Push sur `main` et `develop`
- Pull requests vers `main`

**Jobs:**
1. **test**: Tests, linting, vérification des types
2. **security**: Scans de sécurité
3. **build**: Construction pour staging et production
4. **deploy-s3**: Déploiement sur S3 avec invalidation CloudFront
5. **deploy-ec2**: Déploiement sur instance EC2

**Secrets requis:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID` (optionnel)
- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_SSH_KEY`

### CI/CD - Vercel
Pipeline optimisé pour déploiement sur Vercel.

**Triggers:**
- Push sur `main` et `develop`
- Pull requests vers `main`

**Jobs:**
1. **test**: Tests et vérifications
2. **deploy-preview**: Déploiement de preview pour les PR
3. **deploy-production**: Déploiement en production

**Secrets requis:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Configuration

### Variables d'environnement
```bash
# AWS
AWS_REGION=eu-west-1
NODE_VERSION=18

# Vercel
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### Scripts package.json requis
```json
{
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  }
}
```

## Sécurité

- Scans automatiques des vulnérabilités
- Vérification des dépendances obsolètes
- Détection basique de secrets dans le code
- Audit npm sur les dépendances à risque élevé

## Monitoring

- Artefacts de build conservés 30 jours
- Rapports de taille de build
- Vérifications post-déploiement
- Commentaires automatiques sur les PR avec URLs de preview

## Bonnes Pratiques

1. **Secrets**: Utilisez toujours les secrets GitHub pour les informations sensibles
2. **Cache**: Les dépendances sont automatiquement mises en cache
3. **Rollback**: Sauvegarde automatique avant déploiement EC2
4. **Monitoring**: Vérifications de santé après déploiement
5. **Preview**: URLs de preview automatiques pour les PR
