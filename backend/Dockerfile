# استخدم صورة بايثون 3.12 خفيفة
FROM python:3.12-slim

# --- NEW: install Tesseract OCR binary ---
RUN apt-get update && apt-get install -y \
        tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*
    
# مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ كود المصدر
COPY ./src /app/src

# نسخ ملف المتطلبات
COPY requirements.txt /app/requirements.txt

# تحديث pip وتثبيت المتطلبات
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# تعيين PYTHONPATH لسهولة استيراد الحزم داخل src
ENV PYTHONPATH=/app/src

# فتح المنفذ 8000 ليتمكن من الوصول للخارج
EXPOSE 8000

# تشغيل السيرفر مع وضع إعادة التحميل (للتطوير)
CMD ["uvicorn", "my_smart_scan_app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]