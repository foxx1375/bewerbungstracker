# Verwende ein Multi-Arch-Node-Image, das automatisch die richtige Architektur auswählt
FROM --platform=linux/amd64,linux/arm64 node:16

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json (wenn vorhanden) und installiere die Abhängigkeiten
COPY package*.json ./

RUN npm install

# Kopiere den Rest der Anwendung
COPY . .

# Baue die Anwendung (falls nötig, für Frontend)
# Für das Backend ist das nicht erforderlich
RUN npm run build

# Exponiere den Port, auf dem der Backend-Server läuft (3001)
EXPOSE 3001

# Starte den Server
CMD ["node", "server.js"]