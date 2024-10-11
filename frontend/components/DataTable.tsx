"use client";

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
import { ArrowUpDown, CalendarIcon, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

export type LockedCoin = {
  recipient: string;
  amount: number;
  unlock_time_secs: number;
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper functions
const createTransactionPayload = (functionName: string, args: any[]): InputTransactionData => ({
  data: {
    function: `${MODULE_ADDRESS}::locked_coins::${functionName}`,
    typeArguments: ["0x1::aptos_coin::AptosCoin"],
    functionArguments: args,
  },
});

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<LockedCoin[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [extendDate, setExtendDate] = React.useState<Date | undefined>(undefined);
  const [selectedRecipient, setSelectedRecipient] = React.useState<string | null>(null);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = React.useState(false);

  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();

  // Helper function to get Unix timestamp
  const getUnlockTimestamp = (date: Date): number => {
    return Math.floor(date.getTime() / 1000);
  };

  //Function for handling extendLockUp
  const handleExtendLockup = async (recipient: string) => {
    if (!account || !extendDate) {
      toast({
        variant: "destructive",
        title: "Invalid extension",
        description: "Please select a new unlock date.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newUnlockTime = getUnlockTimestamp(extendDate);
      const payload = createTransactionPayload("update_lockup", [recipient, newUnlockTime.toString()]);

      const response = await signAndSubmitTransaction(payload);
      await aptosClient().waitForTransaction(response.hash);

      toast({
        title: "Lock extended successfully",
        description: `Transaction hash: ${response.hash}`,
      });

      // Reset states and refresh data
      setExtendDate(undefined);
      setSelectedRecipient(null);
      setIsExtendDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Failed to extend lockup:", error);
      toast({
        title: "Failed to extend lock",
        description: "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelLockup = async (recipient: string) => {
    if (!account) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to cancel the lockup.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = createTransactionPayload("cancel_lockup", [recipient]);

      const response = await signAndSubmitTransaction(payload);
      await aptosClient().waitForTransaction(response.hash);

      toast({
        title: "Lockup cancelled successfully",
        description: `Transaction hash: ${response.hash}`,
      });

      // Refresh data after successful cancellation
      fetchData();
      setIsLoading(false);
    } catch (error: any) {
      console.error("Failed to cancel lockup:", error);
      toast({
        title: "Failed to cancel lockup",
        description: "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<LockedCoin>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "recipient",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Recipient
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{formatAddress(row.getValue("recipient"))}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Amount (APT)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount")) / 1e8;
        return <div className="text-center font-medium">{amount.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "unlock_time_secs",
      header: ({ column }) => (
        <div className="flex items-center justify-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Unlock Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(Number(row.getValue("unlock_time_secs")) * 1000);
        return <div className="text-center">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const lock = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(lock.recipient)}>
                Copy recipient address
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Dialog
                open={isExtendDialogOpen && selectedRecipient === lock.recipient}
                onOpenChange={(open) => {
                  setIsExtendDialogOpen(open);
                  if (!open) setSelectedRecipient(null);
                }}
              >
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedRecipient(lock.recipient);
                      setIsExtendDialogOpen(true);
                    }}
                  >
                    Extend lock
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Extend Lock Time</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !extendDate && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {extendDate ? format(extendDate, "PPP") : "Pick a new unlock date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={extendDate}
                            onSelect={setExtendDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button onClick={() => handleExtendLockup(lock.recipient)} disabled={!extendDate || isLoading}>
                      Confirm Extension
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem onClick={() => handleCancelLockup(lock.recipient)} disabled={isLoading}>
                Cancel lock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchData = React.useCallback(async () => {
    if (!account?.address) return;

    try {
      const result = await aptosClient().view({
        payload: {
          function: `${MODULE_ADDRESS}::locked_coins::get_sponsor_locks`,
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [account.address],
        },
      });

      console.log(result);
      setData(result[0]);
    } catch (error) {
      console.error("Failed to fetch locked coins:", error);
      toast({
        title: "Failed to fetch locked coins",
        description: "An error occurred while fetching your locked coins.",
      });
    }
  }, [account?.address, toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, account, isLoading, toast]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  console.log(data);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter recipients..."
          value={(table.getColumn("recipient")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("recipient")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
