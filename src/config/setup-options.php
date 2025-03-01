<?php

return [
    "alignment" => [
        "toe_front" => [
            "label" => "(Front) Toe Angle",
            "description" => "Toe in on the front increases stability at the cost of responsiveness, however too much can cause the vehicle to understeer. Toe out on the front increases turn in, however this can cause vague steering.",
            "unit" => "°",
            "min_value" => -2.0,
            "max_value" => 2.0,
            "default_value" => 0.0,
            "steps" => 41
        ],
        "toe_rear" => [
            "label" => "(Rear) Toe Angle",
            "description" => "Negative camber improves cornering grip but reduces straight-line traction. Removing camber will reduce cornering grip but increase straight-line traction. Positive camber may reduce steering effort but overall grip may be reduced.",
            "unit" => "°",
            "min_value" => -2.0,
            "max_value" => 2.0,
            "default_value" => 0.0,
            "steps" => 41
        ],
        "camber_front" => [
            "label" => "(Front) Camber Angle",
            "description" => "Toe in on the rear increases stability and enables you to get better drive out of the corners. Toe out on the rear increases vehicle rotation mid corner, however too much can cause oversteer.",
            "unit" => "°",
            "min_value" => -4.5,
            "max_value" => 0.0,
            "default_value" => -3.0,
            "steps" => 22
        ],
        "camber_rear" => [
            "label" => "(Rear) Camber Angle",
            "description" => "Negative camber improves cornering grip but reduces straight-line traction. Removing camber will reduce cornering grip but increase straight-line traction. Positive camber may reduce steering effort but overall grip may be reduced.",
            "unit" => "°",
            "min_value" => -3.5,
            "max_value" => 0.0,
            "default_value" => -2.0,
            "steps" => 22
        ]
    ],
    "braking" => [
        "braking_force" => [
            "label" => "Braking Force",
            "description" => "High brake strength can make braking more responsive but it can also cause your wheels to lock. Low brake strength can make braking feel vague but should reduce the chances of the wheels locking up.",
            "unit" => "Nm",
            "min_value" => 1500.00,
            "max_value" => 4500.00,
            "default_value" => 3000.00,
            "steps" => 61
        ],
        "brake_bias" => [
            "label" => "Brake Bias",
            "description" => "Front-biased brakes can reduce oversteer but cause understeer under heavy braking. Rear-biased brakes can reduce understeer but cause oversteer under heavy braking. Too much bias on either axle can cause the wheels to lock up.",
            "unit" => "%",
            "min_value" => 30,
            "max_value" => 90,
            "default_value" => 70,
            "steps" => 61
        ],
        "handbrake_force" => [
            "label" => "Handbrake Force",
            "description" => "A higher handbrake force will lock the rear wheels quicker allowing for greater rotation around hairpins and sharp corners.",
            "unit" => "Nm",
            "min_value" => 1400.00,
            "max_value" => 3400.00,
            "default_value" => 2400.00,
            "steps" => 61
        ]
    ],
    "differentials" => [
        "lsd_driving_front" => [
            "label" => "(Front) LSD Driving Lock",
            "description" => "A high lock percentage will improve straight-line traction although it may induce understeer particularly in low grip conditions. A low lock percentage will improve cornering at a cost of straight-line stability.",
            "unit" => "%",
            "min_value" => 0,
            "max_value" => 50,
            "default_value" => 40,
            "steps" => 11
        ],
        "lsd_braking_front" => [
            "label" => "(Front) LSD Braking Lock",
            "description" => "A high lock percentage will improve traction under braking but may induce understeer on corner entry. A low lock percentage will reduce understeer on corner entry but traction under braking may be compromised.",
            "unit" => "%",
            "min_value" => 0,
            "max_value" => 50,
            "default_value" => 40,
            "steps" => 11
        ],
        "lsd_preload_front" => [
            "label" => "(Front) LSD Preload",
            "description" => "Applying preload will partially lock the differential when little or no torque is applied by the drivetrain, ensuring it is never fully open. This can improve mid-corner traction, but having it too high may induce understeer.",
            "unit" => "Nm",
            "min_value" => 0.0,
            "max_value" => 99.0,
            "default_value" => 45.0,
            "steps" => 12
        ],
        "lsd_driving_centre" => [
            "label" => "(Centre) LSD Driving Lock",
            "description" => "A high lock percentage will improve straight-line traction although it may induce understeer particularly in low grip conditions. A low lock percentage will improve cornering at a cost of straight-line stability.",
            "unit" => "%",
            "min_value" => 0,
            "max_value" => 50,
            "default_value" => 40,
            "steps" => 11
        ],
        "lsd_braking_centre" => [
            "label" => "(Centre) LSD Braking Lock",
            "description" => "A high lock percentage will improve traction under braking but may induce understeer on corner entry. A low lock percentage will reduce understeer on corner entry but traction under braking may be compromised.",
            "unit" => "%",
            "min_value" => 0,
            "max_value" => 50,
            "default_value" => 40,
            "steps" => 11
        ],
        "lsd_preload_centre" => [
            "label" => "(Centre) LSD Preload",
            "description" => "Applying preload will partially lock the differential when little or no torque is applied by the drivetrain, ensuring it is never fully open. This can improve mid-corner traction, but having it too high may induce understeer.",
            "unit" => "Nm",
            "min_value" => 0.0,
            "max_value" => 99.0,
            "default_value" => 45.0,
            "steps" => 12
        ],
        "lsd_driving_rear" => [
            "label" => "(Rear) LSD Driving Lock",
            "description" => "A high lock percentage will improve straight-line traction although it may induce understeer particularly in low grip conditions. A low lock percentage will improve cornering at a cost of straight-line stability.",
            "unit" => "%",
            "min_value" => 0,
            "max_value" => 50,
            "default_value" => 40,
            "steps" => 11
        ],
        "lsd_braking_rear" => [
            "label" => "(Rear) LSD Braking Lock",
            "description" => "A high lock percentage will improve traction under braking but may induce understeer on corner entry. A low lock percentage will reduce understeer on corner entry but traction under braking may be compromised.",
            "unit" => "%",
            "min_value" => 0,
            "max_value" => 50,
            "default_value" => 40,
            "steps" => 11
        ],
        "lsd_preload_rear" => [
            "label" => "(Rear) LSD Preload",
            "description" => "Applying preload will partially lock the differential when little or no torque is applied by the drivetrain, ensuring it is never fully open. This can improve mid-corner traction, but having it too high may induce understeer.",
            "unit" => "Nm",
            "min_value" => 0.0,
            "max_value" => 99.0,
            "default_value" => 45.0,
            "steps" => 12
        ],
        "torque_bias_centre" => [
            "label" => "(Centre) Torque Bias",
            "description" => "Biasing the torque to the rear wheels will induce throttle oversteer similar to a RWD setup. Increasing the bias towards the front will reduce throttle oversteer but this may cause understeer when on throttle through corners.",
            "unit" => "%",
            "min_value" => 30,
            "max_value" => 70,
            "default_value" => 50,
            "steps" => 33
        ],
        "viscous_front" => [
            "label" => "(Front) Viscous Differential",
            "description" => "A strong differential reduces the speed difference between the wheels and can improve straight-line traction, but it may cause understeer. A loose differential has the opposite effect.",
            "unit" => "kgf.m/100rpm",
            "min_value" => 4,
            "max_value" => 24,
            "default_value" => 8,
            "steps" => 11
        ],
        "viscous_centre" => [
            "label" => "(Centre) Viscous Differential",
            "description" => "A strong differential reduces the speed difference between the axles which can improve straight-line traction, but it may cause understeer or oversteer depending on the chassis layout.",
            "unit" => "kgf.m/100rpm",
            "min_value" => 4,
            "max_value" => 24,
            "default_value" => 8,
            "steps" => 11
        ],
        "viscous_rear" => [
            "label" => "(Rear) Viscous Differential",
            "description" => "A strong differential reduces the speed difference between the wheels and can improve straight-line traction, but it may cause understeer. A loose differential has the opposite effect.",
            "unit" => "kgf.m/100rpm",
            "min_value" => 4,
            "max_value" => 24,
            "default_value" => 8,
            "steps" => 11
        ]
    ],
    "gears" => [
        "gear_1" => [
            "label" => "1st Gear",
            "description" => "A short ratio will improve acceleration at a cost of top speed. A long ratio will reduce acceleration but increase top speed. Too short a ratio may make it more difficult to control the vehicle's power delivery.",
            "unit" => "",
            "min_value" => 0.2,
            "max_value" => 1.2,
            "default_value" => 0.245,
            "steps" => 201
        ],
        "gear_2" => [
            "label" => "2nd Gear",
            "description" => "A short ratio will improve acceleration at a cost of top speed. A long ratio will reduce acceleration but increase top speed. Too short a ratio may make it more difficult to control the vehicle's power delivery.",
            "unit" => "",
            "min_value" => 0.2,
            "max_value" => 1.2,
            "default_value" => 0.34,
            "steps" => 201
        ],
        "gear_3" => [
            "label" => "3rd Gear",
            "description" => "A short ratio will improve acceleration at a cost of top speed. A long ratio will reduce acceleration but increase top speed. Too short a ratio may make it more difficult to control the vehicle's power delivery.",
            "unit" => "",
            "min_value" => 0.2,
            "max_value" => 1.2,
            "default_value" => 0.445,
            "steps" => 201
        ],
        "gear_4" => [
            "label" => "4th Gear",
            "description" => "A short ratio will improve acceleration at a cost of top speed. A long ratio will reduce acceleration but increase top speed. Too short a ratio may make it more difficult to control the vehicle's power delivery.",
            "unit" => "",
            "min_value" => 0.2,
            "max_value" => 1.2,
            "default_value" => 0.56,
            "steps" => 201
        ],
        "gear_5" => [
            "label" => "5th Gear",
            "description" => "A short ratio will improve acceleration at a cost of top speed. A long ratio will reduce acceleration but increase top speed. Too short a ratio may make it more difficult to control the vehicle's power delivery.",
            "unit" => "",
            "min_value" => 0.2,
            "max_value" => 1.2,
            "default_value" => 0.68,
            "steps" => 201
        ],
        "gear_6" => [
            "label" => "6th Gear",
            "description" => "A short ratio will improve acceleration at a cost of top speed. A long ratio will reduce acceleration but increase top speed. Too short a ratio may make it more difficult to control the vehicle's power delivery.",
            "unit" => "",
            "min_value" => 0.2,
            "max_value" => 1.2,
            "default_value" => 0.81,
            "steps" => 201
        ],
        "gear_7" => [
            "label" => "7th Gear",
            "description" => "A short ratio will improve acceleration at a cost of top speed. A long ratio will reduce acceleration but increase top speed. Too short a ratio may make it more difficult to control the vehicle's power delivery.",
            "unit" => "",
            "min_value" => 0.2,
            "max_value" => 1.2,
            "default_value" => 0.935,
            "steps" => 201
        ],
        "final_drive" => [
            "label" => "Final Drive",
            "description" => "The final drive in the differential scales the ratios of all gears in the gearbox. A short ratio will improve acceleration but reduce top speed potential. A long ratio will reduce acceleration but increase top speed potential.",
            "unit" => "",
            "min_value" => 0.1,
            "max_value" => 0.3,
            "default_value" => 0.2,
            "steps" => 201
        ]
    ],
    "damping" => [
        "slow_bump_front" => [
            "label" => "(Front) Slow Bump",
            "description" => "Firm bump rate will aid stability but absorption of bumps can be reduced. Soft bump rate will be better at absorbing bumps, but stability can be reduced.",
            "unit" => "",
            "min_value" => -5.0,
            "max_value" => 5.0,
            "default_value" => 0.0,
            "steps" => 11
        ],
        "fast_bump_front" => [
            "label" => "(Front) Fast Bump",
            "description" => "Fast bump controls how the damper handles impacts from jumps and bumps. Softer allows greater absorption but the vehicle may hit the bump stop reducing stability. Firmer may prevent this but bump absorption is reduced.",
            "unit" => "",
            "min_value" => -5.0,
            "max_value" => 5.0,
            "default_value" => 0.0,
            "steps" => 11
        ],
        "bump_division_front" => [
            "label" => "(Front) Bump Division",
            "description" => "If an impact on the wheels causes the damper to compress slower than this rate, the standard bump rate will take effect. If it causes the damper to compress faster than this rate, the fast bump rate will take effect.",
            "unit" => "m/s",
            "min_value" => 0.0,
            "max_value" => 0.4,
            "default_value" => 0.2,
            "steps" => 11
        ],
        "slow_rebound_front" => [
            "label" => "(Front) Slow Rebound",
            "description" => "Firmer will resist damper extension for more stability but the wheel may take longer to make contact with the ground. Softer will result in less resistance on extension but stability may be reduced.",
            "unit" => "",
            "min_value" => -5.0,
            "max_value" => 5.0,
            "default_value" => 0.0,
            "steps" => 11
        ],
        "slow_bump_rear" => [
            "label" => "(Rear) Slow Bump",
            "description" => "Firm bump rate will aid stability but absorption of bumps can be reduced. Soft bump rate will be better at absorbing bumps, but stability can be reduced.",
            "unit" => "",
            "min_value" => -5.0,
            "max_value" => 5.0,
            "default_value" => 0.0,
            "steps" => 11
        ],
        "fast_bump_rear" => [
            "label" => "(Rear) Fast Bump",
            "description" => "Fast bump controls how the damper handles impacts from jumps and bumps. Softer allows greater absorption but the vehicle may hit the bump stop reducing stability. Firmer may prevent this but bump absorption is reduced.",
            "unit" => "",
            "min_value" => -5.0,
            "max_value" => 5.0,
            "default_value" => 0.0,
            "steps" => 11
        ],
        "bump_division_rear" => [
            "label" => "(Rear) Bump Division",
            "description" => "If an impact on the wheels causes the damper to compress slower than this rate, the standard bump rate will take effect. If it causes the damper to compress faster than this rate, the fast bump rate will take effect.",
            "unit" => "m/s",
            "min_value" => 0.0,
            "max_value" => 0.4,
            "default_value" => 0.2,
            "steps" => 11
        ],
        "slow_rebound_rear" => [
            "label" => "(Rear) Slow Rebound",
            "description" => "Firmer will resist damper extension for more stability but the wheel may take longer to make contact with the ground. Softer will result in less resistance on extension but stability may be reduced.",
            "unit" => "",
            "min_value" => -5.0,
            "max_value" => 5.0,
            "default_value" => 0.0,
            "steps" => 11
        ]
    ],
    "springs" => [
        "height_front" => [
            "label" => "(Front) Ride Height",
            "description" => "A low ride height helps reduce body-roll and improves overall stability, however reduces suspension travel. High ride height will improve handling over rougher terrain at the cost of increased body-roll.",
            "unit" => "mm",
            "min_value" => -30.0,
            "max_value" => 10.0,
            "default_value" => -10.0,
            "steps" => 21
        ],
        "spring_front" => [
            "label" => "(Front) Spring Rate",
            "description" => "Firm springs will improve body stability but bump absorption is reduced. Soft springs will reduce body stability but bump absorption is improved.",
            "unit" => "N/mm",
            "min_value" => 60.0,
            "max_value" => 200.0,
            "default_value" => 116.0,
            "steps" => 21
        ],
        "antiroll_front" => [
            "label" => "(Front) Anti-roll Bar",
            "description" => "A strong setting will resist roll but could lift the inside wheel and overload the outside wheel resulting in loss of traction. A weak setting will allow more roll but transfer of bumps to the opposite wheel will be reduced.",
            "unit" => "N/mm",
            "min_value" => 0.0,
            "max_value" => 66.0,
            "default_value" => 42.9,
            "steps" => 22
        ],
        "height_rear" => [
            "label" => "(Rear) Ride Height",
            "description" => "A low ride height helps reduce body-roll and improves overall stability, however reduces suspension travel. High ride height will improve handling over rougher terrain at the cost of increased body-roll.",
            "unit" => "mm",
            "min_value" => -30.0,
            "max_value" => 10.0,
            "default_value" => -10.0,
            "steps" => 21
        ],
        "spring_rear" => [
            "label" => "(Rear) Spring Rate",
            "description" => "Firm springs will improve body stability but bump absorption is reduced. Soft springs will reduce body stability but bump absorption is improved.",
            "unit" => "N/mm",
            "min_value" => 60.0,
            "max_value" => 200.0,
            "default_value" => 116.0,
            "steps" => 21
        ],
        "antiroll_rear" => [
            "label" => "(Rear) Anti-roll Bar",
            "description" => "A strong setting will resist roll but could lift the inside wheel and overload the outside wheel resulting in loss of traction. A weak setting will allow more roll but transfer of bumps to the opposite wheel will be reduced.",
            "unit" => "N/mm",
            "min_value" => 0.0,
            "max_value" => 66.0,
            "default_value" => 42.9,
            "steps" => 21
        ]
    ]
];
