import './globals.css';

export const metadata = {
  title: 'DSDMPT UI - Direktorat Sumber Daya Manusia dan Pengembangan Talenta',
  description: 'Direktorat Sumber Daya Manusia dan Pengembangan Talenta (DSDMPT) Universitas Indonesia - Mengelola layanan SDM dan pengembangan talenta terbaik di Universitas Indonesia.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
