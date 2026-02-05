FROM node:18-alpine

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy pliki zależności
COPY package.json package-lock.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę kodu
COPY . .

# Otwieramy port (dla Vite to zwykle 5173, dla CRA 3000 - dostosuj w compose)
EXPOSE 3000
EXPOSE 5173

# Uruchamiamy aplikację (dodajemy --host, żeby była widoczna poza kontenerem)
# UWAGA: Jeśli używasz Vite, komenda to często "npm run dev -- --host"
CMD ["npm", "start"]