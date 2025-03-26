export type PaginatedData<T = any> = {
    data: T[],
    links: Record<string, string>
}

export interface Category {
    id: string;
    name: string;
    imgPath: string;
}

export interface Location {
    id: string;
    name: string;
    description: string;
    surfaceType: string;
    imgBannerPath: string;
    imgBgPath: string;
}

export interface Manufacturer {
    id: string;
    name: string;
    imgPath: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface Vehicle {
    id: string;
    name: string;
    manufacturer: Manufacturer,
    category: Category;
    imgPath: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
