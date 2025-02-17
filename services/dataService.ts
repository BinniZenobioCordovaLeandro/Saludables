import pool_list from "./mocks/data_pi.json";
import beach_list from "./mocks/data_pl.json";
import type { Item } from "./models/Item";

const dataService = {
    list: async (list: 'pool' | 'beach' = 'pool'): Promise<Item[]> => {
        try {
            const response = list === 'pool' ? pool_list : beach_list;
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            const data = response.data as Item[];
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return data;
        } catch (error) {
            console.error("Error fetching list:", error);
            throw error;
        }
    },
    item: async (id: string): Promise<Item> => {
        try {
            const response = await fetch(
                `https://your-api-domain.com/path/to/item/${id}`,
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching item with id ${id}:`, error);
            throw error;
        }
    },
};

export default dataService;
