import { SVGAttributes } from "react";

export default function ApplicationLogo(
    props: SVGAttributes<HTMLImageElement>
) {
    return (
        <img src="/images/logo_white.avif" alt="EAS WRC24 Logo" {...props} />
    );
}
