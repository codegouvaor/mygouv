"use client";

import { SearchBar } from "@codegouvaor/react-ads/SearchBar";
import { useRouter } from "@/i18n/navigation";
import { searchPath } from "@/lib/site-structure";

/**
 * Canonical destination of a portal search: the localized `/search` route,
 * carrying the trimmed query when there is one.
 *
 * Single source of truth of the search submission — used both by the
 * standalone `PortalSearchBar` and by the Government Header search.
 */
export function getPortalSearchPath(query: string): string {
  const trimmed = query.trim();
  return trimmed ? `${searchPath}?q=${encodeURIComponent(trimmed)}` : searchPath;
}

/**
 * Portal search input. The behaviour comes from the ADS `SearchBar`; on submit
 * the query is pushed to the localized `/search` route which renders the
 * results (empty state while the search index is not wired).
 */
export function PortalSearchBar({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  /** Overrides the ADS default placeholder (translated “Search”). */
  placeholder?: string;
}) {
  const router = useRouter();

  const handleSearch = (text: string) => {
    router.push(getPortalSearchPath(text));
  };

  return (
    <SearchBar
      big
      label={label}
      defaultValue={defaultValue}
      renderInput={(params) => (
        <input {...params} placeholder={placeholder ?? params.placeholder} />
      )}
      onButtonClick={handleSearch}
    />
  );
}
