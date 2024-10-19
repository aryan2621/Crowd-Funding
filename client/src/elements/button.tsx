import React from "react";
import {
    useConnect,
    useAddress,
    useDisconnect,
    metamaskWallet,
} from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";

const CustomConnectWallet = () => {
    const address = useAddress();
    const connect = useConnect();
    const disconnect = useDisconnect();
    const metamaskConfig = metamaskWallet();

    const handleConnect = async () => {
        try {
            await connect(metamaskConfig);
        } catch (error) {
            console.error("Failed to connect:", error);
        }
    };
    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error("Failed to disconnect:", error);
        }
    };
    if (address) {
        return (
            <Button onClick={handleDisconnect}>
                Disconnect {address.slice(0, 6)}...{address.slice(-4)}
            </Button>
        );
    }
    return <Button onClick={handleConnect}>Connect Wallet</Button>;
};

export default CustomConnectWallet;
