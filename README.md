# Catalogue de recommandations

Fichier `catalog.json` téléchargé par l'extension. Publié via GitHub Pages.

## Ajouter une entrée

1. Ouvrir une branche et une pull request (jamais de commit direct sur `main`).
2. Ajouter l'entrée dans `catalog.json` et mettre à jour `version` (date du jour).
3. Vérifier à la main : la page existe, l'identifiant est correct, les permissions sont cohérentes avec la fonction.
4. Renseigner `last_verified` avec la date de vérification.
5. Lancer `node scripts/validate.mjs` en local ; la CI le relance automatiquement.
6. Faire relire par un autre membre de l'équipe.

## Modèle : fonctionnalité native

```json
{
  "id": "tab-groups",
  "type": "chrome_feature",
  "name": "Groupes d'onglets",
  "summary": "Regroupe les onglets par projet et permet de les replier.",
  "needs": ["trop_onglets", "aller_retour"],
  "shortcut": "optionnel",
  "url": "https://support.google.com/chrome/...",
  "last_verified": "2026-10-20"
}
```

## Modèle : extension

```json
{
  "id": "nom-de-l-extension",
  "type": "extension",
  "name": "Nom affiché",
  "summary": "Une phrase sur ce qu'elle fait, 160 caractères max.",
  "needs": ["copier_coller"],
  "extension_id": "abcdefghijklmnopabcdefghijklmnop",
  "permissions_level": "low",
  "url": "https://chromewebstore.google.com/detail/<nom>/<extension_id>",
  "last_verified": "2026-10-20"
}
```
(l'identifiant ci-dessus est factice : copiez le vrai depuis l'URL de la page du store)

## Critères de sélection d'une extension

- utilisateurs suffisants et note correcte ;
- mise à jour récente ;
- éditeur identifiable, politique de confidentialité lisible ;
- permissions raisonnables par rapport à la fonction (`permissions_level`) ;
- pas de doublon avec une fonction native de Chrome.

## Étiquettes `needs`

`trop_onglets`, `aller_retour`, `copier_coller`, `ouverture_quotidienne`, `traduction`, `lecture_longue`, `raccourcis_clavier`
(à garder alignées avec les patterns produits par l'agrégation de l'extension ; pour en ajouter une, modifier `scripts/validate.mjs` et `catalog.schema.json`.)
