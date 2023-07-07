import { useADDR } from "../Ethereum/Addresses";
import { useNetwork } from "wagmi";
import { toLower } from "../Helpers";

export default function useDecentralizedExchange(dexName?: string | null, chainId?: number | undefined) {
    const { chain } = useNetwork()
    const A = useADDR(chainId ?? chain?.id)
    if (dexName) {
        const dexExists = (A?.DEXS as any)?.filter((d: any) => d?.NAME?.includes(toLower(dexName).replace(/[^a-zA-Z]+/g, '')))[0]
        if (dexExists) return { dex: dexExists, dexs: A?.DEXS } as const
    }
    return { dex: A?.DEXS[0], dexs: A?.DEXS   } as const
}