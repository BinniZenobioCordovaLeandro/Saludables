import dataService from "@/services/dataService";
import type { Item, ItemWithDistance } from "@/services/models/Item";
import { useState, useEffect } from "react";
import { useLocation } from "./useLocation";
import type * as Location from "expo-location";

const distanceInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
) => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

const sortDataAccordingLocation = (
    data: Item[],
    location: Location.LocationObject,
): ItemWithDistance[] => {
    return data
        .map((item) => {
            const distance = distanceInMeters(
                Number(item.strLatitud),
                Number(item.strLongitud),
                location.coords.latitude,
                location.coords.longitude,
            );
            return { ...item, distance };
        })
        .sort((a, b) => {
            if (a.distance === null || b.distance === null) return 0;
            return a.distance - b.distance;
        });
};

const useListData = () => {
    const [items, setItems] = useState<ItemWithDistance[] | Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { location, errorMsg } = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dataService.list();
                const data: Item[] = response as Item[];
                if (!location) setItems(data);
                else setItems(sortDataAccordingLocation(data, location));
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location]);

    return { items, loading, error };
};

export default useListData;
