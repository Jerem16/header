import React from "react";
import Image from "next/image";
const Loader = () => {
    return (
        <div className="loader">
            <div className="ld-circleBG"></div>
            <div className="ld-frame">
                <Image
                    src="/img/retroviseur.svg"
                    alt="loader"
                    width={225}
                    height={225}
                />
                <div className="ld-dot2"></div>
                <div className="ld-dot1"></div>
                <div className="ld-dot"></div>
            </div>
        </div>
    );
};

export default Loader;
