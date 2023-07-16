import './i.scss'
import WithdrawalCode from './image/wtd.png'
import DepositCode from './image/dep.png'
import SyncCode from './image/sync.png'
import RectLogo from './image/comboex-art.png'
import TwitterIcon from './image/twitter-icon.png'
import TelegramIcon from './image/telegram-icon.png'
import ComboIcon from './image/combodex-logo.png'

interface IAssets {
    images?: {
        [key: string]: string
    }
}

export default function useAssets(get?: "images"): IAssets  {
    const images: IAssets['images'] = {
        'withdraw_code': WithdrawalCode,
        'deposit_code': DepositCode,
        'sync_code': SyncCode,
        'rect_Logo': RectLogo,
        'twitter_icon': TwitterIcon,
        'telegram_icon': TelegramIcon,
        'combo_icon': ComboIcon
    }
    if (get === 'images') return images
    return { images, }
}
