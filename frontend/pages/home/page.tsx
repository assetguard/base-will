import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletDetails } from "@/components/WalletDetails";
import { NetworkInfo } from "@/components/NetworkInfo";
import { Header } from "@/components/Header";
import { WalletTitle } from "@/components/WalletTitle";
import { DataTableDemo } from "@/components/DataTable";
import MessageBoard from "@/components/MessageBoard";

const Home = () => {
    const { connected } = useWallet();

  return (
    <div className="h-screen">
      <Header />
      <div className="flex items-center justify-center flex-col mt-4">
        {connected ? (
          <div className="container mx-auto px-8 flex flex-col md:flex-row items-stretch gap-4 ">
            <Card className="w-full md:w-2/3 mb-8 md:mb-0">
              <CardContent className="flex flex-col gap-10 pt-6">
                <WalletTitle />
                <DataTableDemo />
              </CardContent>
            </Card>
            <Card className="w-full md:w-1/3">
              <CardContent className="flex flex-col gap-10 pt-6">
                <WalletDetails />
                <NetworkInfo />                
                <MessageBoard />
              </CardContent>
            </Card>
          </div>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </div>
  );
}

export default Home