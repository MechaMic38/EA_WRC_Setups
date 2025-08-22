import { BiWater } from "react-icons/bi";
import { BsCloudSunFill, BsSnow2 } from "react-icons/bs";
import { FaRegSnowflake } from "react-icons/fa";
import { FiCloudSnow, FiSun } from "react-icons/fi";
import {
    GiConcreteBag,
    GiDustCloud,
    GiLindenLeaf,
    GiTwirlyFlower,
} from "react-icons/gi";

/**
 * Mapping of seasons to their display properties.
 */
export const SEASONS_MAP = {
    spring: {
        text: "Spring",
        icon: <GiTwirlyFlower className="text-green-500" />,
    },
    summer: {
        text: "Summer",
        icon: <FiSun className="text-yellow-500" />,
    },
    autumn: {
        text: "Autumn",
        icon: <GiLindenLeaf className="text-orange-500" />,
    },
    winter: {
        text: "Winter",
        icon: <FaRegSnowflake className="text-blue-400" />,
    },
};

/**
 * Mapping of surface types to their display properties.
 */
export const SURFACE_TYPES_MAP = {
    gravel: {
        text: "Gravel",
        icon: <GiDustCloud className="text-yellow-500" />,
    },
    tarmac: {
        text: "Tarmac",
        icon: <GiConcreteBag className="text-gray-500" />,
    },
    snow: {
        text: "Snow",
        icon: <FiCloudSnow className="text-blue-400" />,
    },
};

/**
 * Mapping of surface conditions to their display properties.
 */
export const SURFACE_CONDITIONS_MAP = {
    dry: {
        text: "Dry",
        icon: <BsCloudSunFill className="text-amber-500" />,
    },
    wet: {
        text: "Wet",
        icon: <BiWater className="text-blue-500" />,
    },
    snow: {
        text: "Snow",
        icon: <BsSnow2 className="text-blue-400" />,
    },
};

/**
 * Mapping of tyre types to their display properties.
 */
export const TYRES_MAP = {
    "asphalt soft": {
        text: "Asphalt Soft",
    },
    "asphalt medium": {
        text: "Asphalt Medium",
    },
    "asphalt hard": {
        text: "Asphalt Hard",
    },
    "asphalt rain": {
        text: "Asphalt Rain",
    },
    "gravel super soft": {
        text: "Gravel Super Soft",
    },
    "gravel soft": {
        text: "Gravel Soft",
    },
    "gravel medium": {
        text: "Gravel Medium",
    },
    "gravel hard": { text: "Gravel Hard" },
    winter: { text: "Winter" },
    snow: { text: "Snow" },
};

export const USER_ROLES_MAP = {
    admin: {
        text: "Administrator",
    },
    user: {
        text: "User",
    },
};
