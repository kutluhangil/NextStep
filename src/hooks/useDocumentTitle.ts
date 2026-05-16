import { useEffect } from 'react';

// Sets <title> for the current page. Restores previous title on unmount.
export function useDocumentTitle(title: string) {
    useEffect(() => {
        const previous = document.title;
        document.title = `${title} · NextStep`;
        return () => {
            document.title = previous;
        };
    }, [title]);
}
