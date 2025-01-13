FROM node:16

# Setze das Arbeitsverzeichnis
WORKDIR /usr/src/app

# Kopiere package.json und installiere die Abhängigkeiten
COPY backend/package*.json ./
RUN ls -la /usr/src/app
RUN npm install

# Kopiere den Rest der Anwendung
COPY backend/ .

# Exponiere den Port
EXPOSE 3001

# Starte die Anwendung
CMD ["node", "server.js"]