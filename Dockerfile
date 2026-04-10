FROM node:18-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN useradd -m appuser

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN chown -R appuser:appuser /app

USER appuser

CMD ["node", "index.js"]
