FROM node:18-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create user with UID 10001 (IMPORTANT)
RUN useradd -u 10001 -m appuser

COPY package*.json ./
RUN npm install

COPY . .

# Give permission
RUN chown -R 10001:10001 /app

# Use numeric user (REQUIRED by Choreo)
USER 10001

CMD ["node", "index.js"]
