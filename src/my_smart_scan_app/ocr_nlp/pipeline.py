import pytesseract
from PIL import Image
import io
import joblib
import numpy as np
import os

# تحميل نموذج المشاعر المحفوظ
model_path = os.path.join(os.path.dirname(__file__), "sentiment_model.joblib")
model = joblib.load(model_path)

def process_image(image_bytes):
    """
    تستقبل الصورة بصيغة bytes، تقوم باستخراج النص وتصنيف المشاعر.
    """
    # تحويل bytes إلى صورة PIL
    image = Image.open(io.BytesIO(image_bytes))

    # استخدام Tesseract لاستخراج النص من الصورة
    extracted_text = pytesseract.image_to_string(image)

    # معالجة النص لتحليل المشاعر (نستخدم النموذج التدريبي)
    # النموذج يتوقع نصوص بشكل قائمة (list of strings)
    text_list = [extracted_text]

    # التنبؤ بالفئة (المشاعر)
    predicted = model.predict(text_list)[0]
     # ⬅️ تأكد أن القيمة ليست numpy.int64
    sentimentPred = int(predicted)  # يحوّلها إلى int بايثون عادي

    # يمكننا أيضًا إرجاع احتمالات التصنيف
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(text_list)[0]
    else:
        probabilities = None

    # إرجاع النتائج في شكل dict
    return {
        "extracted_text": extracted_text,
        "sentiment": sentimentPred,
        "probabilities": probabilities
    }