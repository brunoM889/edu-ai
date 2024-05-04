import { Poppins } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";
const inter = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata = {
  title: "EduAI",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-[#FFF7E9] bg-[#161616] h-full w-full min-h-[100vh] relative`}>
        {/* This div generates the background effect */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] z-0"></div>
        <Nav/>
        {children}
      </body>
    </html>
  );
}
