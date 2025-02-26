<?php

namespace App\Enums;

enum SeasonEnum: string
{
    case WINTER = 'winter';
    case SPRING = 'spring';
    case SUMMER = 'summer';
    case AUTUMN = 'autumn';
    case ALL_SEASONS = 'all';
}
