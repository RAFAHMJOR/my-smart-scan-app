# Dockerfile لـ Next.js Frontend
FROM node:18-alpine

WORKDIR /app

# تثبيت التبعيات
COPY package.json package-lock.json* ./
RUN npm install

# نسخ بقية الكود
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
