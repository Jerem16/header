import localFont from "next/font/local";
import "../src/assets/styles/main.scss";
import { SearchProvider } from "@/src/utils/context/SearchContext";
import { Suspense } from "react";
import HeaderProps from "./headerProps";
import ScrollProvider from "../src/utils/context/ScrollContext";
import ScrollSectionsWrapper from "./ScrollSectionsWrapper";
import Loader from "@/src/components/loader/Loader";

export const RobotoFlex = localFont({
    src: "/fonts/RobotoFlex.woff2",
    variable: "--RobotoFlex",
    weight: "100 900",
    display: "swap",
});

const Montserrat = localFont({
    src: "./fonts/Montserrat.woff2",
    variable: "--montserrat",
    weight: "100 900",
    display: "swap",
});

const Nunito = localFont({
    src: "./fonts/Nunito.woff2",
    variable: "--nunito",
    weight: "100 900",
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr-FR">
            <body
                className={`${RobotoFlex.variable} ${Montserrat.variable} ${Nunito.variable}`}
                id="top"
            >
                <ScrollProvider>
                    <ScrollSectionsWrapper>
                        <SearchProvider>
                            <Suspense fallback={<Loader />}>
                                <header>
                                    <div className="content-wrapper">
                                        <HeaderProps />
                                    </div>
                                </header>
                                <main>{children}</main>
                            </Suspense>
                        </SearchProvider>
                    </ScrollSectionsWrapper>
                </ScrollProvider>
            </body>
        </html>
    );
}
