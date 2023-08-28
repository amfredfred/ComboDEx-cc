import useAssets from './Assets';
import Web3Modal from './Ethereum/Web3Modal';
import { HashRouter as HR, Routes, Route, useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import E404Page from './Views/E404Page';
import SharedWallet from './Views/SharedWallet';
import Dashboard from './Views/Dashoard';
import Explorer from './Views/Explorer';
import Info from './Views/Info';
import Snipper from './Views/Snipper';
import Arbitrage from './Views/Arbitrage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WaitListModal from './Views/Partials/Waitlist';
import { useLocalStorage } from 'usehooks-ts';
import { IParams, Params } from './Defaulds';
import { useEffect } from 'react'
import { isAddress } from './Helpers';

export const Routings = () => {
  const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)
  const [param] = useSearchParams({ r: '' })

  useEffect(() => {
    const referee = param.get('ref')
    if (isAddress(String(referee))) {
      storeParams(p => ({ ...p, user: { ...p.user, referee } }))
    }
    return () => { }
  }, [])

  return (
    <Routes>
      {/* <Route path='' element={<Dashboard />} /> */}
      {/* <Route path='shared-wallet' element={<SharedWallet />} /> */}
      {/* <Route path='dashboard' element={<Dashboard />} /> */}
      {/* <Route path='explorer' element={<Explorer />} /> */}
      <Route path='' element={<Snipper />} />
      <Route path='sniper' element={<Snipper />} />
      <Route path='info' element={<Info />} />
      <Route path='arbitrade' element={<Arbitrage />} />
      <Route path='*' element={<E404Page />} />
    </Routes>
  )
}

function App() {
  useAssets()

  return (
    <QueryClientProvider client={new QueryClient}>
      <Web3Modal>
        <HR>
          <Routings />
          <WaitListModal />
          <ToastContainer position='bottom-right' draggable theme='dark' toastStyle={{ boxShadow: '0 0 1px rgba(255,255,255,0.6) inset', borderRadius: 6, overflow: 'hidden' }} />
        </HR>
      </Web3Modal>
    </QueryClientProvider>
  );
}

export default App;
