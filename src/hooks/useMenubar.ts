import { useRouter } from "next/navigation";

export function useRoutePage() {
    const router = useRouter();

    const handleRoute = (path: string) => {
        router.push(path);
    }

    return { handleRoute };
}