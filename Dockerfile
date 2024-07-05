# Step 1: Choose the base Image
FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 8000
CMD ["node", "server.js"]