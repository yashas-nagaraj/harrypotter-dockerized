# Harry Potter — Dockerized Houses App

This repository contains a simple demo web application showcasing the four Hogwarts houses.
It's designed to run locally using Docker Compose with one frontend (React/Vite), four house services (Express/Node),
and a Postgres database to store questions submitted for each house.

## What to add before running
- Add license-permitted images to `frontend/public/images/`:
  - hero.jpg
  - gryffindor.jpg
  - slytherin.jpg
  - ravenclaw.jpg
  - hufflepuff.jpg
- (Optional) Update DB credentials in `docker-compose.yml` or use an `.env` mechanism.

## Run locally
1. Build and start all containers:
   ```bash
   docker compose up --build
   ```
2. Open the frontend in your browser: `http://localhost:3000`
3. Click any house, submit a question. Questions are stored in Postgres.

## Notes
- Do not commit copyrighted Harry Potter images. Use your own images or permissive sources (Unsplash, Pexels) or generated artwork.
- For production, consider using a reverse proxy, secrets management, and CI pipelines.
