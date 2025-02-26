<?php

namespace App\Enums;

enum SurfaceTypeEnum: string
{
    case TARMAC = 'tarmac';
    case GRAVEL = 'gravel';
    case SNOW = 'snow';
    case ALL_TYPES = 'all';
}
