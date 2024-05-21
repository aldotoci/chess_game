import { ThemeProvider } from "@mui/material/styles";
import Navbar from "@/components/Navbar/Navbar";
import MUITheme from "@/components/settings/MUITheme";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Profile({children}) {
  return (
    <ThemeProvider theme={MUITheme}>
      <main
      className={`min-h-screen flex-col items-center ${inter.className}`}
      >
        <Navbar />
        {children}
      </main>
    </ThemeProvider>
  );
}
