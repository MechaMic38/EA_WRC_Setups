// ===========================================================================
// This are the types for the application. They are used to define the
// structure of the data returned by the API and the data used in the
// application.
// ===========================================================================

export interface Category {
    id: string;
    name: string;
    imgPath: string;
}

export interface LocationSummary {
    id: string;
    name: string;
    description: string;
    surfaceType: string;
    imgBannerPath: string;
    imgBgPath: string;
}

export interface Location extends LocationSummary {
    seasons: string[];
    tyres: string[];
    surfaceConditions: string[];
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

// =========================================================================
// This is the type for the setup options.
// The setup options are used to define the parameters for the vehicle setup.
// ==========================================================================

export type SetupSection =
    | "alignment"
    | "braking"
    | "differentials"
    | "gears"
    | "damping"
    | "springs";

export type SetupOption = {
    label: string;
    description: string;
    unit: string;
    min_value: number;
    max_value: number;
    default_value: number;
    steps: number;
    precision: number;
}

export type SetupOptions = {
    [section in SetupSection]: Record<string, SetupOption>;
}

// ==========================================================================
// This is the type for the setup blueprint and configuration.
// The blueprint defines the rules for each parameter, including the min and
// max values, default value, and steps.
// The configuration defines the actual values for each parameter.
// ==========================================================================

export interface BlueprintRule {
    min_value: number;
    max_value: number;
    default_value: number;
    steps: number;
}

export interface SetupBlueprint extends SetupOptions {
    id: string;
}

/**
 * This is the type for the setup configuration.
 * The configuration contains the actual values for each parameter.
 *
 * The actual configuration values are stored as strings, to preserve
 * the precision of the values.
 */
export type SetupConfigs = {
    [section in SetupSection]: Record<string, string>;
}

export type SetupConfigsNumeric = {
    [section in SetupSection]: Record<string, number>;
}

export interface SetupConfiguration extends SetupConfigs {
    id: string;
}

export interface Setup {
    id: string;
    surfaceCondition: string;
    season: string;
    tyres: string;
    createdAt: string;
    vehicle: Vehicle;
    location: Location;
    user: User;
    configuration?: SetupConfiguration;
}

// ==========================================================================
// This is the type for the paginated data returned by the API. It includes
// the data, links, and meta information for pagination.
// ==========================================================================

export interface PaginationLinks {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
}

export interface MetaLinks {
    url?: string;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: MetaLinks[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export type PaginatedData<T = any> = {
    data: T[],
    links: PaginationLinks,
    meta: PaginationMeta;
}

// ==========================================================================
// This is the type for the page props that are passed to the page components
// in the Laravel application. It includes the auth user and flash messages.
// ==========================================================================

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
