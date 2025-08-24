<?php

namespace App\Enums;

enum TyresEnum: string
{
    case ASPHALT_SOFT = 'asphalt_soft';
    case ASPHALT_MEDIUM = 'asphalt_medium';
    case ASPHALT_HARD = 'asphalt_hard';
    case ASPHALT_RAIN = 'asphalt_rain';

    case GRAVEL_SUPER_SOFT = 'gravel_super_soft';
    case GRAVEL_SOFT = 'gravel_soft';
    case GRAVEL_MEDIUM = 'gravel_medium';
    case GRAVEL_HARD = 'gravel_hard';

    case WINTER = 'winter';
    case SNOW = 'snow';

    case ALL_TYRES = 'all';
}
