import './globals.css'

export const metadata = {
  title: 'বাংলাদেশ নির্বাচন ২০২৬ | ডিজিটাল ভোটিং',
  description: 'বাংলাদেশ ১৩তম জাতীয় নির্বাচনের জন্য নিরাপদ ডিজিটাল ভোটিং প্ল্যাটফর্ম',
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
