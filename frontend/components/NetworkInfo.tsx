import { Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { DisplayValue, LabelValueGrid } from "@/components/LabelValueGrid";
import { isValidNetworkName } from "@/utils/helpers";

export function NetworkInfo() {
  const { network, account } = useWallet();
  
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-lg font-medium">Network Info</h4>
      <LabelValueGrid
        items={[
          {
            label: "Network name",
            value: (
              <DisplayValue
                value={network?.name ?? "Not Present"}
                isCorrect={isValidNetworkName(network)}
                expected={Object.values<string>(Network).join(", ")}
              />
            ),
          },
        ]}
      />
      <LabelValueGrid
        items={[
          {
            label: "Address Value",
            value: <DisplayValue value={account?.address ?? "Not Present"} isCorrect={!!account?.address} />,
          },
        ]}
      />
    </div>
  );
}
