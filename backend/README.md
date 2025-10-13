# 📚 Mon Vieux Grimoire — Backend

Mon Vieux Grimoire - Backend est une API REST sécurisée permettant de gérer des livres, leurs descriptions, notes utilisateurs, et images associées. Ce projet est réalisé dans le cadre d'une formation.

---

## 🚀 Installation et lancement

### 📦 Prérequis

- Node.js ≥ 18 (testé avec v22.17.0)
- npm ≥ 9 (testé avec v10.9.2)
- Accès à une base MongoDB (locale ou distante)

### ⚙️ Installation

Cloner le dépôt, puis installer les dépendances :

```bash
git clone https://github.com/J-za/Mon_Vieux_Grimoire.git
cd backend
npm install
```

### 🔐 Configuration des variables d’environnement

Le fichier `.env.example` contient les variables à définir.  
Renommer ce fichier en `.env` et renseigner les valeurs selon l'environnement utilisé.

```bash
mv .env.example .env
```

> 🧠 Le fichier `.env` est ignoré par Git grâce au `.gitignore`. Ne pas le versionner.

### 🚀 Lancement

Démerrer le serveur en mode standard :

```bash
npm start
```

Le backend démarre sur le port défini dans `.env`.
Utiliser un port disponible sur la machine (ex : 3000, 4000, 8080…).

---

## 🧱 Structure du projet

```txt
backend/
├── controllers/       # Logique métier (books, user)
├── middleware/        # Authentification, compression d'image
├── models/            # Schémas Mongoose (Book, User)
├── routes/            # Endpoints API (books, auth)
├── images/            # Fichiers image uploadés et compressés
├── .env               # Variables d’environnement sensibles
├── .env.example       # Modèle de configuration
├── app.js             # Configuration de l’application Express
├── server.js          # Point d’entrée du serveur HTTP
├── package.json       # Dépendances et scripts
├── package-lock.json  # Verrouillage des versions
├── README.md          # Documentation du projet
```

---

## 🛠️ Outils et librairies utilisés

- Express : framework serveur Node.js
- Mongoose : ODM pour MongoDB
- Multer : gestion des fichiers uploadés
- Sharp : compression et conversion d’images
- Bcrypt : hachage des mots de passe
- JSON Web Token (JWT) : authentification sécurisée
- Dotenv : gestion des variables d’environnement
