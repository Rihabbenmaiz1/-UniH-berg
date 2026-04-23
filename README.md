# 🏠 UniH-berg — Plateforme de Gestion d'Hébergement Universitaire

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![Maven](https://img.shields.io/badge/Maven-3.x-red?style=for-the-badge&logo=apachemaven)

**Projet DS1 — Gestion d'Hébergement Universitaire**  
*Faculté des Sciences Économiques et de Gestion de Tunis (FSEGT) — 23 Avril 2026*

</div>

---

## 📖 Description

**UniH-berg** est une application web fullstack complète permettant de **dématérialiser la gestion des foyers universitaires**.  
Elle couvre l'ensemble du cycle de vie de l'hébergement étudiant : de l'inscription à la réservation de chambre, en passant par la gestion des infrastructures (foyers, blocs, chambres).  
Le projet intègre également un **Chatbot propulsé par l'IA Générative** pour assister les étudiants de manière personnalisée.

---

## 👩‍💻 Équipe

<div align="center">

| 👤 Nom complet | 🎓 Établissement |
|:---:|:---:|
| **Ben Maiz Rihab** | FSEGT |
| **Ghidaoui Douaa** | FSEGT |
| **Souid Nourine** | FSEGT |

</div>

---

## 🛠️ Stack Technique

### 🔵 Backend
| Technologie | Rôle |
|---|---|
| **Java 17** | Langage principal |
| **Spring Boot 3** | Framework backend |
| **Spring Data JPA** | Accès base de données (Lazy / Eager Fetch) |
| **Spring MVC** | Exposition des services REST |
| **DTO Pattern** | Data Transfer Objects — séparation entités / API |
| **Swagger UI** | Documentation et test interactif de l'API |
| **MySQL** | Base de données relationnelle |
| **Maven** | Gestion des dépendances |

### 🟢 Frontend
| Technologie | Rôle |
|---|---|
| **React.js 18** | Interface utilisateur (SPA) |
| **Vite** | Outil de build rapide |
| **Axios** | Requêtes HTTP vers l'API REST |
| **CSS** | Stylisation de l'interface |

### 🤖 Intelligence Artificielle
| Technologie | Rôle |
|---|---|
| **IA Générative** | Chatbot contextuel intégré à l'application |

---

## 🗂️ Modèle de données

Le système repose sur **6 entités** liées entre elles :

```
Université (1) ──── (1) Foyer (1) ──── (*) Bloc (1) ──── (*) Chambre
                                                                  │
                                                                  │ (*)
                                                             Réservation
                                                                  │ (*)
                                                               Étudiant
```

| Entité | Attributs principaux |
|---|---|
| **Université** | idUniversite, nomUniversite, adresse |
| **Foyer** | idFoyer, nomFoyer, capaciteFoyer |
| **Bloc** | idBloc, nomBloc, capaciteBloc |
| **Chambre** | idChambre, numeroChambre *(unique)*, typeC `[SIMPLE / DOUBLE / TRIPLE]` |
| **Étudiant** | idEtudiant, nomEt, prenomEt, cin, ecole, dateNaissance |
| **Réservation** | idReservation, anneeUniversitaire, estValide |

---

## 🚀 Fonctionnalités

### 🏗️ Module Gestion des Infrastructures
- Enregistrement et mise à jour des **universités**
- Création des **foyers** avec liaison exclusive à une université (1-1)
- Gestion des **blocs** (sous-divisions architecturales du foyer)
- Ajout des **chambres** par bloc avec type `SIMPLE`, `DOUBLE` ou `TRIPLE`

### 👤 Module Gestion des Étudiants
- Inscription et mise à jour des informations personnelles
- Consultation du profil et de l'historique d'hébergement

### 📋 Module Gestion des Réservations
- Vérification en **temps réel** de la disponibilité d'une chambre
- Génération automatique de l'ID de réservation :
  > Format : `AnnéeUniversitaire – NomBloc – NumChambre – CIN`  
  > Exemple : `2024/2025-Bloc A-1-12345678`
- Affectation d'étudiants selon la capacité du type de chambre
- Validation et annulation des réservations

### 🤖 Chatbot IA
- Le chatbot comprend les demandes en **langage naturel**
- Il interroge la base de données en temps réel
- Il génère des réponses **empathiques et personnalisées**
- Exemple : *"Je suis en 1ère année, je stresse, quel bloc est le plus calme ?"* → réponse avec disponibilités

---

## ⚙️ Services avancés (Partie 5)

| # | Service | Description |
|---|---|---|
| 01 | `affecterFoyerAUniversite` | Lier un foyer à une université |
| 02 | `desaffecterFoyerAUniversite` | Détacher le foyer d'une université |
| 03 | `affecterChambresABloc` | Affecter une liste de chambres à un bloc |
| 04 | `affecterBlocAFoyer` | Lier un bloc à un foyer |
| 05 | `ajouterReservationEtAssignerAChambreEtAEtudiant` | Créer une réservation et l'assigner |
| 06 | `getChambresParNomBloc` | Lister les chambres d'un bloc donné |
| 07 | `nbChambreParTypeEtBloc` | Compter les chambres par type dans un bloc |
| 08 | `getReservationParAnneeUniversitaire` | Réservations par période universitaire |
| 09 | `getChambresNonReserveParNomFoyerEtTypeChambre` | Chambres disponibles par foyer et type |
| 10 | `ajouterFoyerEtAffecterAUniversite` | Créer un foyer complet avec blocs |
| 11 | `annulerReservation` | Annuler la réservation active d'un étudiant |

---

## 🧩 Architecture technique

```
┌─────────────────────────────────────────────┐
│               CLIENT (React.js)             │
│         Single Page Application (SPA)       │
└────────────────────┬────────────────────────┘
                     │  HTTP / REST (JSON)
┌────────────────────▼────────────────────────┐
│            BACKEND (Spring Boot)            │
│  RestControllers → Services → Repositories  │
│         + DTO Pattern + Swagger UI          │
└────────────────────┬────────────────────────┘
                     │  JPA / Hibernate
┌────────────────────▼────────────────────────┐
│           BASE DE DONNÉES (MySQL)           │
└─────────────────────────────────────────────┘
```

> 💡 **Pourquoi les DTOs ?**  
> Les entités JPA contiennent des relations bidirectionnelles qui causent des boucles infinies lors de la sérialisation JSON (`StackOverflowError`). Les DTOs permettent de n'exposer que les données utiles au frontend, sans références circulaires.

---

## 📁 Structure du projet

```
UniH-berg/
├── foyer-project2-master/              # 🔵 Backend Spring Boot
│   ├── pom.xml
│   └── src/main/java/tn/fsegt/foyer/
│       ├── Controllers/                # Contrôleurs MVC
│       ├── RestControllers/            # Endpoints REST + ChatController
│       ├── Services/                   # Logique métier
│       ├── Entities/                   # Entités JPA (Foyer, Bloc, Chambre...)
│       ├── Repositories/               # Spring Data JPA
│       └── DTO/                        # Data Transfer Objects
│
└── front_foyer/                        # 🟢 Frontend React
    ├── package.json
    └── src/
        ├── App.jsx
        ├── Chatbot.jsx                 # 🤖 Interface du chatbot IA
        ├── EtudiantCard.jsx
        ├── FoyerModule.jsx
        └── HistoriqueModal.jsx
```

---

## ▶️ Comment lancer le projet (depuis le fichier .zip)

### Prérequis à installer
- ✅ [Java 17+](https://www.oracle.com/java/technologies/downloads/)
- ✅ [Node.js 18+](https://nodejs.org/)
- ✅ [MySQL 8](https://dev.mysql.com/downloads/)
- ✅ [Maven 3+](https://maven.apache.org/)
- ✅ Un IDE Java (IntelliJ IDEA recommandé)

---

### Étape 1 — Extraire le fichier ZIP

Faites un clic droit sur le fichier `UniH-berg.zip` → **Extraire tout**  
Vous obtenez le dossier `UniH-berg/` contenant le backend et le frontend.

---

### Étape 2 — Créer la base de données MySQL

Ouvrez MySQL et exécutez :
```sql
CREATE DATABASE foyer_db;
```

---

### Étape 3 — Configurer le Backend

Ouvrez le fichier :
```
foyer-project2-master/src/main/resources/application.properties
```
Et modifiez :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/foyer_db
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE
spring.jpa.hibernate.ddl-auto=update
```

---

### Étape 4 — Lancer le Backend

```bash
cd foyer-project2-master
mvn spring-boot:run
```

✅ Le serveur démarre sur **`http://localhost:8089`**  
📄 Swagger UI disponible sur **`http://localhost:8089/swagger-ui.html`**

---

### Étape 5 — Lancer le Frontend

```bash
cd front_foyer
npm install
npm run dev
```

✅ L'application s'ouvre sur **`http://localhost:5173`**

---

## 🎓 Contexte académique

> Projet réalisé dans le cadre du **DS1**  
> **Faculté des Sciences Économiques et de Gestion de Tunis — FSEGT**  
> Date de rendu : **Jeudi 23 Avril 2026**
