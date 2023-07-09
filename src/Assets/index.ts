import './i.scss'
import WithdrawalCode from './image/wtd.png'
import DepositCode from './image/dep.png'
import SyncCode from './image/sync.png'
import RectLogo from './image/comboex-art.png'

export default function useAssets(get?: "images" ) {
    const images = {
        'withdraw_code': WithdrawalCode,
        'deposit_code': DepositCode,
        'sync_code': SyncCode,
        'rect_Logo': RectLogo
    }
    if (get === 'images') return images
    return { images }
}