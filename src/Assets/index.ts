import './i.scss'
import WithdrawalCode from './image/wtd.png'
import DepositCode from './image/dep.png'
import SyncCode from './image/sync.png'

export default function useAssets(get?: string) {
    const images = {
        'withdraw_code': WithdrawalCode,
        'deposit_code': DepositCode,
        'sync_code': SyncCode,
    }
    if (get === 'images') return images
    return { images }
}