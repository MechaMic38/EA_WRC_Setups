import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                surface: {
                    DEFAULT: '#141218',
                },
                onSurface: {
                    DEFAULT: '#E6E0E9',
                },
                surfaceContainer: {
                    DEFAULT: '#211F24',
                },
                surfaceContainerHigh: {
                    DEFAULT: '#2B292F',
                },
                surfaceContainerHighest: {
                    DEFAULT: '#36343A',
                },
                primary: {
                    DEFAULT: '#CFBDFE',
                },
                onPrimary: {
                    DEFAULT: '#36265D',
                },
                secondary: {
                    DEFAULT: '#CCC2DB',
                },
                onSecondary: {
                    DEFAULT: '#332D41',
                },
                tertiary: {
                    DEFAULT: '#EFB8C8',
                },
                onTertiary: {
                    DEFAULT: '#4A2532',
                },
                primaryContainer: {
                    DEFAULT: '#4D3D75',
                },
                onPrimaryContainer: {
                    DEFAULT: '#E9DDFF',
                },
                secondaryContainer: {
                    DEFAULT: '#4A4458',
                },
                onSecondaryContainer: {
                    DEFAULT: '#E8DEF8',
                },
                tertiaryContainer: {
                    DEFAULT: '#633B48',
                },
                onTertiaryContainer: {
                    DEFAULT: '#FFD9E3',
                },
                error: {
                    DEFAULT: '#FFB4AB',
                },
                onError: {
                    DEFAULT: '#690005',
                },
                errorContainer: {
                    DEFAULT: '#93000A',
                },
                onErrorContainer: {
                    DEFAULT: '#FFDAD6',
                },
                shadow: {
                    DEFAULT: '#000000',
                },
                outline: {
                    DEFAULT: '#948F99',
                },
            },
        },
    },

    plugins: [forms, require('daisyui')],
};
