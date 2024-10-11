import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface RecipientLockInfo {
  amount: string;
  unlock_time_secs: string;
  is_locked: boolean;
}

interface LockInfo {
  id: string;
  sponsor: string;
  amount: string;
  unlock_time_secs: string;
  is_locked: boolean;
  unlockDate: string;
}

// Constants
const SPONSORS = [
  "0xf9424969a5cfeb4639c4c75c2cd0ca62620ec624f4f28d76c4881a1e567d753f",
  "0xd869b1399d8b19dba8c5aa4ae63a64233e17aac473c410e15ad8f1e4fe5253a1",
];

// Helper functions
const shortenAddress = (address: string): string => `${address.slice(0, 6)}...${address.slice(-4)}`;

const createTransactionPayload = (functionName: string, args: any[]): InputTransactionData => ({
  data: {
    function: `${MODULE_ADDRESS}::locked_coins::${functionName}`,
    typeArguments: ["0x1::aptos_coin::AptosCoin"],
    functionArguments: args,
  },
});

const isRecipientLockInfo = (value: unknown): value is RecipientLockInfo => {
  return (
    typeof value === "object" &&
    value !== null &&
    "amount" in value &&
    "unlock_time_secs" in value &&
    "is_locked" in value &&
    typeof (value as RecipientLockInfo).amount === "string" &&
    typeof (value as RecipientLockInfo).unlock_time_secs === "string" &&
    typeof (value as RecipientLockInfo).is_locked === "boolean"
  );
};

const formatAptAmount = (amount: string): string => {
  const aptAmount = parseFloat(amount) / 100000000;
  return aptAmount.toFixed(2);
};

// Column definitions
const createColumns = (
  signAndSubmitTransaction: (payload: InputTransactionData) => Promise<void>,
): ColumnDef<LockInfo>[] => [
  {
    accessorKey: "sponsor",
    header: "Sponsor",
    cell: ({ row }) => <div className="font-medium">{shortenAddress(row.getValue("sponsor"))}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <div className="text-right font-medium">{formatAptAmount(row.getValue("amount"))} APT</div>,
  },
  {
    accessorKey: "is_locked",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.getValue("is_locked") ? "text-red-500" : "text-green-500"}>
        {row.getValue("is_locked") ? "Locked" : "Unlocked"}
      </div>
    ),
  },
  {
    accessorKey: "unlockDate",
    header: "Unlock Date",
    cell: ({ row }) => <div>{row.getValue("unlockDate")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lock = row.original;
      const handleClaim = async () => {
        if (!lock.is_locked) {
          try {
            const payload = createTransactionPayload("claim", [lock.sponsor]);
            await signAndSubmitTransaction(payload);
            toast({
              title: "Claim successful",
              description: `Successfully claimed ${formatAptAmount(lock.amount)} APT`,
            });
          } catch (error) {
            console.error("Failed to claim:", error);
            toast({
              variant: "destructive",
              title: "Failed to claim",
              description: "An error occurred while claiming your coins.",
            });
          }
        }
      };
        
        React.useEffect(() => {
         
        }, [toast])
        

      return (
        <Button onClick={handleClaim} disabled={lock.is_locked} variant={lock.is_locked ? "outline" : "default"}>
          {lock.is_locked ? "Locked" : "Claim"}
        </Button>
      );
    },
  },
];

// Main component
export function DataTableReceipt() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [lockData, setLockData] = React.useState<LockInfo[]>([]);
  const { account, signAndSubmitTransaction } = useWallet();

  const columns = React.useMemo(() => createColumns(signAndSubmitTransaction), [signAndSubmitTransaction]);

  const fetchData = React.useCallback(async () => {
    if (!account?.address) return;
    setIsLoading(true);

    try {
      const lockPromises = SPONSORS.map(async (sponsor): Promise<LockInfo | null> => {
        try {
          const result = await aptosClient().view({
            payload: {
              function: `${MODULE_ADDRESS}::locked_coins::get_recipient_lock_info`,
              typeArguments: ["0x1::aptos_coin::AptosCoin"],
              functionArguments: [sponsor, account.address],
            },
          });

          if (!Array.isArray(result) || result.length === 0 || !isRecipientLockInfo(result[0])) {
            console.error(`Unexpected data structure for sponsor ${sponsor}. Received:`, result);
            return null;
          }

          const lockInfo = result[0];
          const unlockDate = new Date(parseInt(lockInfo.unlock_time_secs) * 1000).toLocaleString();

          return {
            id: `${sponsor}-${account.address}`,
            sponsor,
            amount: lockInfo.amount,
            unlock_time_secs: lockInfo.unlock_time_secs,
            is_locked: lockInfo.is_locked,
            unlockDate,
          };
        } catch (error) {
          console.error(`Failed to fetch data for sponsor ${sponsor}:`, error);
          return null;
        }
      });

      const results = await Promise.all(lockPromises);
      setLockData(results.filter((result): result is LockInfo => result !== null));
    } catch (error) {
      console.error("Failed to fetch locked coins:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch locked coins",
        description: "An error occurred while fetching your locked coins.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [account?.address]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, toast]);

  const table = useReactTable({
    data: lockData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by sponsor..."
          value={(table.getColumn("sponsor")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("sponsor")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No locked coins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
