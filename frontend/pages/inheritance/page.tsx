import { DataTableReceipt } from '@/components/DataTableRecipt';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletTitle } from '@/components/WalletTitle';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const Inheritance = () => {
    const { connected } = useWallet();


  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex items-center justify-center flex-col mt-4">
        {connected ? (
          <div className="container mx-auto px-8 flex flex-col md:flex-row items-stretch gap-4 ">
            <Card className="w-full mb-8 md:mb-0">
              <CardContent className="flex flex-col gap-10 pt-6">
                <div className="flex flex-col gap-6">
                  <h4 className="text-lg font-semibold">Inheritances</h4>
                </div>
                <DataTableReceipt />
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

export default Inheritance