import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Accueil | Peur de la conduite",
};

export default function Home() {
    return (
        <>
            <section className="section slider-bg" id="slider"></section>
            <section className="section about-bg" id="about">
                <div className="fixed-menu"></div>
            </section>
            <section className="section" id="services">
                <div className="fixed-menu"></div>
            </section>
            <section className="section" id="contact">
                <div className="fixed-menu"></div>
            </section>
        </>
    );
}
