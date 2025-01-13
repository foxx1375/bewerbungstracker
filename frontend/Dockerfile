# Wähle ein offizielles Node.js-Image als Basis
FROM node:16

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json, um die Abhängigkeiten zu installieren
COPY frontend/package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den gesamten Frontend-Code in das Arbeitsverzeichnis im Container
COPY frontend/ .
RUN ls -la /usr/src/app

# Baue die Anwendung für die Produktion
RUN npm run build

# Exponiere den Port, auf dem der Server laufen wird
EXPOSE 3000

# Setze den Startbefehl für die Anwendung
CMD ["npm", "start"]