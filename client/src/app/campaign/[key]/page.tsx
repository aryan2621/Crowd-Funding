"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
    useAddress,
    useContract,
    useContractRead,
    useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import CustomConnectWallet from "@/elements/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Target, User, DollarSign } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import BasicLayout from "@/layouts/BasicLayout";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function Component() {
    const { toast } = useToast();
    const params = useParams();
    const { key } = params;
    const address = useAddress();
    const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const { data: campaign, isLoading } = useContractRead(
        contract,
        "getCampaign",
        [key],
    );
    const { mutateAsync: donateToCampaign, isLoading: isDonating } =
        useContractWrite(contract, "donateToCampaign");

    const [donationAmount, setDonationAmount] = useState(0);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    if (!campaign)
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Campaign not found</AlertDescription>
            </Alert>
        );
    const { donators, donations } = campaign;
    const progress = (campaign.amountCollected / campaign.target) * 100;
    const daysLeft = Math.max(
        0,
        Math.ceil(
            (Number(campaign.deadline) * 1000 - Date.now()) /
                (1000 * 60 * 60 * 24),
        ),
    );

    const handleDonate = async () => {
        if (!address) {
            toast({
                title: "Please connect your wallet to donate.",
            });
            return;
        }
        try {
            await donateToCampaign({
                args: [key],
                overrides: {
                    value: ethers.utils.parseEther(donationAmount.toString()),
                },
            });
            toast({
                title: "Donation successful!",
            });
            setDonationAmount(0);
        } catch (error) {
            console.error("Error donating to campaign:", error);
            toast({
                title: "Error donating to campaign.",
                description: "Please try again.",
            });
        }
    };

    return (
        <BasicLayout>
            <div className="container mx-auto p-4">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">{campaign.title}</h1>
                    <CustomConnectWallet />
                </header>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Card className="w-full max-w-3xl mx-auto cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    {campaign.title}
                                    <Badge variant="secondary" className="ml-2">
                                        #{Number(key) + 1}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    {campaign.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <img
                                    className="w-full h-[400px] object-cover rounded-md mb-4"
                                    src={campaign.image}
                                    alt={campaign.title}
                                />
                                <Progress
                                    value={progress}
                                    className="w-full mb-4"
                                />
                                <div className="flex justify-between text-sm mb-4">
                                    <Badge
                                        variant="outline"
                                        className="flex items-center"
                                    >
                                        <Target className="mr-1 h-4 w-4" />
                                        {ethers.utils.formatEther(
                                            campaign.amountCollected,
                                        )}{" "}
                                        ETH raised
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="flex items-center"
                                    >
                                        <Target className="mr-1 h-4 w-4" />
                                        {ethers.utils.formatEther(
                                            campaign.target,
                                        )}
                                        ETH goal
                                    </Badge>
                                </div>
                                <div className="flex items-center mb-4">
                                    <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage
                                            src={`https://avatar.vercel.sh/${campaign.owner}`}
                                        />
                                        <AvatarFallback>
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-gray-500">
                                        by {campaign.owner.slice(0, 6)}...
                                        {campaign.owner.slice(-4)}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <Label
                                        htmlFor="donationAmount"
                                        className="mb-2 block"
                                    >
                                        Donation Amount (ETH)
                                    </Label>
                                    <div className="flex items-center">
                                        <Slider
                                            id="donationAmount"
                                            max={Number(campaign.target)}
                                            step={0.01}
                                            defaultValue={[donationAmount]}
                                            onValueChange={(value) =>
                                                setDonationAmount(value[0])
                                            }
                                            className="flex-grow mr-4"
                                        />
                                        <Badge
                                            variant="secondary"
                                            className="text-lg"
                                        >
                                            {donationAmount.toFixed(2)} ETH
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDonate();
                                    }}
                                    disabled={
                                        !address ||
                                        donationAmount === 0 ||
                                        isDonating
                                    }
                                    className="w-full"
                                >
                                    <DollarSign className="mr-2 h-4 w-4" />{" "}
                                    Donate
                                </Button>
                            </CardContent>
                            <CardFooter className="justify-between">
                                <Button
                                    variant="outline"
                                    className="flex items-center"
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {daysLeft} days left
                                </Button>
                                <Badge variant="outline" className="text-xs">
                                    Created at:
                                    {new Date(
                                        campaign.deadline * 1000,
                                    ).toLocaleDateString()}
                                </Badge>
                            </CardFooter>
                        </Card>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Donors List</SheetTitle>
                            <SheetDescription>
                                List of donors and their contributions
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                            {donators.map((donor: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded"
                                >
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage
                                                src={`https://avatar.vercel.sh/${donor}`}
                                            />
                                            <AvatarFallback>
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">
                                            {donor.slice(0, 6)}...
                                            {donor.slice(-4)}
                                        </span>
                                    </div>
                                    <Badge>
                                        {ethers.utils.formatEther(
                                            donations[index],
                                        )}{" "}
                                        ETH
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </BasicLayout>
    );
}
