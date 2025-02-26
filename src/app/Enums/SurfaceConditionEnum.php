<?php

namespace App\Enums;

enum SurfaceConditionEnum: string
{
    case DRY = 'dry';
    case WET = 'wet';
    case SNOW = 'snow';
    case ALL_CONDITIONS = 'all';
}
