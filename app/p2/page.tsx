import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tarifs",
    description:
        "Découvrez nos tarifs de coaching à la conduite sur le Havre : des formules accessibles dès 39,99€ par séance pour surmonter la peur de conduire, gérer le stress avant examen, se perfectionner et progresser en toute confiance.",
    alternates: {
        canonical: "https://peur-de-la-conduite.fr/tarifs",
        media: {
            "only screen and (max-width: 900px)":
                "https://mobile.peur-de-la-conduite.fr/tarifs",
            "only screen and (min-width: 900px)":
                "https://desktop.peur-de-la-conduite.fr/tarifs",
        },
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Tarifs | Peur de la conduite",
        description:
            "Découvrez les tarifs de nos coachings personnalisés pour vaincre la peur de la conduite : gestion du stress, perfectionnement, conduite accompagnée et coaching anti-amaxophobie au Havre.",
        url: "https://peur-de-la-conduite.fr/tarifs",
        siteName: "Peur de la conduite",
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: "/img/about/avatar.webp",
                width: 225,
                height: 225,
                alt: "Mounir Bouakkaz - Coaching conduite au Havre",
            },
        ],
    },
    icons: {
        icon: [
            {
                url: "/img/favicon/logo.svg",
                type: "image/svg+xml",
            },
        ],
    },
};

import React from "react";
import { servicesData } from "@assets/data/servicesData";
import TarifsIcon from "../../src/components/svg_Icon/Tarifs";
import SectionContainer from "../blog/SectionContainer";
export default function Page() {
    return (
        <SectionContainer
            id="prices"
            title="Tarifs Prestations"
            icon={<TarifsIcon />}
        >
            {Object.values(servicesData).map((category) => (
                <React.Fragment key={category.id}>
                    <div className="ref" id={category.trf}>
                        <section className="category flx-c">
                            <h2 className="category-title">{category.title}</h2>
                            <p className="category-intro">{category.intro}</p>

                            {category.services.map((service, index) => (
                                <div
                                    className="packs-container"
                                    key={index + "trf"}
                                >
                                    <div className="price-title">
                                        <div className="coach">
                                            <p>Coaching</p>
                                            <div className="service-image">
                                                <img
                                                    src={service.imgSrc}
                                                    alt={service.imgAlt}
                                                />
                                            </div>
                                        </div>
                                        <div className="coach2">
                                            <div className="empty"></div>

                                            <h3>{service.title}</h3>
                                        </div>
                                    </div>
                                    <div className="price-card">
                                        <table className="price-table">
                                            <thead>
                                                <tr>
                                                    <th>Nb de Séances</th>
                                                    <th>Prix Total (€)</th>
                                                    <th>Prix Séance (€)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {category.prices.map(
                                                    (price, idx) => (
                                                        <tr key={idx}>
                                                            <td className="nb-sessions">
                                                                {price.sessions}
                                                            </td>
                                                            <td className="text-center">
                                                                {price.total.toFixed(
                                                                    2
                                                                )}
                                                                €
                                                            </td>
                                                            <td className="text-center">
                                                                {price.perSession.toFixed(
                                                                    2
                                                                )}
                                                                €
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                </React.Fragment>
            ))}
        </SectionContainer>
    );
}
