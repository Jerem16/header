# 📌 Résumé exécutif (propre & prêt à coder)

## 🧱 Les 6 briques du moteur

---

# Étape 1 — Resize (`useResize.ts`)

## Rôle fonctionnel (humain)

Le module **`useResize`** pilote **l’ergonomie du header** en fonction de la largeur de la fenêtre.
Il bascule le menu entre **quatre modes d’affichage** (mobile, tablet, desktopReduced, desktop) via 4 flags :

-   **`tabletMain`** : le menu principal passe en “mode tablette/desktop” (structure élargie).
-   **`openMainButton`** : les **libellés** du **menu principal** sont visibles sans interaction.
-   **`openButton`** : les **libellés** des **menus secondaires** (réservation, recherche, connexion) peuvent s’afficher d’office.
-   **`bigMenu`** : version “grand” du principal (affiché et stable, pas besoin de hover pour voir les labels).

### Breakpoints & états attendus

| Largeur     | `tabletMain` | `openMainButton` | `openButton` | `bigMenu` |
| ----------- | -----------: | ---------------: | -----------: | --------: |
| `< 1024`    |        false |            false |        false |     false |
| `1024–1169` |         true |             true |        false |     false |
| `1170–1439` |         true |             true |        false |      true |
| `≥ 1440`    |         true |             true |         true |  (hérite) |

---

## Comportement utilisateur (stories rapides)

### 1) Resize (breakpoints vivants)

-   **Situation initiale** : je suis à **1440px** (desktop large).
-   **Action** : je réduis la fenêtre à **1180px**, puis **980px**.
-   **Résultat** :

    -   **1180–1439px** → **`bigMenu` actif** : libellés principaux visibles, rendu compacté (secondaires réduits).
    -   **<1024px** → **mode compact** : icônes, libellés **à la demande** (hover/focus).
    -   Le **même moteur d’ouverture/fermeture** reste en place ; **seul le rendu change**.

---

## Moteur (tech) — qui fait quoi, et dans quel ordre

### Chaîne d’événements (du **resize** au **rendu**)

1. **Événement navigateur**
   `window.onresize` (attaché dans `useEffect`) → calcule la **largeur** courante.

2. **Hook de layout**
   **`components/header/utils/useResize.ts`**

    - Calcule le **mode** à partir des seuils et met à jour les **4 flags** :
      `{ tabletMain, openMainButton, openButton, bigMenu }`.

3. **Propagation au Header**
   **`components/header/Header.tsx`**

    - Déclare les 4 **states** et passe ces **props** au composant **`Nav`** :

        ```ts
        <Nav
          tabletMain={tabletMain}
          openMainButton={openMainButton}
          openButton={openButton}
          bigMenu={bigMenu}
          setOpenMainButton={setOpenMainButton}
          ...
        />
        ```

4. **Décision d’affichage (gating)**
   **`components/header/Nav.tsx`**

    - Utilise les flags pour déterminer **quand** afficher les libellés et **comment** réagir aux survols :

        - **`openMainButton`**: libellés du **main** visibles sans interaction.
        - **`openButton`**: libellés des **menus secondaires** affichables d’office.
        - **`bigMenu`**: en “grand” écran, le main reste **ouvert/stable** ; sinon, sur interaction il peut se réduire :

            ```ts
            const handleMouseOrFocus = (menuId: string) => {
                showLink(menuId);
                if (bigMenu === false) {
                    setOpenMainButton(false); // en écrans plus petits, le main ne reste pas forcé ouvert
                }
            };
            ```

    - Pilote **`showNavLinks`** (via `useNavigation`) pour révéler/masquer **les libellés** item par item.

5. **Rendu des liens & sous-menus**

    - **`components/header/navLink/NavLinkShow.tsx`**
      Branche le rendu selon **`openMainButton`** (main élargi) / **`openButton`** (secondaires) / **`showNavLinks`** (libellé visible).
    - **`components/header/navLink/RenderLink.tsx`**
      Appelle les handlers de navigation (clic) et **déclenche** l’ouverture de sous-menu au **hover/focus** (en cohérence avec les flags).

6. **Animation & classes utilitaires**

    - **`components/header/utils/HiddenDelayComponent.tsx`**
      Temporise l’apparition des **libellés** (évite les sauts).
    - **`components/header/utils/menuUtils.ts`**
      Calcule les **classes** d’habillage en fonction des flags :

        ```ts
        getShowGroupClass(menuId, showNavLinks); // nav-circle vs nav-padding
        getShowClass(showNavLinks); // hidden vs show-link
        ```

7. **Styles**
   **`components/header/_header.scss`**

    - Styles adaptés aux classes **`.nav-circle`** (réduit) / **`.nav-padding`** (élargi), etc.
    - (Option) Tu as des sélecteurs **`nav[data-reduced="mobile|tablet|desktopReduced"]`** prêts : si tu veux, on peut **poser dynamiquement** l’attribut `data-reduced` sur les `<nav>` à partir du **layout** calculé (voir “Suggestion mini-refactor”).

---

## Fichiers impliqués (et leur rôle précis)

-   **`components/header/utils/useResize.ts`**
    Source de vérité des **breakpoints** → met à jour `{ tabletMain, openMainButton, openButton, bigMenu }`.
-   **`components/header/Header.tsx`**
    Conserve les **states** de layout, les passe à `Nav`.
-   **`components/header/Nav.tsx`**
    Applique la **logique d’ouverture** (main vs secondaires) et **relie** les flags aux interactions (hover/focus/clic).
-   **`components/header/navLink/NavLinkShow.tsx` & `navLink/RenderLink.tsx`**
    Rendu conditionnel des **libellés** et **icônes** selon les flags ; délègue aux sous-composants.
-   **`components/header/utils/HiddenDelayComponent.tsx`**
    Lissage d’apparition des libellés (évite les flashes).
-   **`components/header/utils/menuUtils.ts`**
    Petites fonctions **pures** pour attribuer les classes (`nav-circle`, `nav-padding`, `hidden`, `show-link`).
-   **`components/header/_header.scss`**
    Styles couplés aux classes ci-dessus (ombres, hover, transitions, etc.).

> Remarque hors resize mais utile : garde la **cohérence des classes**.
> Dans `Nav.tsx` tu as `<nav ref={navRef} className={`connect`}>` alors que le SCSS attend **`.connexion`**. À harmoniser, sinon le style/rendu “resize” peut sembler incomplet côté “connexion”.

---

## “Version courte” à coller dans le README (si tu veux)

-   **Fonctionnel** : `useResize` bascule le header entre **4 modes** selon la largeur (mobile, tablet, desktopReduced, desktop). Les flags contrôlent **quand** les libellés sont visibles et **comment** s’ouvrent les sous-menus.
-   **Technique** :
    `window.resize` → `useResize` → **flags** → `Header` → `Nav` (gating & interactions) → `NavLinkShow/RenderLink` (rendu) → `HiddenDelayComponent/menuUtils` (animation/classes) → **SCSS**.
-   **Contrats** :

    -   `openMainButton=true` ⇒ **libellés du main** visibles.
    -   `openButton=true` ⇒ **libellés secondaires** visibles.
    -   `bigMenu=true` ⇒ le main **reste ouvert** (grand écran).
    -   `tabletMain=true` ⇒ structure **tablette/desktop** (pas mobile).

---

# Étape 2 — Navigation & Scroll (en 2 temps)

## 🎯 L’idée

-   **Inter-page** : on change de route **puis** on applique l’ancre (#id) à l’arrivée.
-   **Intra-page** : on scrolle en douceur jusqu’à l’`AnchorId` avec **offset** (héritage subItem → parent → 0).
-   Le **ScrollSpy** met à jour la **section active** et synchronise les classes actives du menu (parent + sous-item).

---

## 👤 Scénarios utilisateur (fonctionnels)

### 2.1 — Clic sur **Tarifs** (parent)

-   **Situation** : je suis sur l’**accueil** (`/`), le menu est au repos.
-   **Action** : je survole **Tarifs** (le sous-menu apparaît) puis je **clique “Tarifs”**.
-   **Résultat** : navigation vers **`/p2#top`**, scroll **offset 0px**, `activeSection='top'`.
    **Tarifs** (parent) est actif, **aucun sous-item** actif. Le sous-menu se referme proprement.

### 2.2 — Clic sur **Tarifs → Confirmé** (sous-item)

-   **Situation** : je suis sur l’**accueil** (`/`).
-   **Action** : je survole **Tarifs**, je **clique “Confirmé”**.
-   **Résultat** : navigation vers **`/p2#expert`**, scroll **offset 102px**, `activeSection='expert'`.
    **Tarifs** (parent) **et** **Confirmé** (sous-item) deviennent actifs.

### 2.3 — Clic **intra-page** (déjà sur `/p1`) → **Avec Permis**

-   **Situation** : je suis déjà sur **`/p1`** (Services).
-   **Action** : je **clique “Avec Permis”**.
-   **Résultat** : scroll interne vers **`#avec-permis`** avec **offset 102px**, `activeSection='avec-permis'`.
    **Services** (parent) et **Avec Permis** (sous-item) sont actifs.

### 2.4 — **Deep link** (j’arrive sur une URL ancrée)

-   **Situation** : j’ouvre directement **`/p2#expert`**.
-   **Action** : aucune.
-   **Résultat** : au montage, scroll vers **`#expert`** avec l’offset configuré ; classes actives alignées.

### 2.5 — **Cmd/Ctrl-clic** sur un sous-item

-   **Situation** : le sous-menu **Tarifs** est ouvert.
-   **Action** : je **Cmd/Ctrl-clic** sur **Confirmé**.
-   **Résultat** : ouverture **dans un nouvel onglet** ; l’onglet courant ne bouge pas (pas de scroll forcé).

---

## 🧠 Moteur (tech) — qui fait quoi, où, et dans quel ordre

### Entrées UI (où part le clic)

-   **`src/components/header/navLink/RenderLink.tsx`**

    -   Sur clic d’un **parent** (ex. “Tarifs”) :

        -   `preventDefault()` → `onNavigationClick(fullPath, menuItem.scrollOffset)`
        -   **fullPath** est souvent du type `"/p2#top"` construit depuis `menuItem.path + menuItem.AnchorId`

-   **`src/components/header/navLink/SubMenu.tsx`**

    -   Sur clic d’un **sous-item** (ex. “Confirmé”) :

        -   Calcule `basePath = subItem.path ?? menuItem.path ?? ""`
        -   Calcule `fullPath = basePath + (subItem.AnchorId ?? "")` (ex. `"/p2#expert"`)
        -   Calcule **offset** = `subItem.scrollOffset ?? menuItem.scrollOffset`
        -   Si **clic modifié** (`Cmd/Ctrl/Shift/Alt`), **laisser le navigateur faire** (pas de `preventDefault`)
        -   Sinon : `preventDefault()` → `onSubItemClick(fullPath, offset)` → fermer le sous-menu + **restore focus** (A11y)

> Les deux chemins (parent/sous-item) convergent vers **`onNavigationClick(path, offset)`**.

---

### Orchestrateur (où l’intention est routée)

-   **`src/components/header/Header.tsx`**

    -   **Construit** `handleNavigationClick = (path, scrollOffset=0) => handleNavClick(path, currentRoute, updateRoute, handleScrollClick, scrollOffset)`
    -   **Passe** `handleNavigationClick` à `Nav` → `NavLinkShow` → `RenderLink` / `SubMenu`
    -   **Calcul actif / classes** : `updateMenuClasses(...)` avec :

        -   **`menuItems`** (data)
        -   **`activeSection`** (via `useScrollContext`)
        -   **`currentRoute`** (via `useNavigation`)

---

### Moteur navigation/scroll (les fonctions clés)

-   **Fichier :** `src/utils/fnScrollUtils.ts`
    _(importé par `Header.tsx` – code non listé mais chainage visible dans l’app)_

1. **`handleNavClick(path, currentRoute, updateRoute, handleScrollClick, offset)`**

    - **Split** le `path` potentiel : `/p2#expert` → `route="/p2"`, `anchor="#expert"`.
    - **Cas inter-page (route change)** :

        - Si `route !== currentRoute` → `updateRoute(route)` (→ Next router dans ton context Navigation)
        - À l’**arrivée** : c’est **`useInitialScroll`** qui applique l’ancre (voir plus bas).

    - **Cas intra-page (même route)** :

        - Appelle **`handleScrollClick(anchor, offset)`** directement (smooth scroll + correction d’offset).

    - **Ferme** le sous-menu au besoin (via `useNavigation.setOpenSubMenu(null)` en cascade côté UI).

2. **`handleScrollClick(anchorId, offset)`**

    - `document.querySelector(anchorId)` → `window.scrollTo({ top: eltTop - offset, behavior: 'smooth' })`
    - **Optionnel** : met à jour `history.replaceState` pour refléter l’ancre.

3. **`useInitialScroll(pathname)`** _(fichier : `src/utils/scrollUtils.ts`)_

    - Au **montage** / **changement de route**, lit l’URL : s’il y a une **ancre**, scrolle **avec offset** :

        - L’offset vient de la config : `subItem.scrollOffset ?? parent.scrollOffset ?? 0`
          _(tu l’as déjà posée dans tes `menuItems`)_

    - Sert le cas **deep link** (arrivée sur `/p2#expert`) et le cas **clic parent** (ex. `#top`).

---

### Moteur “état actif” (qui décide des `.active`)

-   **Fichier :** `src/utils/updateMenuUtils.ts`

    -   **`updateMenuClasses(main, reservation, search, connection, activeSection, currentRoute)`**

        -   Si `activeSection` est défini (ex. `'expert'`) → **match** l’`AnchorId` des items (`'#expert'`) :

            -   Active **le parent** (ex. `Tarifs`) **et** **le sous-item** (`Confirmé`)

        -   Sinon, fallback **route-seule** (ex. `/blog`) → active juste l’item dont `path === currentRoute`

    -   **`useMenuBehavior()`**

        -   Fournit **`navRef`** et gère les **clics extérieurs/ESC** pour fermer les sous-menus :

            -   ⚠️ **Brancher `ref={navRef}` sur chaque `<nav>`** concerné (`main-nav`, `reservationId`, `research`, **`connexion`**)
            -   Sans ça, les clics dans `connexion`/`SubMenu` peuvent être vus comme **extérieurs** → fermeture intempestive.

---

### Contexts impliqués

-   **`src/utils/context/NavigationContext.tsx`**

    -   Expose **`currentRoute, updateRoute`**, **`openSubMenu, setOpenSubMenu`**, **`setShowNavLinks`**
    -   C’est la **“centrale”** pour l’état du menu (ouvertures/fermetures + route courante).

-   **`src/utils/context/ScrollContext.tsx`**

    -   Expose **`activeSection`**
    -   S’appuie sur un **listener** / **IntersectionObserver** + la liste `sections.ts`

---

### Données (contrats)

-   **`src/assets/data/menuItems.ts`**

    -   `path`, **`AnchorId`** (ex. `'#expert'`), **`scrollOffset`** (souvent `102` pour sous-items)
    -   **Héritage d’offset** attendu : `subItem.scrollOffset ?? parent.scrollOffset ?? 0`

-   **`src/assets/data/sections.ts`**

    -   Doit contenir **tous** les `id` correspondants aux `AnchorId` **sans le “#”**
        _(ex. `'#expert'` ↔ `{ id: 'expert' }`)_

---

## 🧩 Chaînes complètes (lecture rapide)

### Parent (Tarifs)

```
RenderLink.onClick
  → onNavigationClick('/p2#top', 0)
    → handleNavClick(...)            // split route+anchor
       ├─ (route change) updateRoute('/p2')
       └─ useInitialScroll('#top')   // au montage
          ├─ handleScrollClick('#top', 0)
          └─ ScrollSpy → activeSection='top'
             → updateMenuClasses(...) // Tarifs actif
```

### Sous-item (Tarifs → Confirmé)

```
SubMenu.onClick
  → onSubItemClick('/p2#expert', 102)
    → handleNavClick(...)
       ├─ (route change) updateRoute('/p2')
       └─ useInitialScroll('#expert')
          ├─ handleScrollClick('#expert', 102)
          └─ ScrollSpy → activeSection='expert'
             → updateMenuClasses(...) // Tarifs + Confirmé actifs
```

### Intra-page (Services → Avec Permis sur /p1)

```
SubMenu.onClick
  → onSubItemClick('/p1#avec-permis', 102)
    → handleNavClick(...)
       ├─ (même route) handleScrollClick('#avec-permis', 102)
       └─ ScrollSpy → activeSection='avec-permis'
          → updateMenuClasses(...) // Services + Avec Permis actifs
```

---

# Étape 3 — État du menu & sous-menus (`useNavigation` + `useMenuBehavior(navRef)`)

## 🎯 Le rôle (humain)

Cette brique orchestre **l’ouverture/fermeture des sous-menus**, la **visibilité des libellés** (texte des liens) et la **fermeture sur clic extérieur / ESC**.
Elle garantit aussi une **navigation clavier correcte** (Enter/Espace pour ouvrir, ESC pour fermer, focus restauré).

---

## 👤 Scénarios utilisateur (fonctionnels)

### 3.1 — Ouvrir un sous-menu (hover/focus)

**Situation** : je suis sur l’accueil (`/`), le header est visible.
**Action** : je survole **Services** (ou je tabule jusqu’à **Services**, puis Enter).
**Résultat** : le **sous-menu Services** s’ouvre ; **un seul sous-menu à la fois** ; les **libellés** s’affichent selon les flags de `useResize` (main en grand si `bigMenu=true`, réduit sinon).

### 3.2 — Clic extérieur / touche ESC

**Situation** : le sous-menu **Tarifs** est ouvert.
**Action** : je clique dans la page (hors header) **ou** j’appuie sur **ESC**.
**Résultat** : tous les sous-menus se **ferment**, les libellés repassent à l’état **au repos** ; le focus est **restauré** sur le déclencheur.

### 3.3 — Enchaîner deux menus

**Situation** : **Services** est ouvert.
**Action** : je passe sur **Tarifs**.
**Résultat** : **Services** se ferme, **Tarifs** s’ouvre (pas de double ouverture).

### 3.4 — Sous-menus “secondaires” (Réservation / Recherche / Connexion)

**Situation** : j’interagis avec **Recherche** (input) ou **Connexion**.
**Action** : je tape dans l’input, je clique un élément du sous-menu.
**Résultat** : **aucune fermeture intempestive** : ces clics **ne sont pas** considérés comme “extérieurs” (à condition que `ref={navRef}` soit **posé sur chaque `<nav>` concerné**).

### 3.5 — Navigation clavier (A11y)

**Situation** : sous-menu ouvert au clavier.
**Action** : **ESC**.
**Résultat** : le sous-menu **se ferme** et le **focus revient** sur le lien parent (restauration via `triggerRef`).

---

## 🧠 Moteur (tech) — qui fait quoi, dans quel ordre

### 1) Les **entrées** (interactions)

-   **`Nav.tsx`**

    -   `useMenuBehavior()` → fournit **`navRef`** et installe les **listeners document** (clic extérieur, ESC).
    -   Gestion “ouverte/fermée” :

        -   `handleMenuClick(menuId)` → **toggle** du sous-menu (via `useNavigation.setOpenSubMenu`).
        -   `showLink(menuId)` → force **`setShowNavLinks(true)`**, enregistre le **dernier menu cliqué** et garantit **un seul ouvert**.

    -   Adaptation aux flags de resize :

        -   `handleMouseOrFocus` / `handleMainMouseOrFocus` peuvent **désactiver** `openMainButton` si `bigMenu === false` (main non “collant” en moyen écran).

-   **`NavLinkShow.tsx`**

    -   Délègue le rendu au lien parent (**`RenderLink`**) + **`SubMenu`**.
    -   Support **clavier** (Enter/Espace) pour ouvrir le groupe (`role="button"` + `aria-*`).

-   **`RenderLink.tsx`**

    -   Sur **click/Enter** : `handleInteraction` → **navigation** (voir Étape 2) **et** `handleMenuClick(menuItem.id)` pour le sous-menu.

-   **`SubMenu.tsx`**

    -   Reçoit `triggerRef`.
    -   **Fermeture** centralisée : clic inside sous-item → navigation puis **`closeSubMenu()`** (met `openSubMenu=null` + **restore focus**).
    -   **ESC** géré dans `onKeyDown`.

### 2) La **centrale d’état**

-   **`useNavigation` (context)**
    Expose :

    -   `currentRoute, updateRoute` (voir Étape 2),
    -   `openSubMenu, setOpenSubMenu` (**quel menu est ouvert**),
    -   `setShowNavLinks` (**affichage des libellés** selon le mode).

### 3) Le **cerbère** clic extérieur / ESC

-   **`useMenuBehavior()`**

    -   Retourne **`navRef`** (⚠️ à appliquer sur **chaque `<nav>`** : `main-nav`, `reservationId`, `research`, `connexion`).
    -   Installe des **listeners document** (pointerdown/click + keydown) :

        -   Si l’évènement **ne provient pas** d’un des nœuds pointés par `navRef` → **fermer** sous-menus (`openSubMenu=null`) et **masquer** les libellés (`setShowNavLinks(false)`).
        -   Si **ESC** → même fermeture + **restore focus**.

> **Important** : dans ton code actuel, tu passes **le même `navRef` à plusieurs `<nav>`**. En React, un ref simple **ne peut référencer qu’un seul nœud** (le **dernier** monté gagne).
> C’est la **source** des “clics intérieurs vus comme extérieurs”.
> Voir “Nettoyage doux” plus bas pour corriger **sans casser**.

### 4) Les **classes & animations** (habillage)

-   **`menuUtils.ts`**

    -   `getShowGroupClass(...)` → alterne **`nav-circle`** (réduit) / **`nav-padding`** (élargi).
    -   `getShowClass(showNavLinks)` → **`hidden`** / **`show-link`**.

-   **`HiddenDelayComponent.tsx`**

    -   Diffère l’affichage du **texte** (évite le flicker).

---

## 📁 Fichiers & responsabilités

-   `components/header/Nav.tsx` — point d’assemblage : ouvre/ferme, montre/masque libellés, branche `navRef`.
-   `components/header/navLink/NavLinkShow.tsx` — wrapper par item (parent + sous-menu).
-   `components/header/navLink/RenderLink.tsx` — interaction du **lien parent** (clic, hover/focus).
-   `components/header/navLink/SubMenu.tsx` — liste des sous-liens, **fermeture + restore focus**.
-   `utils/context/NavigationContext.tsx` — **store du menu** (route, sous-menu ouvert, libellés).
-   `utils/updateMenuUtils.ts` — `useMenuBehavior()` (clic extérieur / ESC) + helpers de mise à jour.
-   `components/header/utils/menuUtils.ts` — classes utilitaires d’habillage.
-   `components/header/utils/HiddenDelayComponent.tsx` — temporisation visuelle.

---

## 🧩 Mini chaîne complète (ouverture/fermeture)

1. **Hover/Focus** sur “Services”
   `NavLinkShow` → `onMenuToggle('menu-services')`
   → `useNavigation.setShowNavLinks(true)` + `setOpenSubMenu('menu-services')`.

2. **Clic intérieur dans le sous-menu**
   `SubMenu.onClick` → navigation (Étape 2) → `closeSubMenu()`
   → `setOpenSubMenu(null)` + **focus** retour sur le parent.

3. **Clic extérieur / ESC**
   `document.(pointerdown|keydown)` (dans `useMenuBehavior`)
   → si **hors** (head-flex / multi-refs) : `setOpenSubMenu(null)` + `setShowNavLinks(false)` + **focus restore**.

---

4. **ScrollSpy (section active) — `useScrollContext`**
   Observe les sections de `assets/data/sections.ts` et expose **`activeSection`**.

5. **Synchronisation des classes actives — `updateMenuClasses`**
   Active le **parent** et/ou le **sous-item** qui correspond à `activeSection` ou à `currentRoute` (pages sans ancre).

6. **Recherche — `NavInput` + `useSearchHandler` (+ `SearchContext`)**
   Suggestions (≥3 caractères), push `?query=` / `?badKeyWord=` en URL, `setResults` dans le contexte.

---

## ⚠️ Rappel critique (sous-menus)

Pour que les sous-menus fonctionnent (clic, navigation, fermeture correcte), **branche `ref={navRef}`** (issu de `useMenuBehavior`) sur **chaque `<nav>`** impliqué :

-   `<nav class="main-nav">`, `<nav class="reservationId">`, `<nav class="research">`, `<nav class="connexion">`.
    Sans ça, les clics internes peuvent être pris pour des “clics extérieurs”.

---

# 🎬 Scénarios humains — _Situation initiale → Action → Résultat_ (+ moteur)

## 1) **Resize** (breakpoints vivants)

**Situation initiale**
Je suis à **1440px** de large (desktop large).

**Action**
Je réduis la fenêtre à **1180px**, puis **980px**.

**Résultat**

-   **1180–1439px** : `bigMenu` actif (libellés principaux visibles, comportement compacté).
-   **<1024px** : mode compact (icônes, libellés à la demande).
-   L’ouverture des sous-menus s’adapte : **même moteur**, rendu **différent**.

**Moteur (tech)**
`useResize` met à jour `{ tabletMain, openMainButton, openButton, bigMenu }`.
Les composants conditionnent libellés/affichages via ces flags.

---

## 2) **Navigation & Scroll (inter-page) — clic sur le parent “Tarifs”**

**Situation initiale**
Je suis sur l’accueil (`/`), le menu est au repos.

**Action**
Je place le curseur sur **“Tarifs”** (le sous-menu s’affiche), puis je **clique sur “Tarifs”** (parent).

**Résultat**

-   Navigation vers **`/p2#top`**.
-   Scroll fluide avec **offset `0px`** (défini au niveau parent).
-   `activeSection = 'top'`.
-   **Tarifs** est `.active` (parent), **aucun sous-item** n’est actif.

**Moteur (tech)**
`handleNavClick('/p2', ...)` → `useInitialScroll('#top')` → `updateMenuClasses(..., currentRoute='/p2')`.

---

## 3) **Navigation & Scroll (inter-page) — “Tarifs → Confirmé” (sous-item)**

> _Rappel data :_ sous “**Tarifs**”, les sous-items sont **Débutant (`#novice`)** et **Confirmé (`#expert`)**.

**Situation initiale**
Je suis sur l’accueil (`/`), le menu est au repos.

**Action**
Je survole **“Tarifs”**, je **clique “Confirmé”**.

**Résultat**

-   Navigation de `/` vers **`/p2#expert`**.
-   Scroll fluide avec **offset `102px`** (porté par le sous-item).
-   `activeSection = 'expert'`.
-   **Tarifs** (parent) et **Confirmé** (sous-item) sont `.active`.
-   Le sous-menu se referme proprement.

**Moteur (tech)**
`onSubItemClick('/p2#expert', 102)` → arrivée → ScrollSpy → `updateMenuClasses`.

---

# Étape 4 — ScrollSpy / Active section

( `useScrollContext` + `updateMenuClasses` )

## 🎯 Le rôle (humain)

Identifier **quelle section est “au centre” de la vue** et **synchroniser les classes actives** du menu :

-   active **parent** (ex. _Tarifs_) + **sous-item** (ex. _Confirmé_) quand une ancre correspond.
-   si aucune ancre ne matche, **route seule** (ex. _/blog_) reste active.

---

## 👤 Scénarios utilisateur (fonctionnels)

### 4.1 — Scroll intra-page (Services → Avec Permis)

**Situation** : je suis sur **`/p1`** (Services), en haut de page.
**Action** : je scrolle jusqu’à la section **`#avec-permis`** (ou je clique le sous-item).
**Résultat** : `activeSection = 'avec-permis'` → **Services** (parent) **et** **Avec Permis** (sous-item) sont **actifs**.
Le reste du menu redevient neutre.

### 4.2 — Deep link (arrivée ancrée)

**Situation** : j’ouvre **`/p2#expert`** depuis un lien externe.
**Action** : aucune.
**Résultat** : à l’init, scroll vers **`#expert`** avec offset configuré → `activeSection='expert'`.
**Tarifs** + **Confirmé** deviennent **actifs**.

### 4.3 — Page “sans ancre visible”

**Situation** : je navigue vers **`/blog`** (pas de sections observées).
**Action** : aucune.
**Résultat** : `activeSection` reste vide → **route-only** : **Blog** apparaît **actif**, aucun sous-item actif.

### 4.4 — Ancre inconnue / non trouvée

**Situation** : j’ouvre **`/p2#inconnue`** (pas dans `sections.ts`).
**Action** : aucune.
**Résultat** : pas d’élément observé → **fallback route** : **Tarifs** actif, aucun sous-item.

### 4.5 — Header fixe & offset

**Situation** : j’arrive sur une section, mais le header masque le titre.
**Action** : je scrolle de ±100 px.
**Résultat** : l’algorithme tient compte d’un **offset (≈102 px)**, la section devient active **au bon moment**.

---

## 🧠 Moteur (tech) — qui fait quoi, dans quel ordre

### 1) Les **données observées**

-   **`src/assets/data/sections.ts`** : liste des IDs **sans `#`** (ex. `expert`, `avec-permis`, …).

    > ⚠️ Doit couvrir **toutes** les ancres utilisées dans `menuItems.ts` (où elles sont **avec `#`**).

-   **`menuItems.ts`** : pour chaque parent/sous-item, on a `path`, `AnchorId` (`'#expert'`), `scrollOffset` (souvent `102` pour les sous-items).

### 2) La **détection de section active**

-   **`useScrollContext`** (context)

    -   Observe les sections (via **`IntersectionObserver`** ou **scroll listener**).
    -   Met à jour **`activeSection`** (ex. `'expert'`) dès qu’une section franchit le **seuil** (voir réglages conseillés ci-dessous).
    -   S’exécute :

        -   sur **scroll**,
        -   après un **scroll programmatique** (Étape 2),
        -   à l’**arrivée de route** (deep link).

> Tu as aussi `utils/addScrollListener.ts` (fallback scrollY). Si tu utilises l’Observer, garde `addScrollListener` pour des cas précis (metrics, effets parallèles), pas pour l’active-section.

### 3) La **synchronisation des classes**

-   **`updateMenuClasses(...)`** (dans `utils/updateMenuUtils.ts`)

    -   Entrées : **menuItems**, **activeSection**, **currentRoute**.
    -   Cas **ancre trouvée** :

        -   matche `'#' + activeSection` avec `AnchorId` des sous-items → **active** parent + sous-item.

    -   Cas **sans ancre** :

        -   active l’item dont `path === currentRoute`.

    -   Retourne une **copie** des items avec les **classes** `.active` injectées (parent `.head-link.active`, sous-item `.nav-link.active`).

### 4) Le **chaînage avec la navigation**

-   À chaque navigation/scroll (Étape 2) :

    -   **`useInitialScroll`** applique l’ancre + **offset**.
    -   Le ScrollSpy (ici `useScrollContext`) **déclenche** la mise à jour de `activeSection`.
    -   **`updateMenuClasses`** recalcule et **Header** passe les items **en props** à `Nav` → rendu actif correct.

---

## 🔧 Réglages recommandés (pour un ScrollSpy naturel)

-   **IntersectionObserver** :

    -   `root: null` (viewport)
    -   `rootMargin: "-102px 0px -40% 0px"`
        (haut “compensé” pour le header fixe, bas un peu réduit pour valider la section _au centre_)
    -   `threshold: 0.25 ~ 0.6`
        (selon la hauteur de section ; 0.5 donne un comportement “au centre de l’écran”)

-   **Règle de décision** si plusieurs sections intersectent :

    -   **prioriser** celle avec le **plus grand ratio d’intersection**,
    -   sinon, la section dont le **milieu** est le plus proche du **milieu du viewport** (robuste en mises en page variées).

---

## 🧩 Chaînes complètes (lecture rapide)

### Scroll intra-page (clic sous-item)

```
SubMenu.onClick('/p1#avec-permis', 102)
  → handleNavClick(...)
     ├─ même route → handleScrollClick('#avec-permis', 102)
     └─ (smooth scroll)
        → useScrollContext détecte 'avec-permis'
           → activeSection='avec-permis'
              → updateMenuClasses(...) // Services + Avec Permis actifs
```

### Deep link

```
Arrivée sur /p2#expert
  → useInitialScroll('#expert', 102)
     → handleScrollClick(...)
/!\ pas d’action user
        → useScrollContext → activeSection='expert'
           → updateMenuClasses(...) // Tarifs + Confirmé actifs
```

### Route sans sections observées

```
Navigation vers /blog
  → activeSection = null
     → updateMenuClasses(...) // Blog actif (route-only)
```

---

## 📁 Fichiers & responsabilités (mémo)

-   `utils/context/ScrollContext.tsx` → **source de vérité** pour `activeSection` (Observer/scroll).
-   `assets/data/sections.ts` → **contrat** des IDs observables.
-   `assets/data/menuItems.ts` → **contrat** des ancres/offsets du menu.
-   `utils/updateMenuUtils.ts` → **projection** `activeSection/currentRoute → classes actives`.
-   `utils/scrollUtils.ts` → **`useInitialScroll`** (applique l’ancre à l’arrivée).
-   `utils/fnScrollUtils.ts` → **`handleScrollClick`** (smooth + offset).
-   `components/header/Header.tsx` → **assemble** : lit `activeSection`, appelle `updateMenuClasses`, passe au rendu.

---

# Étape 5 — Recherche (NavInput + useSearchHandler + SearchContext)

## 🎯 L’idée

Recherche “header” unifiée :

-   **Saisie** dans `NavInput`
-   **Suggestions** instantanées (sous-menu)
-   **Validation** → URL sync (`/search?query=...`) et **store** de résultats (SearchContext)
-   **Reset** propre (UI + URL)

---

## 📍 Où ça vit (fichiers clés)

-   `components/header/navInput/NavInput.tsx` → conteneur UI (input + sous-résultats)
-   `components/header/navInput/RenderInput.tsx` → input + gestion Enter
-   `components/header/navInput/RenderInputButton.tsx` → icône Search / bouton Reset
-   `components/header/navInput/SubResult.tsx` → liste de suggestions
-   `components/header/navInput/useSearchHandler.tsx` → **moteur** (query, suggestions, submit, reset)
-   `utils/searchMenu.ts` → recherche plein-texte sur la **data menu**
-   `utils/searchUtils.ts` → `filterSuggestions(...)`
-   `utils/useURLParams.ts` → lecture/écriture des `?query=` | `?badKeyWord=`
-   `utils/updateMenuUtils.ts` → `useMenuBehavior()` (⚠️ **`navRef`** sur `<nav class="research">`)
-   `context/SearchContext` _(non listé ici, mais utilisé)_ → `menuData`, `results`, `query`

> Data côté menu enrichie par `attachContentToMenu(...)` pour permettre de chercher **aussi** dans les contenus attachés.

---

## 🔁 Cycle (saisir → suggérer → valider → router)

1. **Saisie**
   `RenderInput.onChange` → `useSearchHandler.handleSearch()`

-   < 3 chars → **pas** de suggestions
-   ≥ 3 chars → `searchQuery(menuData, query)` → `filterSuggestions(...)` → `suggestions` + **ouvrir** `SubResult`

2. **Suggestion (clic)**
   `SubResult.onSuggestionSelect()` →

-   `setQuery(suggestion)` + `setResults(...)`
-   URL: `setParam("query", suggestion)` + `router.push('/search?query=...')`
-   **Fermer** le sous-résultat

3. **Submit (Enter / icône)**
   `handleSubmit()` →

-   `results = searchQuery(menuData, trimmedQuery)`
-   Si 0 résultat → `/search?badKeyWord=...`
-   Sinon → `/search?query=...`
-   **Fermer** le sous-résultat

4. **Reset (croix)**
   `RenderInputButton` (si `hasQuery || isSubmitted`) → `handleReset()`

-   Vide `query`/`suggestions`/`results`
-   Supprime `?query` et `?badKeyWord`

5. **Menu behavior**
   `useMenuBehavior` + **`ref={navRef}` sur `<nav class="research">`** → clics à l’intérieur **non** considérés “extérieurs” → pas de fermeture intempestive.

---

## 🧠 Moteur (tech) — qui fait quoi

-   **`Nav.tsx`**
    Monte la nav **Recherche** :

    ```tsx
    <nav className="research">
      <NavInput ... showNavLinks={shouldShowNavLinks('search')} />
    </nav>
    ```

    `showNavLinks` contrôle **apparition** de l’input via `HiddenDelayComponent`.

-   **`NavInput.tsx`**
    Orchestration UI : **form** + **RenderInput** + **SubResult**.

    -   `onMenuToggle(menuItem.id)` ouvre/ferme la zone de saisie dans le header
    -   `isSubResultOpen && query` → affiche `SubResult`

-   **`RenderInput.tsx`**

    -   Input **contrôlé** (SearchContext)
    -   Enter → `handleSubmit`
    -   Révèle le label avec `HiddenDelayComponent` (matching visuel avec tes autres liens)

-   **`RenderInputButton.tsx`**

    -   **Icône Search** (submit) ↔ **Close** (reset) en fonction de l’état
    -   Pas de style imposé (reprend `.nav-icon`)

-   **`useSearchHandler.tsx`** _(cœur logique)_

    -   `handleSearch` → suggestions (seuil 3 caractères)
    -   `handleSubmit` → route `/search?...` + `setResults`
    -   `handleSuggestionClick` → idem, mais prérempli par la suggestion
    -   `handleReset` → nettoie Context + URL

---

## 🧪 User stories (Given / When / Then)

### 5.1 — Suggestions instantanées

**Given** le header visible, je tape `tar` dans la zone Recherche
**When** j’atteins 3 caractères
**Then** un sous-menu s’ouvre avec `Tarifs`, `Débutant`, `Confirmé` (etc.) selon `filterSuggestions`.

### 5.2 — Validation par Enter

**Given** j’ai saisi `confirmé`
**When** j’appuie sur **Enter**
**Then** l’URL devient `/search?query=confirm%C3%A9`, `results` est mis à jour dans le SearchContext, le sous-menu se ferme.

### 5.3 — Aucun résultat

**Given** je tape `xyzabc`
**When** j’appuie sur **Enter**
**Then** l’URL devient `/search?badKeyWord=xyzabc`, `results=[]`, l’UI de la page Search peut afficher “Aucun résultat”.

### 5.4 — Sélection d’une suggestion

**Given** le sous-menu de suggestions est ouvert
**When** je clique `Débutant`
**Then** `query="Débutant"`, `results` mis à jour, navigation vers `/search?query=Débutant`, le sous-menu se ferme.

### 5.5 — Reset rapide

**Given** j’ai une recherche saisie (ou soumise)
**When** je clique l’icône **Close**
**Then** input vidé, suggestions fermées, `results=[]`, suppression de `?query`/`?badKeyWord` de l’URL.

### 5.6 — Aucune fermeture “fantôme”

**Given** je clique dans la zone Recherche / Suggestions
**When** je sélectionne une suggestion
**Then** le menu **ne** se ferme pas avant l’action (grâce à `ref={navRef}` sur `<nav class="research">`), puis se nettoie proprement après.

---

## ⚙️ Contrats / Config

-   **Seuil suggestions** : 3 caractères (`handleSearch`)
-   **Paramètres URL** : `?query=` | `?badKeyWord=`
-   **`menuItems.search`** : id=`search`, svg=`Search`, path=`/search`
-   **Accessibilité** : `option` cliquable dans `SubResult` (ok visuellement) ; si tu veux un HTML plus sémantique, **`<button>`** conviendrait mieux — non bloquant pour ton moteur.

---

# 🔗 Contrats & règles de câblage

-   **`AnchorId` ↔ `sections.ts`** : chaque `AnchorId` (ex. `#expert`) doit exister dans `sections.ts` (`{ id: 'expert' }`).
-   **Offsets** : ordre d’héritage `subItem.scrollOffset ?? parent.scrollOffset ?? 0`.
-   **Classes cohérentes** : utilise bien `className="connexion"` côté JSX pour matcher `.connexion` côté SCSS (éviter `connect`).
-   **`ref={navRef}`** : pose-le sur **tous** les `<nav>` concernés (`main-nav`, `reservationId`, `research`, `connexion`).

---

# ✅ Check-list de non-régression

-   [ ] `ref={navRef}` présent sur **tous** les `<nav>` (main / reservationId / research / connexion).
-   [ ] Tous les `AnchorId` ont leur **id** correspondant dans `sections.ts`.
-   [ ] Offsets hérités correctement (subItem > parent > 0).
-   [ ] `/blog` → item **Blog** actif par **route** (pas par `activeSection`).
-   [ ] **ESC** et **outside-click** ferment toujours les sous-menus.
-   [ ] **Breakpoints** : les 4 flags de `useResize` basculent et l’UI suit (≥1440 / 1170–1439 / 1024–1169 / <1024).
-   [ ] **Clic modifié** : ouvre en **nouvel onglet**, sans scroll côté onglet courant.
-   [ ] **Recherche** : suggestions à ≥3 caractères, `?query=` / `?badKeyWord=` poussés, bouton reset OK.

---
