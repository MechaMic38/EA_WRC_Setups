<?php

namespace App\Enums;

enum SurfaceConditionEnum: string
{
    case DRY = 'dry';
    case WET = 'wet';
    case SNOW = 'snow';
    case ICE = 'ice';
    case ALL_CONDITIONS = 'all';
}
