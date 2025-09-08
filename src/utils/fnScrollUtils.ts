/*-------------------------------------------------------*/

function scrollTimeEvent(
    currentTime: number,
    start: number,
    end: number,
    duration: number,
    startTime: number
) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeInOutCubic =
        progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 4) / 2;
    window.scrollTo(0, start + (end - start) * easeInOutCubic);
    if (progress < 1) {
        window.requestAnimationFrame((newTime) =>
            scrollTimeEvent(newTime, start, end, duration, startTime)
        );
    }
}
export const handleScrollClick = (targetId: string, offset = 0) => {
    const element = document.getElementById(targetId);
    if (!element) return;
    const start = window.scrollY;
    const end = element.getBoundingClientRect().top + window.scrollY - offset;
    const duration = 750;
    const startTime = performance.now();
    window.requestAnimationFrame((currentTime) => {
        scrollTimeEvent(currentTime, start, end, duration, startTime);
    });
};
// fnScrollUtils.ts (ou un petit utils dédié)
const SCROLL_INTENT_KEY = "__SCROLL_INTENT__";

function setScrollIntent(targetHash: string, offset = 0) {
    const id = targetHash.replace(/^#/, "");
    sessionStorage.setItem(SCROLL_INTENT_KEY, JSON.stringify({ id, offset }));
}



/*-------------------------------------------------------*/

interface NavParams {
    currentPath: string;
    targetPath: string;
    targetHash: string | undefined;
    currentHash: string | undefined;
    updateRoute: (route: string) => void;
    handleScrollClick?: (hash: string, offset?: number) => void;
    scrollOffset?: number;
}
export const handleNavClick = (
    path: string,
    currentRoute: string | undefined,
    updateRoute: (route: string) => void,
    handleScrollClick?: (hash: string, offset?: number) => void,
    scrollOffset = 0
): void => {
    if (!currentRoute) {
        return;
    }

    const [currentPath, currentHash] = currentRoute.split("#");
    const [targetPath, targetHash] = path.split("#");

    ifNav({
        currentPath,
        targetPath,
        targetHash,
        currentHash,
        updateRoute,
        handleScrollClick,
        scrollOffset,
    });

    elseNav({
        currentPath,
        targetPath,
        targetHash,
        currentHash,
        updateRoute,
        handleScrollClick,
        scrollOffset,
    });
};

function ifNav({
    currentPath,
    targetPath,
    targetHash,
    scrollOffset,
    updateRoute,
}: NavParams): void {
    if (currentPath !== targetPath) {
        // S’il y a une ancre cible, mémorise l’offset du sous-item
        if (typeof targetHash !== "undefined") {
            setScrollIntent(targetHash, scrollOffset ?? 0);
        }

        const full = targetHash ? `${targetPath}#${targetHash}` : targetPath;
        updateRoute(full); // un seul push
    }
}

function elseNav({
    targetHash,
    currentHash,
    handleScrollClick,
    scrollOffset,
}: NavParams): void {
    if (targetHash === undefined) {
        handleScrollClick?.("top");
    } else if (targetHash !== currentHash) {
        handleScrollClick?.(targetHash, scrollOffset);
        console.log("targetHash !== currentHash");
    } else if (targetHash === currentHash) {
        // updateRoute(`${targetPath}#${targetHash}`);
        handleScrollClick?.(targetHash, scrollOffset);
        console.log("targetHash === currentHash");
    }
}

/*-------------------------------------------------------*/

export let currentSectionId = "";
export function scrollInView(sections: { id: string }[]) {
    const scrollPosition = window.scrollY;
    sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const isInView =
                scrollPosition >= sectionTop - 100 &&
                scrollPosition < sectionTop + sectionHeight;
            if (isInView) {
                currentSectionId = id;
            }
        }
    });
}
export function updateSectionClasses(
    sections: { id: string }[],
    setActiveSection: (id: string) => void
) {
    sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
            if (id === currentSectionId) {
                section.classList.add("active-section");
                setActiveSection(id);
            } else {
                section.classList.remove("active-section");
            }
        }
    });
}
export function addNewUrl(currentSectionId: string) {
    if (currentSectionId) {
        const newUrl = `#${currentSectionId}`;
        if (window.location.hash !== newUrl) {
            window.history.replaceState(null, "", newUrl);
        }
    }
}
