import React from "react";

const TermsOfUse = () => {
    return (
        <div className="pp_politique-container">
            <h2 className="pp_title" id="terms-of-use">
                Conditions Générales d&apos;Utilisation
            </h2>

            <section className="pp">
                <h3 className="pp_section-title">
                    📘 Acceptation des conditions
                </h3>
                <p>
                    En accédant à ce site, vous acceptez les présentes
                    conditions générales d&apos;utilisation sans réserve. Si
                    vous n&apos;êtes pas d&apos;accord avec l&apos;une de ces
                    conditions, veuillez ne pas utiliser le site.
                </p>
            </section>

            <section className="pp">
                <h3 className="pp_section-title">
                    🖥️ Accessibilité & responsabilités
                </h3>
                <ul className="pp_list">
                    <li>
                        Le site est accessible 24h/24 et 7j/7, sauf en cas de
                        maintenance ou de force majeure.
                    </li>
                    <li>
                        L&apos;utilisateur s&apos;engage à utiliser un matériel
                        récent et à jour, exempt de virus.
                    </li>
                    <li>
                        Le propriétaire ne pourra être tenu responsable des
                        dommages directs ou indirects liés à l&apos;utilisation
                        du site.
                    </li>
                </ul>
            </section>

            <section className="pp">
                <h3 className="pp_section-title">🔄 Modifications</h3>
                <p>
                    Les présentes conditions peuvent être modifiées à tout
                    moment. Nous vous encourageons à les consulter régulièrement
                    pour rester informé(e).
                </p>
            </section>

            <section className="pp">
                <h3 className="pp_section-title">
                    ⚖️ Propriété intellectuelle
                </h3>
                <p>
                    Tout le contenu du site (textes, images, logos, etc.) est
                    protégé par les lois sur la propriété intellectuelle. Toute
                    reproduction ou distribution sans autorisation est
                    interdite.
                </p>
            </section>
        </div>
    );
};

export default TermsOfUse;
