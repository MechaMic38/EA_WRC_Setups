import { BiWater } from "react-icons/bi";
import { BsCloudSunFill, BsSnow2, BsSpeedometer2 } from "react-icons/bs";
import { FaRegSnowflake } from "react-icons/fa";
import {
    FiCloudSnow,
    FiShield,
    FiSliders,
    FiSun,
    FiUser,
} from "react-icons/fi";
import {
    GiConcreteBag,
    GiDustCloud,
    GiIceCube,
    GiLindenLeaf,
    GiSpring,
    GiSuspensionBridge,
    GiTwirlyFlower,
} from "react-icons/gi";
import { SetupSection } from "./types";
import { MdOutlineTireRepair } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";

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
    ice: {
        text: "Ice",
        icon: <GiIceCube className="text-blue-300" />,
    },
};

/**
 * Mapping of tyre types to their display properties.
 */
export const TYRES_MAP = {
    asphalt_soft: {
        text: "Asphalt Soft",
    },
    asphalt_medium: {
        text: "Asphalt Medium",
    },
    asphalt_hard: {
        text: "Asphalt Hard",
    },
    asphalt_rain: {
        text: "Asphalt Rain",
    },
    gravel_super_soft: {
        text: "Gravel Super Soft",
    },
    gravel_soft: {
        text: "Gravel Soft",
    },
    gravel_medium: {
        text: "Gravel Medium",
    },
    gravel_hard: {
        text: "Gravel Hard",
    },
    winter: {
        text: "Winter",
    },
    snow: {
        text: "Snow",
    },
};

export const USER_ROLES_MAP = {
    admin: {
        text: "Administrator",
        icon: <FiShield className="text-tertiary" />,
    },
    user: {
        text: "User",
        icon: <FiUser className="text-secondary" />,
    },
};

export const CONFIGURATION_TABS: {
    id: SetupSection;
    icon: JSX.Element;
    label: string;
}[] = [
    { id: "alignment", icon: <MdOutlineTireRepair />, label: "Alignment" },
    { id: "braking", icon: <BsSpeedometer2 />, label: "Braking" },
    { id: "differentials", icon: <FiSliders />, label: "Differentials" },
    { id: "gears", icon: <TbManualGearbox />, label: "Gears" },
    { id: "damping", icon: <GiSuspensionBridge />, label: "Damping" },
    { id: "springs", icon: <GiSpring />, label: "Springs" },
];
