# my-smart-scan-mobile/Dockerfile
FROM node:18-alpine

# 1. تثبيت expo-cli عالمياً
RUN npm i -g expo-cli@6
RUN npm install -g @expo/ngrok@^4.1.0


# 2. إعداد مسار العمل ونسخ المشروع
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# expo Web يستخدم 8081 تلقائياً (سنُعيد توجيهه إلى 19006/19000 لاحقاً)
EXPOSE 8081 19000 19001 19002 19006

# 3. نسخ باقي الكود
COPY . .

# 4. الأمر الافتراضي: تشغيل Expo Dev Server على كل الواجهات
#CMD ["npx", "expo", "start", "--dev-client", "--tunnel", "--clear", "--host", "0.0.0.0"]
#CMD ["npx", "expo", "start", "--dev-client", "--clear", "--host", "lan"]
CMD ["npx", "expo", "start", "--dev-client", "--clear", "--tunnel"]
