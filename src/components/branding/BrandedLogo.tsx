import type { ComponentProps } from "react";
import logo from "../../assets/logo_extended.svg";
import { useOrganization } from "../../lib/api/organization";
import { DelayedLoader } from "../util/DelayedLoader";

export function deingptLogo({ ...props }: ComponentProps<"img">) {
  return (
    <img
      src={logo}
      alt="deingpt Logo"
      {...props}
      style={{
        objectFit: "contain",
        ...props.style,
      }}
    />
  );
}

export function BrandedLogo({
  variant = "header",
  ...props
}: ComponentProps<"img"> & {
  variant?: "header" | "avatar";
}) {
  const organization = useOrganization();

  if (!organization) return <DelayedLoader />;

  const customBrandedSource: string | null = // the is the best case image
    variant == "header" ? organization?.logoUrl : organization?.avatarUrl;

  const customBrandedFallback = // if the best case image is not available, use the other one as fallback
    customBrandedSource ?? organization?.logoUrl ?? organization?.avatarUrl;

  const source = customBrandedFallback || logo; // use the default logo if no custom branding is available

  return (
    <img
      alt="deingpt Logo"
      {...props}
      src={source}
      style={{
        objectFit: "contain",
        ...props.style,
      }}
    />
  );
}

export function CustomLogoWithFallback(
  props: ComponentProps<"img"> & {
    customSource: string | null;
  }
) {
  const source = props.customSource || logo;

  return (
    <img
      alt="deingpt Logo"
      src={source}
      {...props}
      style={{
        objectFit: "contain",
        ...props.style,
      }}
    />
  );
}

export function DefaultLogo(props: ComponentProps<"img">) {
  return (
    <img
      src={logo}
      alt="deingpt Logo"
      {...props}
      style={{
        objectFit: "contain",
        ...props.style,
      }}
    />
  );
}
