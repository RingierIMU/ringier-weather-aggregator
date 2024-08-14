export type RouteMatch = {
    matched: boolean;
    params: Record<string, string>;
}

export const matchRoute = (pattern: string, url: string): RouteMatch => {
    const patternParts = pattern.split('/').filter(Boolean);
    const urlParts = url.split('/').filter(Boolean);

    if (patternParts.length !== urlParts.length) {
        return { matched: false, params: {} };
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = urlParts[i];
        } else if (patternParts[i] !== urlParts[i]) {
            return { matched: false, params: {} };
        }
    }

    return { matched: true, params };
};
