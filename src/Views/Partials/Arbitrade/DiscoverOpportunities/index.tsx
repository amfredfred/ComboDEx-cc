import { motion } from 'framer-motion'
import OpportunityCard from './OpportunityCard'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { IOpportunityCard } from '../../../../Defaulds'
import { useNetwork } from 'wagmi'


export default function DiscoverArbitrageOpportunities() {
    const { chain } = useNetwork()

    const query = useQuery({
        queryKey: ['opportunities'],
        queryFn: async () => await axios.post(`${process.env.REACT_APP_COMBODEX_API_LOCAL}/opps`, {
            chainId: chain?.id
        }),
        enabled: Boolean(process.env.REACT_APP_COMBODEX_API),
        cacheTime: 0,
        staleTime: 10,
        refetchInterval: 5000,
        retry: 1000
    })

    const data: IOpportunityCard[] = query?.data?.data

    return (
        <motion.div
            initial={{ marginLeft: 100 }}
            animate={{ marginLeft: 0 }}
            className="dash">
            <div className="discover-cards-master">
                {data?.map((opportunity: IOpportunityCard) => {
                    return <OpportunityCard
                        {...opportunity}
                    />
                })}
            </div>
        </motion.div>
    )
}