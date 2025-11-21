import React from "react";
import { cn } from "../../lib/utils";

const Badge = 
    React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
    (({className, ...props}, ref) => (
        <div
            ref = {ref}
            className={cn("font-bold text-3xl text-white-600 border rounded-lg",className)}{...props}
        />
    ));
Badge.displayName = "Badge";

export { Badge };