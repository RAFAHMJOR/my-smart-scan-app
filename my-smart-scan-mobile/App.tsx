import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [file, setFile] = useState<DocumentPicker.DocumentResult | null>(null);
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
    if (res.type === 'success') {
      setFile(res);
      setStatus('تم اختيار الملف: ' + res.name);
      setResult('');
    } else {
      setStatus('لم يتم اختيار ملف');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('يرجى اختيار ملف أولاً');
      return;
    }
    setLoading(true);
    setStatus('تحميل...');
    setResult('');

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await fetch('http://localhost:8001/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`خطأ في الرفع: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      setStatus('نجاح');
    } catch (error: any) {
      setStatus(`خطأ: ${error.message}`);
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Scan - رفع الملف وتحليل النص</Text>
      <Button title="اختر ملف" onPress={pickFile} />
      <View style={{ marginVertical: 10 }}>
        <Button title="إرسال" onPress={handleUpload} disabled={loading} />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <Text style={styles.status}>حالة: {status}</Text>
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.result}>{result}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  status: { marginTop: 20, fontSize: 16 },
  resultContainer: { marginTop: 10, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, maxHeight: 300 },
  result: { fontFamily: 'monospace', fontSize: 14 },
});
