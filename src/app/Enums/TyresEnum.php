<?php

namespace App\Enums;

enum TyresEnum: string
{
    case ASPHALT_SOFT = 'asphalt soft';
    case ASPHALT_MEDIUM = 'asphalt medium';
    case ASPHALT_HARD = 'asphalt hard';
    case ASPHALT_RAIN = 'asphalt rain';

    case GRAVEL_SUPER_SOFT = 'gravel super soft';
    case GRAVEL_SOFT = 'gravel soft';
    case GRAVEL_MEDIUM = 'gravel medium';
    case GRAVEL_HARD = 'gravel hard';

    case WINTER = 'winter';
    case SNOW = 'snow';

    case ALL_TYRES = 'all';
}
