// @assets/data/interfaces/content.ts
import { socialSvgComponents } from "../../../components/svg_Icon/social/socialSvgComponents";
// Interface pour le contenu "About"
export interface AboutCardIdentity {
    firstName: string;
    name: string;
    profession: string;
}

export interface AboutCardContent {
    description: string[];
}

export interface AboutContent {
    cardIdentity: AboutCardIdentity;
    cardContent: AboutCardContent;
}

// Interface pour le contenu "Slider"
export interface SliderContent {
    h2: string;
    h2bold: string;
    description: string;
    ref: string;
    go: string;
    slideRef: number;
}
export interface SliderInfo {
    info: string;
}

// Interface pour le contenu "Service"
export interface ServiceContent {
    description: string;
}

// Type pour le contenus contact

export interface ContactAnnouncement {
    message: string;
}

export interface ContactDetail {
    svg: string;
    text: string;
    link?: string;
    alt: string;
}

export interface SocialLink {
    svg: keyof typeof socialSvgComponents;
    link: string;
}

export type Content =
    | SliderContent
    | SliderInfo
    | AboutContent
    | ServiceContent
    | ContactAnnouncement
    | ContactDetail
    | SocialLink;
