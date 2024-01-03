const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.get('/generate-pdf', async (req, res) => {

  // Hedef web sayfasının URL'si
  const targetId = req.query.token;
  const targetUrl = 'https://isbul.net/pdf/'

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    // Puppeteer başlat
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Sayfayı ziyaret et
    await page.goto(targetUrl + targetId, { waitUntil: 'networkidle2' });

    // PDF olarak sayfayı döndür
    const pdfBuffer = await page.pdf();

    // Tarayıcıyı kapat
    await browser.close();

    // PDF'i yanıt olarak gönder
    res.type('application/pdf').send(pdfBuffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
