import { useState } from "react";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { MODULE_ADDRESS } from "@/constants";

export default function MessageBoard() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    recipientAddress: "",
    amount: "",
  });

  // Helper functions
  const createTransactionPayload = (functionName: string, args: any[]): InputTransactionData => ({
    data: {
      function: `${MODULE_ADDRESS}::locked_coins::${functionName}`,
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: args,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const handleDateSelect = (date: Date | undefined) => {
    setUnlockDate(date);
  };

  const getUnlockTimestamp = (date: Date): number => {
    return Math.floor(date.getTime() / 1000);
  };

  const handleSubmit = async () => {
    if (!account || !unlockDate) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill all fields and connect your wallet.",
      });
      return;
    }

    const unlockTimeUnix = getUnlockTimestamp(unlockDate);
    // Convert the input amount to octas (1 APT = 10e7 octas)
    const amountInOctas = (parseFloat(formData.amount) * 10e7).toString();

    // Log form data
    console.log({
      recipientAddress: formData.recipientAddress,
      amount: formData.amount,
      unlockTime: unlockTimeUnix,
      humanReadableDate: format(unlockDate, "PPP"),
    });

    try {
      const payload = createTransactionPayload("init_and_add_locked_coins", [
        formData.recipientAddress,
        amountInOctas,
        unlockTimeUnix.toString(),
      ]);

      const response = await signAndSubmitTransaction(payload);
      console.log("Transaction response:", response);

      // Reset form data after successful submission
      setFormData({
        recipientAddress: "",
        amount: "",
      });
      setUnlockDate(undefined);

      
      toast({
        variant: "default",
        title: "Transaction submitted successfully",
        description: `Hash: ${response.hash}`,
      });
    } catch (error: any) {
      console.error("Transaction error:", error);
      // Reset form data after successful submission
      setFormData({
        recipientAddress: "",
        amount: "",
      });
      setUnlockDate(undefined);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: error.message,
      });
    }
  };

  const isFormValid = account && unlockDate && formData.recipientAddress && formData.amount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Beneficiary</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center gap-2">
            <div className="grid w-full gap-1.5">
              <Label className="text-sm" htmlFor="unlockDate">Unlock Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!unlockDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {unlockDate ? format(unlockDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={unlockDate} onSelect={handleDateSelect} fromDate={minDate} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label className="text-sm" htmlFor="amount">Amount (in APT)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.0"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label className="text-sm" htmlFor="recipientAddress">Recipient Address</Label>
            <Input
              id="recipientAddress"
              name="recipientAddress"
              placeholder="0x..."
              value={formData.recipientAddress}
              onChange={handleInputChange}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={!isFormValid}>
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
