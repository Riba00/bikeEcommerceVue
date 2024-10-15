import { API_URL } from '../utils/constants';

export async function getCategoriesApi() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        const categories = await response.json();

        return categories;
    } catch (error) {
        console.log(error);
    }
}