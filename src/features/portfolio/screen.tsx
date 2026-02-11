"use client";

import PortfolioHeader from "./components/PortfolioHeader";
import AssetGrid from "./components/AssetGrid";

export default function PortfolioScreen() {
  return (
    <div className="min-h-[calc(100dvh-96px)] w-full">
      <div className="mx-auto max-w-5xl">
        <PortfolioHeader />
        <AssetGrid />
      </div>
    </div>
  );
}
