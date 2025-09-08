// utils/autocomplete.ts
export type HtmlAutoComplete =
    | "name"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "nickname"
    | "username"
    | "new-password"
    | "current-password"
    | "email"
    | "tel"
    | "street-address"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level1"
    | "address-level2"
    | "address-level3"
    | "postal-code"
    | "country"
    | "country-name"
    | "organization"
    | "organization-title"
    | "url"
    | "photo"
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "sex"
    | "language"
    | "impp"
    | "cc-name"
    | "cc-given-name"
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-csc"
    | "cc-type"
    | "transaction-currency"
    | "transaction-amount"
    | "one-time-code"
    | "off"
    | "on";

/** Dictionnaire d’alias → valeur standard */
const ALIASES: Record<string, HtmlAutoComplete> = {
    // Identité
    name: "name",
    fullName: "name",
    firstName: "given-name",
    givenName: "given-name",
    middleName: "additional-name",
    lastName: "family-name",
    familyName: "family-name",
    surname: "family-name",
    nickName: "nickname",
    nickname: "nickname",
    user: "username",
    userName: "username",
    username: "username",

    // Auth
    password: "current-password",
    currentPassword: "current-password",
    newPassword: "new-password",
    otp: "one-time-code",
    oneTimeCode: "one-time-code",

    // Contact
    email: "email",
    mail: "email",
    telephone: "tel",
    phone: "tel",
    tel: "tel",

    // Adresse
    address: "street-address",
    street: "street-address",
    address1: "address-line1",
    address2: "address-line2",
    address3: "address-line3",
    city: "address-level2",
    state: "address-level1",
    region: "address-level1",
    province: "address-level1",
    department: "address-level1",
    zip: "postal-code",
    zipcode: "postal-code",
    postCode: "postal-code",
    postalCode: "postal-code",
    country: "country",
    countryName: "country-name",

    // Divers
    website: "url",
    url: "url",
    org: "organization",
    organization: "organization",
    jobTitle: "organization-title",
    photo: "photo",

    // Anniversaire
    birthday: "bday",
    birthDay: "bday-day",
    birthMonth: "bday-month",
    birthYear: "bday-year",
};

/** Liste blanche des tokens valides */
const VALID = new Set<HtmlAutoComplete>([
    "name",
    "honorific-prefix",
    "given-name",
    "additional-name",
    "family-name",
    "nickname",
    "username",
    "new-password",
    "current-password",
    "email",
    "tel",
    "street-address",
    "address-line1",
    "address-line2",
    "address-line3",
    "address-level1",
    "address-level2",
    "address-level3",
    "postal-code",
    "country",
    "country-name",
    "organization",
    "organization-title",
    "url",
    "photo",
    "bday",
    "bday-day",
    "bday-month",
    "bday-year",
    "sex",
    "language",
    "impp",
    "cc-name",
    "cc-given-name",
    "cc-additional-name",
    "cc-family-name",
    "cc-number",
    "cc-exp",
    "cc-exp-month",
    "cc-exp-year",
    "cc-csc",
    "cc-type",
    "transaction-currency",
    "transaction-amount",
    "one-time-code",
    "off",
    "on",
]);

/** normalise une clé en comparant différentes variantes (camelCase, kebab, etc.) */
function normalizeKey(k: string) {
    const s = k.trim().replace(/\s+/g, "");
    // camelCase → kebab
    const kebab = s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    return { raw: s, lower: s.toLowerCase(), kebab };
}

/**
 * Retourne un token d’autocomplete **valide** (ou "off" par défaut)
 * - 1) honorre une valeur `override` si elle est valide
 * - 2) mappe via ALIASES sinon
 * - 3) tente la version kebab-case si déjà valide
 * - 4) retombe sur "off" pour éviter les warnings d’accessibilité
 */
export function autocompleteFor<T extends Record<string, unknown>>(
    field: keyof T | string,
    override?: string
): HtmlAutoComplete {
    if (override) {
        const ov = override as HtmlAutoComplete;
        if (VALID.has(ov)) return ov;
        // tente normalisation de l’override
        const { kebab } = normalizeKey(override);
        if (VALID.has(kebab as HtmlAutoComplete)) return kebab as HtmlAutoComplete;
    }

    const key = String(field);
    const { raw, lower, kebab } = normalizeKey(key);

    // 1) alias stricts
    if (ALIASES[raw]) return ALIASES[raw];
    if (ALIASES[lower]) return ALIASES[lower];
    if (ALIASES[kebab]) return ALIASES[kebab];

    // 2) déjà un token standard ?
    if (VALID.has(raw as HtmlAutoComplete)) return raw as HtmlAutoComplete;
    if (VALID.has(lower as HtmlAutoComplete)) return lower as HtmlAutoComplete;
    if (VALID.has(kebab as HtmlAutoComplete)) return kebab as HtmlAutoComplete;

    // 3) inconnu → off (pas d’erreur d’accessibilité)
    return "off";
}
