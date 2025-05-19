import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function Index() {
  // نحفظ الـ Asset المختار بدل DocumentResult
  const [file, setFile] = useState<DocumentPicker.Asset | null>(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // اختيار صورة
  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "image/*" });
    if (res.assets && res.assets.length) {
      const asset = res.assets[0];
      setFile(asset);
      setStatus(`تم اختيار: ${asset.name}`);
      setResult("");
    } else {
      setStatus("لم يتم اختيار ملف");
      setFile(null);
    }
  };

  // رفع الصورة وتحليلها
  const upload = async () => {
    if (!file) {
      setStatus("يرجى اختيار ملف أولاً");
      return;
    }
    setLoading(true);
    setStatus("تحميل...");

    const form = new FormData();
    form.append("file", {
      uri: file.uri,
      name: file.name ?? "image.jpg",
      type: file.mimeType ?? "image/jpeg",
    } as any);

    try {
      const r = await fetch("http://192.168.1.75:8001/analyze-image/", {
        method: "POST",
        //headers: { "Content-Type": "multipart/form-data" },
        body: form,
      });
      if (!r.ok) throw new Error("فشل التحليل");
      const data = await r.json();
      setResult(JSON.stringify(data, null, 2));
      setStatus("نجاح");
    } catch (e: any) {
      setStatus(`خطأ: ${e.message}`);
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "flex-start" }}>
      <Button title="اختر ملف" onPress={pickFile} />
      <View style={{ marginVertical: 10 }}>
        <Button title="إرسال" onPress={upload} disabled={loading} />
      </View>
      {loading && <ActivityIndicator size="large" />}
      <Text style={{ marginTop: 10 }}>حالة: {status}</Text>
      <ScrollView
        style={{
          marginTop: 10,
          backgroundColor: "#f0f0f0",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text selectable>{result}</Text>
      </ScrollView>
    </View>
  );
}
