import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const brandAliases = Array.from(new Set([appName, 'Learn Piano Online', 'LearnPianoOnline'].filter(Boolean)));

function titleWithBrandSuffix(pageTitle: string | undefined | null): string {
    const rawTitle = (pageTitle ?? '').toString().trim();
    if (!rawTitle) return appName;

    const lower = rawTitle.toLowerCase();
    const alreadyHasBrand = brandAliases.some((alias) => lower.includes(alias.toLowerCase()));
    return alreadyHasBrand ? rawTitle : `${rawTitle} - ${appName}`;
}

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => titleWithBrandSuffix(title),
        resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
