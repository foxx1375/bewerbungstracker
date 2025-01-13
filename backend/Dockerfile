# Basis-Image von Node.js (16)
FROM node:16

# Installiere die nötigen Pakete für den Build (Build-Tools, etc.)
RUN apt-get update && apt-get install -y \
  python3 \
  g++ \
  make \
  && rm -rf /var/lib/apt/lists/*

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere package.json und package-lock.json, um Abhängigkeiten zu installieren
COPY backend/package*.json ./

# Installiere npm-Abhängigkeiten, einschließlich sqlite3
RUN npm install --build-from-source sqlite3

# Kopiere den Rest des Quellcodes
COPY backend/ .

# Exponiere den Port 3001
EXPOSE 3001

# Setze den Startbefehl für den Container
CMD ["node", "server.js"]