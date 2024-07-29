import '@dialectlabs/blinks/index.css';
import {useEffect, useMemo, useState} from 'react';
import {Action, type ActionAdapter, Blink} from "@dialectlabs/blinks";
import {useActionAdapter, useActionsRegistryInterval} from '@dialectlabs/blinks/react';

// needs to be wrapped with <WalletProvider /> and <WalletModalProvider />
const App = () => {
    // SHOULD be the only instance running (since it's launching an interval)
    const {isRegistryLoaded} = useActionsRegistryInterval();
    const {adapter} = useActionAdapter("https://solana-mainnet.g.alchemy.com/v2/ITJZYemtXDZswsfcino5vXg6ikpUq1zI");

    return isRegistryLoaded ? <ManyActions adapter={adapter}/> : null;
}

const ManyActions = ({adapter}: { adapter: ActionAdapter }) => {
    const apiUrls = useMemo(() => (['https://tensor.dial.to/buy-floor/madlads', 'https://worker.jup.ag/blinks/swap/SOL-Bonk', 'https://sanctum.dial.to/trade/SOL-hSOL', 'https://app.drift.trade/api/blinks/deposit']), []);
    const [actions, setActions] = useState<Action[]>([]);

    useEffect(() => {
        const fetchActions = async () => {
            const promises = apiUrls.map(url => Action.fetch(url).catch(() => null));
            const actions = await Promise.all(promises);

            setActions(actions.filter(Boolean) as Action[]);
        }

        fetchActions();
    }, [apiUrls]);

    // we need to update the adapter every time, since it's dependent on wallet and walletModal states
    useEffect(() => {
        actions.forEach((action) => action.setAdapter(adapter));
    }, [actions, adapter]);

    return <>
        {actions.map(action => (
            <div key={action.url} className="flex gap-2">
                <Blink action={action} websiteText={new URL(action.url).hostname}/>
            </div>
        ))}
    </>
}
export default ManyActions;