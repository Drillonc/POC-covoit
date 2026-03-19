# CapCovoit

Une application très simple avec :

- **Backend** : Spring Boot + JPA (connexion à une base de données via `application.properties`)
- **Frontend** : React + Vite (deux pages : login + hello user)



## Lancer le backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Le backend écoute sur `http://localhost:8080` et expose l'API :

- `POST /api/login` (body JSON `{ "username": "...", "password": "..." }`)

---

## Lancer le frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:3000`.

---