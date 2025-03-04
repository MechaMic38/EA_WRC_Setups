export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PaginatedData<T = any> = {
    data: T[],
    links: Record<string, string>
}

export interface Category {
    id: string;
    name: string;
    img_path: string;
}

export interface Location {
    id: string;
    name: string;
    description: string;
    surface_type: string;
    img_banner_path: string;
    img_bg_path: string;
}

export interface Manufacturer {
    id: string;
    name: string;
    img_path: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface Vehicle {
    id: string;
    name: string;
    manufacturer: Manufacturer,
    category: Category;
    img_path: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
