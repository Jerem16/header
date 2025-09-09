# AGENTS.md

## Installation

- Toujours commencer par `yarn install` pour installer toutes les dépendances.
- Si vous utilisez Yarn v4.x (Berry/PnP), ajoutez ou vérifiez dans `.yarnrc.yml` :

    ```yaml
    nodeLinker: node-modules
    ```

## Scripts

Utilisez les scripts définis dans le `package.json` :

- **`yarn install`** : installe l’application en mode développement (`next dev`).
- **`yarn lint`** : exécute le lint via Next.js (`next lint`).
- **`yarn tsc -noEmit`**
- **`yarn test`**
- **`yarn build`** : construit la production (`next build`).
- **`yarn start`** : démarre le serveur en production (`next start`).

## Style de code

- Utiliser **Prettier** pour formater le code :

    ```bash
    yarn prettier --write .
    ```

- Respecter les règles **ESLint** intégrées à Next.js :

    ```bash
    yarn lint
    ```

## Dépendances clés

- **Framework** : Next.js v15.0.3
- **Markdown** : react-markdown v10.1.0 avec remark-gfm
- **Styles** : Sass 1.60.0
- **AWS & Amplify** : aws-amplify 6.9.0 et @aws-amplify/ui-react

## Tests

- Tous les tests (unitaires, API, intégration, E2E) doivent être placés dans le dossier racine `./tests`.
- Structure recommandée :
    - `tests/unit` : tests unitaires
    - `tests/api` : tests des API
    - `tests/integration` : tests d’intégration
    - `tests/e2e` : tests end-to-end
    - `tests/_legacy` : tests historiques à migrer ou supprimer
- Des scripts de test sont disponibles : `yarn test`, `yarn test:unit`, `yarn test:api`, `yarn test:integration`, `yarn test:e2e`.

## Pull Request

- **Titre de la PR** : `[Fix|Feat] courte description`
- **Description** : expliquer l’objectif du changement.
- **Tests effectués** : listez les commandes exécutées (ex. `yarn dev`, `yarn lint`, `yarn build`).

---

Quand tu génères du code, n’argumente pas sur la forme des imports ni sur l’utilisation des alias relatifs :

Toujours utiliser un alias qui contient au minimum un /, jamais d’alias simple sans /.

Si j’ai un dossier (par exemple services) qui contient un fichier index.ts pour regrouper les exports, alors j’utilise l’alias :
@src/services
(et pas @services ni @src/services)

Si je n’utilise pas d’index pour centraliser les exports dans un dossier, alors importe directement le module voulu, ex :
@example/monComposant

> Ces instructions seront automatiquement suivies par Codex pour chaque tâche (lint, build, PR, etc.), garantissant un workflow cohérent et reproductible.
