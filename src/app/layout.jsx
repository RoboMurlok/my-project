import "./globals.css";
import { Geist, Bad_Script, Caveat } from "next/font/google";
import MyHeader from "./components/MyHeader/MyHeader";

const geistGeist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "cyrillic"],
});

const geistBadScript = Bad_Script({
  variable: "--font-badscript",
  weight: "400",
  subsets: ["cyrillic-ext", "cyrillic", "latin"],
});

export const geistCaveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export default function RootLayout({ children }) {
  
  return (
    <html lang="ru">
      <body
        className={`${geistBadScript.variable} ${geistGeist.variable} ${geistCaveat.variable}`}
      >
        <div className="container">
          <MyHeader />
          {[children]}
        </div>
      </body>
    </html>
  );
}
