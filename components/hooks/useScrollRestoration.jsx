import { useEffect } from 'react';

import Router from 'next/router';

function saveScrollPos(url, div) {
    const scrollPos = { x: div.scrollX, y: div.scrollY };
    sessionStorage.setItem(url, JSON.stringify(scrollPos));
}

function restoreScrollPos(url, div) {
    const scrollPos = JSON.parse(sessionStorage.getItem(url));
    if (scrollPos) {
        div.scrollTo(scrollPos.x, scrollPos.y);
    }
}

export default function useScrollRestoration(router, div) {
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            let shouldScrollRestore = false;
            window.history.scrollRestoration = 'manual';
            restoreScrollPos(router.asPath, div);

            const onBeforeUnload = event => {
                saveScrollPos(router.asPath, div);
                delete event['returnValue'];
            };

            const onRouteChangeStart = () => {
                saveScrollPos(router.asPath, div);
            };

            const onRouteChangeComplete = url => {
                if (shouldScrollRestore) {
                    shouldScrollRestore = false;
                    restoreScrollPos(url, div);
                }
            };

            window.addEventListener('beforeunload', onBeforeUnload);
            Router.events.on('routeChangeStart', onRouteChangeStart);
            Router.events.on('routeChangeComplete', onRouteChangeComplete);
            Router.beforePopState(() => {
                shouldScrollRestore = true;
                return true;
            });

            return () => {
                window.removeEventListener('beforeunload', onBeforeUnload);
                Router.events.off('routeChangeStart', onRouteChangeStart);
                Router.events.off('routeChangeComplete', onRouteChangeComplete);
                Router.beforePopState(() => true);
            };
        }
    }, [router]);
}