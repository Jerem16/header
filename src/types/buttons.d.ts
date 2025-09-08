import type { SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export type ButtonBaseProps = {
    label?: string;
    title?: string;
    onClick: () => void;
    icon?: ReactNode;
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    variant?: "text" | "outlined" | "contained";
    disabled?: boolean;
    className?: string;
    sx?: SxProps<Theme>;
    size?: "small" | "medium" | "large";
};
